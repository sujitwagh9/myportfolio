import { experience } from "@content/experience";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Expandable } from "@/components/ui/expandable";
import { TechRow } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";
import { DeploymentHub } from "./deployment-hub";
import { Section, SectionHeading } from "./section-heading";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        index="02"
        eyebrow="Experience"
        title="Intern to owner."
        intro="I built the Kalyani Group's Data Platform as an intern, and now run it full time."
      />
      <ol className="border-border relative space-y-10 border-l pl-6 md:pl-8">
        {experience.map((job) => (
          <li key={`${job.role}-${job.period}`} className="relative">
            <span
              className={cn(
                "ring-bg absolute top-7 -left-[31px] size-3 rounded-full ring-4 md:-left-[39px]",
                job.current ? "bg-signal" : "bg-accent",
              )}
              aria-hidden
            />
            <Reveal className="glass rounded-[var(--radius-card)] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="flex flex-wrap items-center gap-2 text-2xl font-semibold">
                    {job.role}
                    {job.current ? <Badge tone="signal">current</Badge> : null}
                  </h3>
                  <p className="text-muted mt-1">
                    {job.company}
                    {job.team ? <span className="text-accent-2"> · {job.team}</span> : null}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-muted font-mono text-xs",
                    job.period.includes("[PLACEHOLDER") && "italic",
                  )}
                >
                  {job.period}
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {job.highlights.map((h) => (
                  <div
                    key={h.label}
                    className="bg-surface-2 flex flex-col-reverse rounded-[var(--radius-input)] p-4"
                  >
                    <dt className="text-muted mt-1 font-mono text-[10px] tracking-wide uppercase">
                      {h.label}
                    </dt>
                    <dd
                      className={`font-display text-accent leading-tight font-semibold ${h.value.length > 6 ? "text-xl" : "text-2xl"}`}
                    >
                      <CountUp value={h.value} />
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5">
                <TechRow names={job.stack} max={12} />
              </div>

              {job.entities?.length ? (
                <div className="mt-6">
                  <DeploymentHub entities={job.entities} />
                </div>
              ) : null}

              <Expandable label="Show details" openLabel="Hide details" className="mt-6">
                <p className="text-muted mb-3">{job.summary}</p>
                <ul className="space-y-2.5">
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
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
