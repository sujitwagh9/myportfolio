import { NextResponse } from "next/server";
import { retrieve } from "@/lib/ai/retrieve";
import { searchRequestSchema } from "@/lib/ai/schemas";
import { guard, jsonError } from "@/lib/api";
import { getPosts, getProjects } from "@/lib/content";
import { sanitizeText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { blocked, log } = await guard(req, "search", 60, 60);
  if (blocked) return blocked;

  const q = sanitizeText(new URL(req.url).searchParams.get("q") ?? "", 200);
  const parsed = searchRequestSchema.safeParse({ q });
  if (!parsed.success) {
    log(400);
    return jsonError("Type at least 2 characters.", 400);
  }

  const { hits, mode } = await retrieve(parsed.data.q, { k: 20, sections: ["projects", "blog"] });
  const meta = new Map<string, { title: string; summary: string; kind: "project" | "post" }>();
  for (const p of getProjects())
    meta.set(`/projects/${p.slug}`, { title: p.title, summary: p.summary, kind: "project" });
  for (const p of getPosts())
    meta.set(`/blog/${p.slug}`, { title: p.title, summary: p.summary, kind: "post" });

  // Keep the best-scoring chunk per document.
  const best = new Map<string, number>();
  for (const h of hits) if (!best.has(h.chunk.href)) best.set(h.chunk.href, h.score);

  const results = [...best.entries()]
    .filter(([href]) => meta.has(href))
    .slice(0, 8)
    .map(([href, score]) => ({ href, score: Number(score.toFixed(3)), ...meta.get(href)! }));

  log(200);
  return NextResponse.json({ mode, results }, { headers: { "Cache-Control": "no-store" } });
}
