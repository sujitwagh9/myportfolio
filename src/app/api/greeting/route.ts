import { NextResponse } from "next/server";
import { aiEnabled, getClient, MODEL } from "@/lib/ai/gemini";
import { mockEnabled } from "@/lib/ai/mock";
import { GREETING_SYSTEM } from "@/lib/ai/prompts";
import { greetingRequestSchema } from "@/lib/ai/schemas";
import { guard, jsonError, readJson } from "@/lib/api";
import { sanitizeText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATIC: Record<string, string> = {
  hiring:
    "Hiring for data or AI engineering? Start with the job-fit analyzer, or ask my AI anything about my work.",
  collaboration:
    "Building something with data? Have a look at the projects, then let's talk about working together.",
  consulting:
    "Planning a self-hosted data platform? Explore the architecture playground to see how I build them.",
  browsing: "Welcome. Have a look around, or ask my AI anything about my projects and experience.",
};

// Generated lines are cached per intent: there are only four, so this caps cost.
const cache = new Map<string, { text: string; at: number }>();
const TTL = 1000 * 60 * 60 * 6;

export async function POST(req: Request) {
  const { blocked, log } = await guard(req, "greeting", 10, 600);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await readJson(req, 200);
  } catch {
    log(400);
    return jsonError("Invalid request.", 400);
  }
  const parsed = greetingRequestSchema.safeParse(body);
  if (!parsed.success) {
    log(400);
    return jsonError("Unknown intent.", 400);
  }
  const { intent } = parsed.data;

  const hit = cache.get(intent);
  if (hit && Date.now() - hit.at < TTL) {
    log(200);
    return NextResponse.json({ text: hit.text, source: "ai" });
  }
  if (mockEnabled() || !aiEnabled()) {
    log(200);
    return NextResponse.json({ text: STATIC[intent], source: "static" });
  }

  try {
    const res = await getClient().models.generateContent({
      model: MODEL,
      contents: `Visitor intent: ${intent}`,
      config: { systemInstruction: GREETING_SYSTEM, maxOutputTokens: 200, temperature: 0.7 },
    });
    const text = sanitizeText(res.text ?? "", 220).replace(/^["']|["']$/g, "");
    if (!text) throw new Error("empty");
    cache.set(intent, { text, at: Date.now() });
    log(200);
    return NextResponse.json({ text, source: "ai" });
  } catch {
    log(200);
    return NextResponse.json({ text: STATIC[intent], source: "static" });
  }
}
