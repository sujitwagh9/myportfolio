import "server-only";
import { createHash } from "node:crypto";

type Result = { ok: boolean; remaining: number; resetSeconds: number };

const memory = new Map<string, number[]>();

/**
 * Per-IP limiter. Uses Upstash Redis (REST) when UPSTASH_REDIS_REST_URL/TOKEN are set,
 * which is needed on Vercel where instances do not share memory. Otherwise an in-memory
 * sliding window, which is correct for a single self-hosted container.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<Result> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
      const redisKey = `rl:${key}:${bucket}`;
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["EXPIRE", redisKey, String(windowSeconds)],
        ]),
        signal: AbortSignal.timeout(2000),
      });
      const data = (await res.json()) as { result: number }[];
      const count = data[0]?.result ?? 0;
      const resetSeconds = windowSeconds - (Math.floor(Date.now() / 1000) % windowSeconds);
      return { ok: count <= limit, remaining: Math.max(0, limit - count), resetSeconds };
    } catch {
      // Redis unavailable: fall back to memory rather than failing open globally.
    }
  }

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const hits = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  const ok = hits.length < limit;
  if (ok) hits.push(now);
  memory.set(key, hits);
  if (memory.size > 10_000) memory.delete(memory.keys().next().value as string);
  const resetSeconds = Math.ceil((windowMs - (now - (hits[0] ?? now))) / 1000);
  return { ok, remaining: Math.max(0, limit - hits.length), resetSeconds };
}

export function clientIp(headers: Headers) {
  const fwd = headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Short, salted hash so logs can correlate requests without storing IPs. */
export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.LOG_SALT ?? "portfolio"}:${ip}`)
    .digest("hex")
    .slice(0, 12);
}

export function logRequest(route: string, ip: string, status: number, startedAt: number) {
  if (process.env.NODE_ENV === "test") return;
  console.info(JSON.stringify({ route, client: hashIp(ip), status, ms: Date.now() - startedAt }));
}
