import { GraduationCap } from "lucide-react";
import { site } from "@content/site";
import { Reveal } from "@/components/motion/reveal";
import { ContentIcon } from "@/components/ui/icon";
import { TechIcon } from "@/components/ui/tech-icon";
import { Section, SectionHeading } from "./section-heading";

export function About() {
  return (
    <Section id="about">
      <SectionHeading index="01" eyebrow="About" title="Hi, I'm Sujit." />
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <Reveal className="space-y-8">
          <p className="text-2xl leading-snug text-pretty md:text-3xl">{site.about.intro}</p>

          <ul className="space-y-3">
            {site.achievements.map((a) => (
              <li key={a.title} className="flex items-center gap-3 text-sm">
                <ContentIcon name={a.icon} className="text-accent size-4 shrink-0" />
                <span className="flex-1">{a.short}</span>
                {a.prize ? <span className="text-muted font-mono text-xs">{a.prize}</span> : null}
              </li>
            ))}
            <li className="flex items-center gap-3 text-sm">
              <GraduationCap className="text-accent-2 size-4 shrink-0" aria-hidden />
              <span className="flex-1">B.Tech IT · {site.education.institution}</span>
              <span className="text-muted font-mono text-xs">{site.education.grade}</span>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="text-muted mb-4 font-mono text-xs tracking-wide uppercase">Toolkit</h3>
          <ul className="grid grid-cols-4 gap-3">
            {site.toolkit.map((t) => (
              <li
                key={t}
                title={t}
                className="glass group flex aspect-square flex-col items-center justify-center gap-2 rounded-[var(--radius-input)] p-2"
              >
                <TechIcon name={t} className="size-7 transition-transform group-hover:scale-110" />
                <span className="text-muted line-clamp-1 text-center text-[10px]">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
