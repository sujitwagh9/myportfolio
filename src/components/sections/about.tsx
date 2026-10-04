import { GraduationCap } from "lucide-react";
import { site } from "@content/site";
import { Reveal } from "@/components/motion/reveal";
import { Expandable } from "@/components/ui/expandable";
import { ContentIcon } from "@/components/ui/icon";
import { TechIcon } from "@/components/ui/tech-icon";
import { Section, SectionHeading } from "./section-heading";

const CORE = [
  "Apache NiFi",
  "Apache Superset",
  "PostgreSQL",
  "Docker",
  "Nginx",
  "Grafana",
  "Prometheus",
  "Python",
];

export function About() {
  return (
    <Section id="about">
      <SectionHeading index="01" eyebrow="About" title="Data plumbing, done properly." />
      <div className="grid gap-4 md:grid-cols-6">
        {/* Intro: one sentence up front, the full story on demand. */}
        <Reveal className="glass rounded-[var(--radius-card)] p-7 md:col-span-4">
          <p className="text-xl leading-relaxed text-pretty md:text-2xl">{site.about.intro}</p>
          <Expandable label="Read my story" className="mt-5">
            <div className="text-muted space-y-3 leading-relaxed">
              {site.about.story.map((p) => (
                <p key={p} className={p.includes("[PLACEHOLDER") ? "italic" : undefined}>
                  {p}
                </p>
              ))}
              <ul className="space-y-1.5 pt-2">
                {site.about.values.map((v) => (
                  <li key={v} className="flex gap-2">
                    <span className="text-accent" aria-hidden>
                      ✦
                    </span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </Expandable>
        </Reveal>

        {/* Core stack as logos. */}
        <Reveal delay={0.05} className="glass rounded-[var(--radius-card)] p-6 md:col-span-2">
          <h3 className="text-muted mb-4 font-mono text-xs tracking-wide uppercase">Daily stack</h3>
          <ul className="grid grid-cols-4 gap-3">
            {CORE.map((t) => (
              <li
                key={t}
                title={t}
                className="bg-surface-2 flex aspect-square items-center justify-center rounded-[var(--radius-input)]"
              >
                <TechIcon name={t} className="size-7" />
                <span className="sr-only">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* What I do, as icon tiles. */}
        <Reveal className="md:col-span-6">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {site.about.whatIDo.map((w) => (
              <li
                key={w.text}
                className="glass flex flex-col gap-3 rounded-[var(--radius-card)] p-5"
              >
                <TechIcon name={w.tech} className="size-6" />
                <span className="text-sm leading-snug">{w.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Achievements: trophy cards. */}
        {site.achievements.map((a, i) => (
          <Reveal
            key={a.title}
            delay={0.05 * i}
            className={`glass flex flex-col gap-4 rounded-[var(--radius-card)] p-6 ${
              site.achievements.length % 3 === 0 ? "md:col-span-2" : "md:col-span-3"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="bg-accent/10 text-accent flex size-11 items-center justify-center rounded-full">
                <ContentIcon name={a.icon} className="size-5" />
              </span>
              {a.prize ? (
                <span className="font-display text-signal text-xl font-semibold">{a.prize}</span>
              ) : null}
            </div>
            <div>
              <p className="font-semibold">{a.short}</p>
              <Expandable label="Details" className="mt-1">
                <p className="text-muted text-sm">{a.detail}</p>
              </Expandable>
            </div>
          </Reveal>
        ))}

        <Reveal className="glass flex items-center gap-4 rounded-[var(--radius-card)] p-6 md:col-span-6">
          <span className="bg-accent-2/10 text-accent-2 flex size-11 shrink-0 items-center justify-center rounded-full">
            <GraduationCap className="size-5" />
          </span>
          <div className="flex flex-1 flex-wrap items-baseline justify-between gap-2">
            <p>
              <span className="font-semibold">B.Tech, Information Technology</span>
              <span className="text-muted"> · {site.education.institution}</span>
            </p>
            <p className="text-muted font-mono text-xs">
              {site.education.period} · {site.education.grade}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
