"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/interactive/tilt-card";
import { Typewriter } from "@/components/interactive/typewriter";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { LiveShowcase } from "./live-showcase";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const AREAS = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full-stack" },
  { id: "ai", label: "AI & ML" },
  { id: "systems", label: "Systems" },
  { id: "data", label: "Data" },
] as const;

type AreaId = (typeof AREAS)[number]["id"];
const UP_FRONT = 0;

/**
 * The whole Projects section: one filter on top, then the demo showcases, then two repo
 * cards, then the rest of the repos as a deck you can deal out.
 */
export function ProjectsExplorer({ showcased, repos }: { showcased: Project[]; repos: Project[] }) {
  const [area, setArea] = useState<AreaId>("all");
  const [dealt, setDealt] = useState(false);

  const counts = useMemo(() => {
    const all = [...showcased, ...repos];
    const c: Record<string, number> = { all: all.length };
    for (const p of all) for (const a of p.area) c[a] = (c[a] ?? 0) + 1;
    return c;
  }, [showcased, repos]);

  const match = (p: Project) => area === "all" || p.area.includes(area);
  const demos = showcased.filter(match);
  const shownRepos = repos.filter(match);
  const front = shownRepos.slice(0, UP_FRONT);
  const rest = shownRepos.slice(UP_FRONT);

  return (
    <div className="space-y-6">
      <div role="toolbar" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {AREAS.filter((a) => counts[a.id]).map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={area === a.id}
            onClick={() => {
              setArea(a.id);
              setDealt(false);
            }}
            className={cn(
              "relative rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              area === a.id
                ? "text-accent-fg border-transparent"
                : "border-border text-muted hover:text-fg",
            )}
          >
            {area === a.id ? (
              <motion.span
                layoutId="project-filter-pill"
                className="bg-accent absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
            {a.label}
            <span className="ml-1.5 font-mono text-[10px] opacity-70">{counts[a.id]}</span>
          </button>
        ))}
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {demos.map((p) => (
          <motion.div
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <LiveShowcase project={p} />
          </motion.div>
        ))}
      </AnimatePresence>

      {front.length ? (
        <motion.ul layout className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false} mode="popLayout">
            {front.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="min-w-0"
              >
                <ProjectCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : null}

      {rest.length ? (
        dealt ? (
          <div className="space-y-4">
            <ul className="grid gap-4 md:grid-cols-2">
              {rest.map((p, i) => (
                <motion.li
                  key={p.slug}
                  className="min-w-0"
                  initial={{
                    opacity: 0,
                    y: -120,
                    rotate: (i % 2 ? 1 : -1) * (8 + (i % 3) * 4),
                    scale: 0.85,
                  }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18, delay: i * 0.09 }}
                >
                  <ProjectCard project={p} />
                </motion.li>
              ))}
            </ul>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setDealt(false)}
                className="border-border text-muted hover:text-fg rounded-full border px-4 py-1.5 font-mono text-xs transition-colors"
              >
                gather them back ↑
              </button>
            </div>
          </div>
        ) : (
          <Deck projects={rest} onDeal={() => setDealt(true)} />
        )
      ) : null}

      {demos.length + shownRepos.length === 0 ? (
        <p className="text-muted text-sm">Nothing here yet.</p>
      ) : null}
    </div>
  );
}

/** The remaining repos as a stacked deck of cards. Hover fans it; click deals them out. */
function Deck({ projects, onDeal }: { projects: Project[]; onDeal: () => void }) {
  const reduce = useReducedMotion();
  const top = projects.slice(0, 4);
  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <motion.button
        type="button"
        onClick={onDeal}
        data-cursor="Deal"
        initial="rest"
        whileHover="fan"
        whileTap="tap"
        aria-label={`Show ${projects.length} more projects`}
        className="relative h-40 w-full max-w-sm"
      >
        {top
          .map((p, i) => (
            <motion.div
              key={p.slug}
              variants={{
                rest: { rotate: (i - 1.5) * 3, x: 0, y: i * -5 },
                fan: reduce
                  ? { rotate: 0, x: 0, y: i * -5 }
                  : { rotate: (i - 1.5) * 11, x: (i - 1.5) * 46, y: -8 - Math.abs(i - 1.5) * -6 },
                tap: { scale: 0.96 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ zIndex: i, transformOrigin: "50% 120%" }}
              className="border-border bg-surface absolute inset-x-8 top-6 flex h-32 flex-col overflow-hidden rounded-2xl border text-left shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)]"
            >
              <span className="border-border bg-surface-2 flex items-center gap-1 border-b px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-[#FF5F57]" />
                <span className="size-1.5 rounded-full bg-[#FEBC2E]" />
                <span className="size-1.5 rounded-full bg-[#28C840]" />
                <span className="text-muted ml-2 truncate font-mono text-[9px]">
                  ~/projects/{p.slug}
                </span>
              </span>
              <span className="flex flex-1 items-center gap-3 px-4">
                <ContentIcon name={p.icon} className="text-accent size-6 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{p.title}</span>
                  <span className="text-muted line-clamp-1 text-xs">{p.tagline}</span>
                </span>
              </span>
            </motion.div>
          ))
          .reverse()}
      </motion.button>
      <p className="text-muted font-mono text-xs">
        <span className="text-accent">{projects.length} more projects</span> · tap the deck to deal
        them out
      </p>
    </div>
  );
}

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <TiltCard max={6} className="rounded-[var(--radius-card)]">
      <Link
        href={`/projects/${p.slug}`}
        className="border-border bg-surface group hover:border-accent/60 flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] transition-colors duration-300"
      >
        <div className="border-border bg-surface-2 flex items-center gap-3 border-b px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[#FF5F57]" />
            <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="size-2.5 rounded-full bg-[#28C840]" />
          </span>
          <span className="text-muted group-hover:text-fg min-w-0 flex-1 truncate text-center font-mono text-[11px] transition-colors">
            ~/projects/{p.slug}
          </span>
          <ArrowUpRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div>
            <h3 className="text-xl font-semibold text-balance">{p.title}</h3>
            <p className="text-muted mt-2 text-sm text-pretty">{p.tagline ?? p.summary}</p>
          </div>

          {p.metric ? (
            <div className="bg-bg/60 border-border rounded-[var(--radius-input)] border px-3 py-2.5 font-mono text-xs sm:text-sm">
              <span className="text-signal">$</span> <span className="text-muted">result</span>{" "}
              <span className="text-muted">→</span>{" "}
              <Typewriter
                text={`${p.metric} · ${p.metricLabel ?? ""}`.replace(/ · $/, "")}
                className="text-accent font-semibold"
              />
            </div>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-3">
            <TechRow names={p.stack} max={5} size="sm" />
            <span className="text-accent shrink-0 font-mono text-xs opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:-translate-x-2">
              open →
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
