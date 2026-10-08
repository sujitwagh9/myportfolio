"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Experience } from "@content/experience";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, SPRING } from "@/components/motion/reveal";
import { Expandable } from "@/components/ui/expandable";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

export type RoleView = Experience & {
  work: { slug: string; title: string; icon?: string; metric?: string; metricLabel?: string }[];
};

/**
 * One company: roles on the left as a clickable timeline, the selected role on the right.
 * Only one role's details are on screen at a time, so it reads at a glance.
 */
export function ExperienceTimeline({
  company,
  location,
  roles,
}: {
  company: string;
  location: string;
  roles: RoleView[];
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const role = roles[active]!;
  const start = roles.at(-1)?.period.split("–")[0]?.trim();
  const initials = company
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  function onKey(e: React.KeyboardEvent) {
    const dir =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + roles.length) % roles.length;
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  return (
    <Reveal from="up" className="glass overflow-hidden rounded-[var(--radius-card)]">
      <div className="grid md:grid-cols-[280px_1fr]">
        {/* ── Left: company + role timeline ───────────────────────────── */}
        <div className="border-border bg-surface-2/40 border-b p-5 md:border-r md:border-b-0 md:p-6">
          <div className="flex items-center gap-3">
            <span className="from-accent to-accent-2 text-accent-fg font-display flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold">
              {initials}
            </span>
            <div>
              <h3 className="leading-tight font-semibold">{company}</h3>
              <p className="text-muted flex items-center gap-1 text-xs">
                <MapPin className="size-3" /> {location}
              </p>
              {start ? <p className="text-muted font-mono text-[10px]">since {start}</p> : null}
            </div>
          </div>

          <div
            role="tablist"
            aria-label={`Roles at ${company}`}
            aria-orientation="vertical"
            className="relative mt-6 grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-1"
          >
            {/* Vertical track (desktop) */}
            <span
              aria-hidden
              className="bg-border absolute top-3 bottom-3 left-[13px] hidden w-px md:block"
            />
            {roles.map((r, i) => {
              const selected = i === active;
              return (
                <button
                  key={`${r.role}-${r.period}`}
                  id={`${uid}-tab-${i}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                  className="group relative rounded-[var(--radius-input)] px-3 py-3 text-left md:pl-9"
                >
                  {selected ? (
                    <motion.span
                      layoutId={`${uid}-pill`}
                      transition={
                        reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }
                      }
                      className="bg-surface border-accent/40 absolute inset-0 rounded-[var(--radius-input)] border shadow-sm"
                    />
                  ) : null}
                  {/* Timeline dot (desktop) */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-[18px] left-[9px] hidden size-[9px] rounded-full ring-4 ring-[var(--surface-2)] transition-colors md:block",
                      selected
                        ? r.current
                          ? "bg-signal"
                          : "bg-accent"
                        : "bg-border group-hover:bg-muted",
                    )}
                  />
                  <span className="relative block">
                    <span
                      className={cn(
                        "block text-sm font-semibold transition-colors",
                        !selected && "text-muted group-hover:text-fg",
                      )}
                    >
                      {r.role}
                      {r.current ? (
                        <span className="text-signal ml-1.5 inline-flex items-center gap-1 align-middle font-mono text-[10px] font-normal">
                          <span className="bg-signal size-1.5 animate-pulse rounded-full" /> now
                        </span>
                      ) : null}
                    </span>
                    <span className="text-muted font-mono text-[10px]">{r.period}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {roles.length > 1 ? (
            <p className="text-muted mt-5 hidden font-mono text-[10px] md:block">
              {roles.at(-1)!.role} → {roles[0]!.role}
            </p>
          ) : null}
        </div>

        {/* ── Right: selected role ────────────────────────────────────── */}
        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${active}`}
          className="relative p-5 md:p-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ ...SPRING, filter: { duration: 0.3 } }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-2xl font-semibold md:text-3xl">{role.role}</h4>
                {role.team ? (
                  <span className="text-accent-2 font-mono text-xs">{role.team}</span>
                ) : null}
              </div>
              <p className="text-muted mt-2 max-w-xl text-pretty">{role.tagline}</p>

              {/* Numbers, separated by hairlines rather than boxed */}
              <dl className="divide-border mt-6 flex flex-wrap divide-x">
                {role.highlights.slice(0, 3).map((h) => (
                  <div key={h.label} className="flex flex-col-reverse px-5 first:pl-0">
                    <dt className="text-muted mt-1 font-mono text-[10px] tracking-wide uppercase">
                      {h.label}
                    </dt>
                    <dd className="font-display text-accent text-2xl leading-none font-semibold md:text-3xl">
                      <CountUp value={h.value} />
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Everything beyond the headline is opt-in. */}
              <Expandable label="Read more" openLabel="Show less" className="mt-6">
                {role.work.length ? (
                  <div>
                    <p className="text-muted mb-2 font-mono text-[10px] tracking-wide uppercase">
                      Key work
                    </p>
                    <ul className="divide-border border-border divide-y border-y">
                      {role.work.map((w, i) => (
                        <motion.li
                          key={w.slug}
                          initial={reduce ? false : { opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...SPRING, delay: 0.08 + i * 0.05 }}
                        >
                          <Link
                            href={`/projects/${w.slug}`}
                            className="group relative flex items-center gap-4 py-3 pr-2 transition-[padding] duration-300 hover:pl-3"
                          >
                            <span
                              aria-hidden
                              className="bg-accent absolute top-1/2 left-0 h-0 w-0.5 -translate-y-1/2 rounded-full transition-all duration-300 group-hover:h-2/3"
                            />
                            <span className="bg-accent/10 text-accent flex size-8 shrink-0 items-center justify-center rounded-lg">
                              <ContentIcon name={w.icon} className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1 text-sm font-medium">{w.title}</span>
                            {w.metric && !/^\d+$/.test(w.metric) ? (
                              <span className="text-muted hidden shrink-0 font-mono text-xs sm:block">
                                {w.metric}
                              </span>
                            ) : null}
                            <ArrowUpRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // No case studies yet: show what the role involves, in the same list style.
                  <div>
                    <p className="text-muted mb-2 font-mono text-[10px] tracking-wide uppercase">
                      {role.current ? "What I do now" : "What I did"}
                    </p>
                    <ul className="divide-border border-border divide-y border-y">
                      {role.bullets.map((b, i) => (
                        <motion.li
                          key={b}
                          initial={reduce ? false : { opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...SPRING, delay: 0.08 + i * 0.05 }}
                          className="flex items-start gap-4 py-3 text-sm"
                        >
                          <span className="text-accent mt-0.5 font-mono text-xs">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-pretty">{b}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <TechRow names={role.stack} max={9} size="sm" />
                </div>

                {role.work.length ? (
                  <div className="mt-6">
                    <p className="text-muted mb-2 font-mono text-[10px] tracking-wide uppercase">
                      Full details
                    </p>
                    <p className="text-muted mb-3 text-sm">{role.summary}</p>
                    <ul className="space-y-2">
                      {role.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm text-pretty">
                          <span
                            className="bg-accent-2 mt-2 size-1.5 shrink-0 rounded-full"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Expandable>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}
