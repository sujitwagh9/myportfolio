import { NextResponse } from "next/server";
import { z } from "zod";
import { aiEnabled, BLOCKED_FINISH, getClient, MODEL, publicErrorMessage } from "@/lib/ai/gemini";
import { mockEnabled, mockJobFit } from "@/lib/ai/mock";
import { JOB_FIT_SYSTEM, jobFitUserTurn } from "@/lib/ai/prompts";
import { allChunks, retrieve } from "@/lib/ai/retrieve";
import { jobFitRequestSchema, jobFitResultSchema, type JobFitResult } from "@/lib/ai/schemas";
import { guard, jsonError, readJson } from "@/lib/api";
import { getProjects } from "@/lib/content";
import { neutralizeTags, sanitizeText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { blocked, log } = await guard(req, "job-fit", 6, 600);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    log(400);
    return jsonError("Invalid request.", 400);
  }
  const parsed = jobFitRequestSchema.safeParse(body);
  if (!parsed.success) {
    log(400);
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid job description.", 400);
  }
  const mock = mockEnabled();
  if (!mock && !aiEnabled()) {
    log(503);
    return jsonError("The job-fit analyzer is not configured on this deployment.", 503);
  }

  const jd = neutralizeTags(sanitizeText(parsed.data.jobDescription, 8000));
  const projects = getProjects();
  const slugs = projects.map((p) => p.slug);

  // Always include experience, skills and project summaries, plus the most relevant details.
  const base = allChunks().filter(
    (c) =>
      c.section === "experience" ||
      c.section === "skills" ||
      c.section === "education" ||
      (c.section === "projects" && c.id === `project-${c.slug}`),
  );
  const { hits } = await retrieve(jd.slice(0, 2000), {
    k: 8,
    sections: ["projects", "architecture"],
  });
  const seen = new Set(base.map((c) => c.id));
  const chunks = [...base, ...hits.map((h) => h.chunk).filter((c) => !seen.has(c.id))];

  const responseJsonSchema = z.toJSONSchema(jobFitResultSchema);
  const run = () =>
    getClient().models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: jobFitUserTurn(jd, chunks, slugs) }] }],
      config: {
        systemInstruction: JOB_FIT_SYSTEM,
        maxOutputTokens: 4000,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema,
      },
    });

  try {
    let result: JobFitResult | null = mock ? await mockJobFit(jd, projects) : null;
    for (let attempt = 0; attempt < 2 && !result; attempt++) {
      const res = await run();
      const finish = res.candidates?.[0]?.finishReason;
      if (res.promptFeedback?.blockReason || (finish && BLOCKED_FINISH.has(finish))) {
        log(422);
        return jsonError("That text could not be analysed. Please paste a job description.", 422);
      }
      try {
        const check = jobFitResultSchema.safeParse(JSON.parse(res.text ?? ""));
        if (check.success) result = check.data;
      } catch {
        // Malformed JSON: retry once.
      }
    }
    if (!result) {
      log(502);
      return jsonError("The analysis came back incomplete. Please try again.", 502);
    }

    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    const clean = {
      ...result,
      mock,
      score: Math.max(0, Math.min(100, Math.round(result.score))),
      relevantProjects: result.relevantProjects
        .filter((p) => bySlug.has(p.slug))
        .slice(0, 3)
        .map((p) => ({ ...p, title: bySlug.get(p.slug)!.title, href: `/projects/${p.slug}` })),
    };
    log(200);
    return NextResponse.json(clean, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    log(502);
    return jsonError(publicErrorMessage(err), 502);
  }
}
