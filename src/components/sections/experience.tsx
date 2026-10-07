import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@content/experience";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Expandable } from "@/components/ui/expandable";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { getProjects } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./section-heading";

export function Experience() {
  const bySlug = new Map(getProjects().map((p) => [p.slug, p]));
  return (
    <Section id="experience">
      <SectionHeading index="02" eyebrow="Experience" title="Where I work." />
      <ol className="space-y-6">
        {experience.map((job) => {
          const work = (job.caseStudies ?? []).map((s) => bySlug.get(s)).filter((p) => !!p);
          return (
            <li key={`${job.role}-${job.period}`}>
              <Reveal className="glass rounded-[var(--radius-card)] p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold md:text-2xl">
                    {job.role}
                    <span className="text-muted font-normal">· {job.company}</span>
                    {job.current ? <Badge tone="signal">now</Badge> : null}
                  </h3>
                  <span className="text-muted font-mono text-xs">{job.period}</span>
                </div>

                <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                  {job.highlights.slice(0, 3).map((h) => (
                    <div key={h.label} className="flex flex-col-reverse">
                      <dt className="text-muted font-mono text-[10px] tracking-wide uppercase">
                        {h.label}
                      </dt>
                      <dd className="font-display text-accent text-2xl font-semibold">{h.value}</dd>
                    </div>
                  ))}
                </dl>

                {work.length ? (
                  <div className="mt-6">
                    <p className="text-muted mb-2 font-mono text-[10px] tracking-wide uppercase">
                      Key work
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {work.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/projects/${p.slug}`}
                            className="border-border hover:border-accent group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
                          >
                            <ContentIcon name={p.icon} className="text-accent size-3.5" />
                            {p.title.replace(/:.*$/, "")}
                            <ArrowUpRight className="text-muted group-hover:text-accent size-3.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <TechRow names={job.stack} max={8} size="sm" />
                  <Expandable label="Show details" openLabel="Hide details" className="w-full">
                    <p className="text-muted mb-3 text-sm">{job.summary}</p>
                    <ul className="space-y-2">
                      {job.bullets.map((b) => (
                        <li
                          key={b}
                          className={cn(
                            "flex gap-3 text-sm text-pretty",
                            b.includes("[PLACEHOLDER") && "text-muted italic",
                          )}
                        >
                          <span
                            className="bg-accent-2 mt-2 size-1.5 shrink-0 rounded-full"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Expandable>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
