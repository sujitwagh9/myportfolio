import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/interactive/tilt-card";
import { Typewriter } from "@/components/interactive/typewriter";
import { Reveal } from "@/components/motion/reveal";
import { TechRow } from "@/components/ui/tech-icon";
import type { Project } from "@/lib/content";

/**
 * Personal projects as small terminal windows. Work case studies live under Experience.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p.slug} className="min-w-0">
          <Reveal delay={i * 0.08} from={i % 2 ? "right" : "left"} className="h-full">
            <TiltCard max={6} className="rounded-[var(--radius-card)]">
              <Link
                href={`/projects/${p.slug}`}
                className="border-border bg-surface group hover:border-accent/60 flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] transition-colors duration-300"
              >
                {/* Window chrome */}
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

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <div>
                    <span className="text-accent font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold text-balance">{p.title}</h3>
                    <p className="text-muted mt-2 text-sm text-pretty">{p.tagline ?? p.summary}</p>
                  </div>

                  {p.metric ? (
                    <div className="bg-bg/60 border-border rounded-[var(--radius-input)] border px-3 py-2.5 font-mono text-xs sm:text-sm">
                      <span className="text-signal">$</span>{" "}
                      <span className="text-muted">result</span>{" "}
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
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
