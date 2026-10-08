import { GraduationCap } from "lucide-react";
import { site } from "@content/site";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { DraggableTile } from "@/components/interactive/draggable-tile";
import { ContentIcon } from "@/components/ui/icon";
import { TechIcon } from "@/components/ui/tech-icon";
import { Section, SectionHeading } from "./section-heading";

export function About() {
  return (
    <Section id="about" watermark="About">
      <SectionHeading index="01" eyebrow="About" title="A bit about me." />
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div className="space-y-6">
          <Reveal from="left">
            <p className="text-xl leading-snug text-pretty md:text-2xl">{site.about.intro}</p>
          </Reveal>

          <Stagger className="divide-border divide-y">
            {site.achievements.map((a) => (
              <StaggerItem key={a.title} className="flex items-center gap-3 py-3 text-sm">
                <ContentIcon name={a.icon} className="text-accent size-4 shrink-0" />
                <span className="flex-1">{a.short}</span>
                {a.prize ? (
                  <span className="text-muted text-right font-mono text-xs">{a.prize}</span>
                ) : null}
              </StaggerItem>
            ))}
            <StaggerItem className="flex items-center gap-3 py-3 text-sm">
              <GraduationCap className="text-accent-2 size-4 shrink-0" aria-hidden />
              <span className="flex-1">B.Tech IT · {site.education.institution}</span>
              <span className="text-muted font-mono text-xs">{site.education.grade}</span>
            </StaggerItem>
          </Stagger>
        </div>

        <div>
          <h3 className="text-muted mb-4 font-mono text-xs tracking-wide uppercase">
            Toolkit <span className="normal-case opacity-70">· go on, throw one</span>
          </h3>
          <Stagger className="grid grid-cols-4 gap-3">
            {site.toolkit.map((t, i) => (
              <StaggerItem key={t} variant="pop" i={i}>
                <DraggableTile
                  title={t}
                  className="glass hover:border-accent flex aspect-square cursor-grab flex-col items-center justify-center gap-2 rounded-[var(--radius-input)] p-2 transition-colors select-none"
                >
                  <TechIcon name={t} className="pointer-events-none size-7" />
                  <span className="text-muted pointer-events-none line-clamp-1 text-center text-[10px]">
                    {t}
                  </span>
                </DraggableTile>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
