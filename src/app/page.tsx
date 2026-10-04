import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JobFitAnalyzer } from "@/components/ai/job-fit-analyzer";
import { About } from "@/components/sections/about";
import { ArchitecturePlayground } from "@/components/sections/architecture-playground";
import { BlogList } from "@/components/sections/blog-list";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { ProjectGrid } from "@/components/sections/projects";
import { Section, SectionHeading } from "@/components/sections/section-heading";
import { SkillMap } from "@/components/sections/skill-map";
import { getPosts, getProjects } from "@/lib/content";

export default function HomePage() {
  const projects = getProjects().map(
    ({ slug, title, summary, tagline, metric, metricLabel, icon, stack, featured, date }) => ({
      slug,
      title,
      summary,
      tagline,
      metric,
      metricLabel,
      icon,
      stack,
      featured,
      date,
    }),
  );
  const posts = getPosts().map(({ slug, title, summary, date, tags, draft, readingTime }) => ({
    slug,
    title,
    summary,
    date,
    tags,
    draft,
    readingTime,
  }));

  return (
    <>
      <Hero />
      <About />
      <Experience />

      <Section id="projects">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Things I've built."
          intro="Open any card for the full case study."
        />
        <ProjectGrid projects={projects} />
      </Section>

      <Section id="skills">
        <SectionHeading
          index="04"
          eyebrow="Skills"
          title="The toolkit."
          intro="Hover a tool to see what I use it with."
        />
        <SkillMap />
      </Section>

      <Section id="architecture">
        <SectionHeading
          index="05"
          eyebrow="Architecture"
          title="Inside the Data Platform I built."
          intro="Click any stage to see what it does."
        />
        <ArchitecturePlayground />
      </Section>

      <Section id="job-fit">
        <SectionHeading
          index="06"
          eyebrow="For recruiters"
          title="Does Sujit fit your role?"
          intro="Paste a job description and get an honest match score in seconds."
        />
        <JobFitAnalyzer />
      </Section>

      <Section id="blog">
        <SectionHeading index="07" eyebrow="Notes" title="Writing." />
        <BlogList posts={posts} />
        <Link
          href="/blog"
          className="text-accent mt-6 inline-flex items-center gap-2 text-sm hover:underline"
        >
          All notes <ArrowRight className="size-4" />
        </Link>
      </Section>

      <Contact />
    </>
  );
}
