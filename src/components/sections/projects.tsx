import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const TINTS = ["from-accent/20", "from-accent-2/20", "from-signal/15"];

/** Personal projects only. Work case studies are linked from the Experience section. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p.slug}>
          <Reveal delay={i * 0.05} className="h-full">
            <Link
              href={`/projects/${p.slug}`}
              className="glass group hover:border-accent flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] transition-[border-color,transform] duration-300 hover:-translate-y-1"
            >
              <div
                className={cn(
                  "relative flex min-h-40 flex-col justify-end overflow-hidden bg-gradient-to-br to-transparent p-6",
                  TINTS[i % TINTS.length],
                )}
              >
                <ContentIcon
                  name={p.icon}
                  className="text-fg/10 absolute -top-4 -right-4 size-36 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                />
                {p.metric ? (
                  <>
                    <p className="font-display relative text-4xl leading-none font-semibold">
                      {p.metric}
                    </p>
                    <p className="text-muted relative mt-2 font-mono text-[11px] tracking-wide uppercase">
                      {p.metricLabel}
                    </p>
                  </>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-balance">{p.title}</h3>
                  <ArrowUpRight className="text-muted group-hover:text-accent size-5 shrink-0" />
                </div>
                <p className="text-muted flex-1 text-sm">{p.tagline ?? p.summary}</p>
                <TechRow names={p.stack} max={5} size="sm" />
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
