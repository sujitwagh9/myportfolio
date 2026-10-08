import { experience } from "@content/experience";
import { getProjects } from "@/lib/content";
import { ExperienceTimeline, type RoleView } from "./experience-timeline";
import { Section, SectionHeading } from "./section-heading";

export function Experience() {
  const bySlug = new Map(getProjects().map((p) => [p.slug, p]));
  const roles: RoleView[] = experience.map((job) => ({
    ...job,
    work: (job.caseStudies ?? []).flatMap((slug) => {
      const p = bySlug.get(slug);
      return p
        ? [
            {
              slug,
              title: p.title.replace(/:.*$/, ""),
              icon: p.icon,
              metric: p.metric,
              metricLabel: p.metricLabel,
            },
          ]
        : [];
    }),
  }));

  // Group consecutive roles at the same company so a promotion reads as one story.
  const companies: { company: string; location: string; roles: RoleView[] }[] = [];
  for (const r of roles) {
    const last = companies.at(-1);
    if (last && last.company === r.company) last.roles.push(r);
    else companies.push({ company: r.company, location: r.location, roles: [r] });
  }

  return (
    <Section id="experience" watermark="Experience">
      <SectionHeading index="02" eyebrow="Experience" title="Where I work." />
      <div className="space-y-6">
        {companies.map((c) => (
          <ExperienceTimeline key={c.company} {...c} />
        ))}
      </div>
    </Section>
  );
}
