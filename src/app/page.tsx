import { About } from "@/components/sections/about";
import { AISection } from "@/components/sections/ai-section";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Profiles } from "@/components/sections/profiles";
import { ProjectsExplorer } from "@/components/sections/projects";
import { Section, SectionHeading } from "@/components/sections/section-heading";
import { getProjects } from "@/lib/content";

/** Re-render at most every 6 hours so live GitHub / LeetCode stats stay fresh. */
export const revalidate = 21600;

export default function HomePage() {
  const personal = getProjects().filter((p) => p.kind === "personal");
  // Projects you can see working (live site or recorded demo) get the big showcase.
  const showcased = personal.filter((p) => (p.demo && p.images?.desktop) || p.walkthrough.length);
  const others = personal.filter((p) => !showcased.includes(p));

  return (
    <>
      <Hero />
      <About />
      <Profiles />

      {personal.length ? (
        <Section id="projects" watermark="Projects">
          <SectionHeading index="03" eyebrow="Projects" title="Things I've built." />
          <ProjectsExplorer
            showcased={showcased.map((p) => ({ ...p, body: "" }))}
            repos={others.map((p) => ({ ...p, body: "" }))}
          />
        </Section>
      ) : null}

      <Section id="ai" watermark="Ask AI">
        <SectionHeading index="04" eyebrow="AI" title="Ask my AI." />
        <AISection />
      </Section>

      <Experience />
      <Contact />
    </>
  );
}
