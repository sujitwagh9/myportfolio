"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Loader2,
  WandSparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { JobFitResult } from "@/lib/ai/schemas";

type Result = Omit<JobFitResult, "relevantProjects"> & {
  mock?: boolean;
  relevantProjects: { slug: string; why: string; title: string; href: string }[];
};

const MAX = 8000;

export function JobFitAnalyzer() {
  const [jd, setJd] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/job-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Analysis failed. Please try again.");
      setResult(data);
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form
        onSubmit={analyze}
        className="glass flex flex-col gap-3 rounded-[var(--radius-card)] p-5"
      >
        <label htmlFor="jd" className="text-muted font-mono text-xs tracking-wide uppercase">
          Paste a job description
        </label>
        <Textarea
          id="jd"
          value={jd}
          maxLength={MAX}
          onChange={(e) => setJd(e.target.value)}
          placeholder="e.g. We are hiring a Data Engineer to build ingestion pipelines with Airflow and Spark…"
          className="min-h-64 flex-1"
          required
          minLength={80}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted font-mono text-[11px]">
            {jd.length}/{MAX} · not stored
          </span>
          <Button type="submit" disabled={state === "loading" || jd.trim().length < 80}>
            {state === "loading" ? <Loader2 className="animate-spin" /> : <WandSparkles />}
            {state === "loading" ? "Analysing…" : "Analyse fit"}
          </Button>
        </div>
      </form>

      <div
        className="glass min-h-80 rounded-[var(--radius-card)] p-5"
        aria-live="polite"
        aria-busy={state === "loading"}
      >
        {state === "idle" ? (
          <div className="text-muted flex h-full flex-col items-center justify-center gap-2 text-center text-sm">
            <CircleDashed className="size-8" />
            <p>
              You&apos;ll get a match score, matching skills, gaps, and the most relevant projects.
            </p>
            <p className="text-xs">The analysis only uses what is on this site.</p>
          </div>
        ) : null}
        {state === "loading" ? <ResultSkeleton /> : null}
        {state === "error" ? (
          <div className="text-danger flex h-full flex-col items-center justify-center gap-3 text-center text-sm">
            <AlertCircle className="size-8" />
            <p>{error}</p>
          </div>
        ) : null}
        {state === "done" && result ? <ResultView result={result} /> : null}
      </div>
    </div>
  );
}

function ResultView({ result }: { result: Result }) {
  return (
    <div className="space-y-6">
      {result.mock ? <Badge tone="danger">mock mode: keyword overlap, not AI</Badge> : null}
      <div className="flex items-center gap-5">
        <ScoreRing score={result.score} />
        <p className="text-sm leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <section>
          <h4 className="text-signal mb-2 font-mono text-xs tracking-wide uppercase">
            Matching skills
          </h4>
          {result.matchingSkills.length ? (
            <ul className="space-y-2">
              {result.matchingSkills.map((s) => (
                <li key={s.skill} className="flex gap-2 text-sm">
                  <CheckCircle2 className="text-signal mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong className="font-medium">{s.skill}</strong>
                    <span className="text-muted block text-xs">{s.evidence}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">None found.</p>
          )}
        </section>
        <section>
          <h4 className="text-danger mb-2 font-mono text-xs tracking-wide uppercase">Gaps</h4>
          {result.gaps.length ? (
            <ul className="space-y-2">
              {result.gaps.map((g) => (
                <li key={g.requirement} className="flex gap-2 text-sm">
                  <CircleDashed className="text-danger mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong className="font-medium">{g.requirement}</strong>
                    <span className="text-muted block text-xs">{g.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">No obvious gaps.</p>
          )}
        </section>
      </div>

      {result.relevantProjects.length ? (
        <section>
          <h4 className="text-accent-2 mb-2 font-mono text-xs tracking-wide uppercase">
            Most relevant projects
          </h4>
          <ul className="grid gap-2">
            {result.relevantProjects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={p.href}
                  className="group border-border hover:border-accent-2 flex items-start justify-between gap-3 rounded-[var(--radius-input)] border p-3 text-sm transition-colors"
                >
                  <span>
                    <span className="font-medium">{p.title}</span>
                    <span className="text-muted block text-xs">{p.why}</span>
                  </span>
                  <ArrowRight className="text-muted mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const reduce = useReducedMotion();
  const r = 36;
  const c = 2 * Math.PI * r;
  const color = score >= 70 ? "var(--signal)" : score >= 45 ? "var(--accent)" : "var(--danger)";
  return (
    <div
      className="relative size-24 shrink-0"
      role="img"
      aria-label={`Match score ${score} out of 100`}
    >
      <svg viewBox="0 0 88 88" className="size-full -rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <motion.circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="font-display absolute inset-0 flex items-center justify-center text-2xl font-semibold">
        {score}
      </span>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-label="Loading analysis">
      <div className="flex items-center gap-5">
        <div className="bg-surface-2 size-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-surface-2 h-3 rounded" />
          <div className="bg-surface-2 h-3 w-4/5 rounded" />
        </div>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-surface-2 h-10 rounded-[var(--radius-input)]" />
      ))}
    </div>
  );
}
