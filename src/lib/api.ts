import "server-only";
import { NextResponse } from "next/server";
import { clientIp, logRequest, rateLimit } from "./rate-limit";

/** Shared guard for AI routes: rate limit by IP and return a JSON error on refusal. */
export async function guard(req: Request, route: string, limit: number, windowSeconds: number) {
  const startedAt = Date.now();
  const ip = clientIp(req.headers);
  const rl = await rateLimit(`${route}:${ip}`, limit, windowSeconds);
  const log = (status: number) => logRequest(route, ip, status, startedAt);
  if (!rl.ok) {
    log(429);
    return {
      blocked: NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } },
      ),
      log,
    };
  }
  return { blocked: null, log };
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJson(req: Request, maxBytes = 40_000): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new Error("too_large");
  return JSON.parse(text);
}
