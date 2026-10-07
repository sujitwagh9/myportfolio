import { z } from "zod";

const message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(message)
    .min(1)
    .max(12)
    .refine((m) => m[m.length - 1]?.role === "user", "Last message must be from the user"),
});

export const jobFitRequestSchema = z.object({
  jobDescription: z.string().min(80, "Please paste a longer job description.").max(8000),
});

export const searchRequestSchema = z.object({
  q: z.string().min(2).max(200),
});

/** Shape the model must return for the job-fit analyzer (validated again after parsing). */
export const jobFitResultSchema = z.object({
  score: z.number().describe("Integer 0-100"),
  summary: z.string(),
  matchingSkills: z.array(z.object({ skill: z.string(), evidence: z.string() })),
  gaps: z.array(z.object({ requirement: z.string(), note: z.string() })),
  relevantProjects: z.array(z.object({ slug: z.string(), why: z.string() })),
});

export type JobFitResult = z.infer<typeof jobFitResultSchema>;
export type ChatSource = { id: string; title: string; href: string; section: string };

/** NDJSON events streamed by /api/chat. */
export type ChatEvent =
  | { type: "sources"; sources: ChatSource[]; mode: "semantic" | "keyword"; mock?: boolean }
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };
