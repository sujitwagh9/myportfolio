import { About } from "@/components/sections/about";
import { AISection } from "@/components/sections/ai-section";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { ProjectGrid } from "@/components/sections/projects";
import { Section, SectionHeading } from "@/components/sections/section-heading";
import { getProjects } from "@/lib/content";

export default function HomePage() {
  const personal = getProjects().filter((p) => p.kind === "personal");

  return (
    <>
      <Hero />
      <About />
      <Experience />

      <Section id="ai">
        <SectionHeading index="03" eyebrow="AI" title="Ask my AI." />
        <AISection />
      </Section>

      {personal.length ? (
        <Section id="projects">
          <SectionHeading index="04" eyebrow="Projects" title="Side projects." />
          <ProjectGrid projects={personal} />
        </Section>
      ) : null}

      <Contact />
    </>
  );
}
