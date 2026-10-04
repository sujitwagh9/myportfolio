/**
 * Mock AI mode (AI_MOCK=true): exercises the chat and job-fit UIs end to end without an
 * Gemini API key. Retrieval is real; the "model" output is assembled locally from the
 * retrieved content. Never enable this on a public deployment.
 */
import { skills, skillGroups } from "../../../content/skills";
import type { Chunk } from "../corpus";
import type { Project } from "../content";
import type { JobFitResult } from "./schemas";

export function mockEnabled() {
  return process.env.AI_MOCK === "true";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function firstSentences(text: string, max = 220) {
  const clean = text
    .replace(/\[PLACEHOLDER[^\]]*\]/g, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return stop > 80 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`;
}

/** Yields a canned answer word by word, citing the retrieved sources like the real model. */
export async function* mockChatAnswer(chunks: Chunk[], signal: AbortSignal) {
  const usable = chunks
    .map((c, i) => ({ id: `S${i + 1}`, text: firstSentences(c.text) }))
    .filter((c) => c.text.length > 20)
    .slice(0, 3);

  const answer =
    usable.length === 0
      ? "**Mock mode:** I don't know. Nothing on this site matches that question. Try asking about projects, experience or skills."
      : [
          "**Mock mode:** this answer was assembled locally from the most relevant sources, without calling the AI model.",
          "",
          ...usable.map((c) => `- ${c.text} [${c.id}]`),
        ].join("\n");

  for (const token of answer.split(/(\s+)/)) {
    if (signal.aborted) return;
    yield token;
    if (token.trim()) await sleep(18);
  }
}

const ALIASES: Record<string, string[]> = {
  PostgreSQL: ["postgres", "postgresql"],
  "Git & GitHub": ["git", "github"],
  "C/C++": ["c++", "c/c++"],
  "LLM agents": ["llm", "llms", "ai agents", "agents"],
  "MCP servers": ["mcp", "model context protocol"],
  "Machine Learning": ["machine learning", "ml"],
  "REST APIs": ["rest", "rest api", "apis"],
  CNNs: ["cnn", "cnns", "computer vision", "deep learning"],
  "Next.js": ["next.js", "nextjs"],
  "Node.js": ["node.js", "nodejs", "node"],
  "Power BI": ["power bi", "powerbi"],
  "Azure AD (OIDC)": [
    "azure ad",
    "azure active directory",
    "entra id",
    "oidc",
    "openid connect",
    "sso",
  ],
  "OAuth 2.0": ["oauth", "oauth2", "oauth 2.0"],
  "TLS / SSL": ["tls", "ssl", "https"],
  "Linux & systemd": ["linux", "systemd", "bash", "shell scripting"],
  "Docker Compose": ["docker compose", "docker-compose"],
  "Role-based access": ["rbac", "role-based access", "access control"],
  "Secrets encryption": ["secrets management", "encryption"],
  Prometheus: ["prometheus", "monitoring", "observability"],
};

/** Common requirements the portfolio does not list; used to report gaps in mock mode. */
const GAP_TERMS = [
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Kafka",
  "dbt",
  "Snowflake",
  "Databricks",
  "Terraform",
  "Scala",
  "Java",
  "Go",
  "Tableau",
  "BigQuery",
  "Redshift",
  "Flink",
  "Hadoop",
  "MLOps",
  "PyTorch",
  "TensorFlow",
];

function mentions(haystack: string, term: string) {
  const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(haystack);
}

function termsFor(name: string) {
  return [name, name.replace(/^Apache /, ""), ...(ALIASES[name] ?? [])];
}

const LEVEL = ["", "familiar", "proficient", "daily driver"];

/** Keyword-overlap job fit, shaped exactly like the real structured output. */
export async function mockJobFit(jd: string, projects: Project[]): Promise<JobFitResult> {
  await sleep(900);
  const text = jd.toLowerCase();

  const matched = skills.filter((s) => termsFor(s.name).some((t) => mentions(text, t)));
  // Blank out phrases already credited to a skill, so "Azure AD" doesn't also count as "Azure".
  const remaining = matched
    .flatMap((sk) => termsFor(sk.name))
    .sort((a, b) => b.length - a.length)
    .reduce((acc, term) => acc.split(term.toLowerCase()).join(" "), text);
  const gaps = GAP_TERMS.filter(
    (g) =>
      mentions(remaining, g) &&
      !skills.some((s) => termsFor(s.name).some((t) => t.toLowerCase() === g.toLowerCase())),
  );

  const total = matched.length + gaps.length;
  const score = total === 0 ? 0 : Math.round((100 * matched.length) / total);

  const matchedNames = new Set(matched.map((s) => s.name));
  const relevantProjects = projects
    .map((p) => ({ p, overlap: p.stack.filter((s) => matchedNames.has(s)) }))
    .filter((x) => x.overlap.length > 0)
    .sort((a, b) => b.overlap.length - a.overlap.length || a.p.order - b.p.order)
    .slice(0, 3)
    .map(({ p, overlap }) => ({ slug: p.slug, why: `Uses ${overlap.join(", ")}.` }));

  return {
    score,
    summary:
      total === 0
        ? "Mock mode: no recognisable technical requirements were found in that text, so no score was given."
        : `Mock mode: keyword overlap only, not an AI judgement. ${matched.length} of ${total} recognised requirements appear in the portfolio's skills list.`,
    matchingSkills: matched.map((s) => ({
      skill: s.name,
      evidence: `Listed under ${skillGroups.find((g) => g.id === s.group)?.label ?? s.group} (${LEVEL[s.level]}).`,
    })),
    gaps: gaps.map((g) => ({ requirement: g, note: `No evidence of ${g} on this site.` })),
    relevantProjects,
  };
}
