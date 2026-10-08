"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Experience } from "@content/experience";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { TiltCard } from "@/components/interactive/tilt-card";
import { CountUp } from "@/components/motion/count-up";
import { Badge } from "@/components/ui/badge";
import { Expandable } from "@/components/ui/expandable";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

export type RoleView = Experience & {
  work: { slug: string; title: string; icon?: string; metric?: string; metricLabel?: string }[];
};

/**
 * One company, its roles newest first, joined by a line that fills as you scroll.
 * Each role shows a single line and its numbers; everything else is one click away.
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
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  const start = roles.at(-1)?.period.split("–")[0]?.trim();
  const end = roles[0]?.period.split("–")[1]?.trim();
  const initials = company
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const promoted = roles.length > 1;

  return (
    <div ref={ref}>
      {/* Company header */}
      <Reveal from="left" className="mb-6 flex flex-wrap items-center gap-4">
        <span className="from-accent to-accent-2 text-accent-fg font-display flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold shadow-[0_10px_30px_-10px_var(--accent)]">
          {initials}
        </span>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{company}</h3>
          <p className="text-muted flex flex-wrap items-center gap-x-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {location}
            </span>
            {start && end ? (
              <span className="font-mono text-xs">
                {start} – {end}
              </span>
            ) : null}
          </p>
        </div>
        {promoted ? (
          <Badge tone="signal" className="px-3 py-1 text-xs">
            Intern → Full-time
          </Badge>
        ) : null}
      </Reveal>

      <div className="relative pl-8 md:pl-12">
        {/* Track and scroll-linked fill */}
        <div
          aria-hidden
          className="bg-border absolute top-2 bottom-2 left-[11px] w-0.5 md:left-[19px]"
        />
        <motion.div
          aria-hidden
          style={{ scaleY: reduce ? 1 : fill }}
          className="from-accent to-accent-2 absolute top-2 bottom-2 left-[11px] w-0.5 origin-top bg-gradient-to-b shadow-[0_0_12px_var(--accent)] md:left-[19px]"
        />

        <ol className="space-y-5">
          {roles.map((r) => (
            <li key={`${r.role}-${r.period}`} className="relative">
              {/* Node lights up as the role scrolls into view */}
              <motion.span
                aria-hidden
                className={cn(
                  "ring-bg absolute top-7 -left-[29px] size-3.5 rounded-full ring-4 md:-left-[35px]",
                  r.current ? "bg-signal" : "bg-accent",
                )}
                initial={{ scale: reduce ? 1 : 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              />
              {r.current && !reduce ? (
                <span
                  aria-hidden
                  className="bg-signal/40 absolute top-7 -left-[29px] size-3.5 animate-ping rounded-full md:-left-[35px]"
                />
              ) : null}

              <Reveal from="right">
                <TiltCard max={2} className="glass rounded-[var(--radius-card)] p-6 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                        {r.role}
                        {r.current ? <Badge tone="signal">now</Badge> : null}
                      </h4>
                      {r.team ? (
                        <p className="text-accent-2 mt-0.5 font-mono text-xs">{r.team}</p>
                      ) : null}
                    </div>
                    <span className="border-border text-muted rounded-full border px-3 py-1 font-mono text-[11px]">
                      {r.period}
                    </span>
                  </div>

                  <p className="mt-3 max-w-2xl text-pretty">{r.tagline}</p>

                  <Stagger className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                    {r.highlights.slice(0, 3).map((h) => (
                      <StaggerItem
                        key={h.label}
                        className="bg-surface-2 flex flex-col rounded-[var(--radius-input)] px-4 py-3 sm:min-w-32"
                      >
                        <span className="font-display text-accent text-xl leading-tight font-semibold">
                          <CountUp value={h.value} />
                        </span>
                        <span className="text-muted mt-0.5 font-mono text-[10px] tracking-wide uppercase">
                          {h.label}
                        </span>
                      </StaggerItem>
                    ))}
                  </Stagger>

                  {r.work.length ? (
                    <div className="mt-6">
                      <p className="text-muted mb-3 font-mono text-[10px] tracking-wide uppercase">
                        Key work
                      </p>
                      <Stagger className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {r.work.map((w, i) => (
                          <StaggerItem key={w.slug} variant="pop" i={i}>
                            <TiltCard max={10} className="rounded-[var(--radius-input)]">
                              <Link
                                href={`/projects/${w.slug}`}
                                className="border-border bg-bg/40 hover:border-accent group flex h-full items-center gap-3 rounded-[var(--radius-input)] border p-3 transition-all duration-300 hover:-translate-y-0.5"
                              >
                                <span className="bg-accent/10 text-accent flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110">
                                  <ContentIcon name={w.icon} className="size-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="line-clamp-2 block text-sm leading-snug font-medium">
                                    {w.title}
                                  </span>
                                  {w.metric ? (
                                    <span className="text-muted block truncate font-mono text-[10px]">
                                      {w.metric} · {w.metricLabel}
                                    </span>
                                  ) : null}
                                </span>
                                <ArrowUpRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </Link>
                            </TiltCard>
                          </StaggerItem>
                        ))}
                      </Stagger>
                    </div>
                  ) : null}

                  <div className="border-border mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                    <TechRow names={r.stack} max={8} size="sm" />
                  </div>
                  <Expandable label="Show details" openLabel="Hide details" className="mt-3">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ ease: EASE }}
                    >
                      <p className="text-muted mb-3 text-sm">{r.summary}</p>
                      <ul className="space-y-2">
                        {r.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-sm text-pretty">
                            <span
                              className="bg-accent-2 mt-2 size-1.5 shrink-0 rounded-full"
                              aria-hidden
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </Expandable>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
