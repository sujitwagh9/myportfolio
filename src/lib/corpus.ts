/**
 * Turns all portfolio content into small, labelled chunks. Used both at build time
 * (to create embeddings) and at runtime (keyword fallback, and when no index exists).
 * Must not import "server-only": the build script runs outside Next.js.
 */
import { site } from "../../content/site";
import { experience } from "../../content/experience";
import { skills, skillGroups } from "../../content/skills";
import { architecture } from "../../content/architecture";
import { getPosts, getProjects } from "./content";

export type Section =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "blog"
  | "achievements"
  | "education"
  | "architecture";

export type Chunk = {
  id: string;
  section: Section;
  title: string;
  href: string;
  /** Project or post slug, when the chunk belongs to one. */
  slug?: string;
  text: string;
};

function splitByHeading(body: string) {
  const parts = body.split(/\n(?=## )/g);
  return parts
    .map((p) => {
      const match = p.match(/^## (.+)\n/);
      return { heading: match?.[1]?.trim() ?? "Overview", text: p.replace(/^## .+\n/, "").trim() };
    })
    .filter((p) => p.text.length > 0);
}

export function buildCorpus(): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: "about",
    section: "about",
    title: "About",
    href: "/#about",
    text: [
      `${site.name} is a ${site.role} at ${site.company}, based in ${site.location}.`,
      site.positioning,
      ...site.about.story,
      site.about.intro,
      `What Sujit does: ${site.about.whatIDo.map((w) => `${w.text} (${w.tech})`).join("; ")}.`,
      `What Sujit cares about: ${site.about.values.join("; ")}.`,
      `Contact: ${site.email}. LinkedIn: ${site.socials.linkedin}.`,
    ].join("\n"),
  });

  chunks.push({
    id: "education",
    section: "education",
    title: "Education",
    href: "/#about",
    text: `${site.education.degree}, ${site.education.institution}, ${site.education.location} (${site.education.period}). ${site.education.grade}. Coursework: ${site.education.coursework.join(", ")}.`,
  });

  chunks.push({
    id: "achievements",
    section: "achievements",
    title: "Achievements",
    href: "/#about",
    text: site.achievements.map((a) => `${a.title}: ${a.detail}`).join("\n"),
  });

  for (const [i, job] of experience.entries()) {
    chunks.push({
      id: `experience-${i}`,
      section: "experience",
      title: `${job.role} at ${job.company}`,
      href: "/#experience",
      text: [
        `${job.role} at ${job.company}${job.team ? ` (${job.team})` : ""}, ${job.location}, ${job.period}${job.current ? " (current role)" : ""}.`,
        job.summary,
        ...job.bullets.map((b) => `- ${b}`),
        `Stack: ${job.stack.join(", ")}.`,
        ...(job.entities?.length
          ? [
              `Deployments across the group: ${job.entities.map((e) => e.code).join(", ")}.`,
              ...job.entities.map((e) => `${e.code} (${e.name}): ${e.bullets.join(" ")}`),
            ]
          : []),
      ].join("\n"),
    });
  }

  for (const group of skillGroups) {
    const inGroup = skills.filter((s) => s.group === group.id);
    chunks.push({
      id: `skills-${group.id}`,
      section: "skills",
      title: `Skills: ${group.label}`,
      href: "/#skills",
      text: `${group.label} (${group.blurb}): ${inGroup
        .map((s) => `${s.name} (${["", "familiar", "proficient", "daily driver"][s.level]})`)
        .join(", ")}.`,
    });
  }

  chunks.push({
    id: "architecture",
    section: "architecture",
    title: "Self-hosted data platform architecture",
    href: "/#architecture",
    text: architecture.map((n) => `${n.title}: ${n.does} Tech: ${n.tech.join(", ")}.`).join("\n"),
  });

  for (const p of getProjects()) {
    chunks.push({
      id: `project-${p.slug}`,
      section: "projects",
      title: p.title,
      href: `/projects/${p.slug}`,
      slug: p.slug,
      text: [
        `${p.title}. ${p.summary}`,
        p.role ? `Role: ${p.role}.` : "",
        `Stack: ${p.stack.join(", ")}.`,
        `Tags: ${p.tags.join(", ")}.`,
        p.problem ? `Problem: ${p.problem}` : "",
        p.outcome ? `Outcome: ${p.outcome}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    for (const [i, part] of splitByHeading(p.body).entries()) {
      chunks.push({
        id: `project-${p.slug}-${i}`,
        section: "projects",
        title: `${p.title} — ${part.heading}`,
        href: `/projects/${p.slug}`,
        slug: p.slug,
        text: part.text,
      });
    }
  }

  for (const post of getPosts()) {
    chunks.push({
      id: `blog-${post.slug}`,
      section: "blog",
      title: post.title,
      href: `/blog/${post.slug}`,
      slug: post.slug,
      text: `${post.title}. ${post.summary} Tags: ${post.tags.join(", ")}.`,
    });
    for (const [i, part] of splitByHeading(post.body).entries()) {
      chunks.push({
        id: `blog-${post.slug}-${i}`,
        section: "blog",
        title: `${post.title} — ${part.heading}`,
        href: `/blog/${post.slug}`,
        slug: post.slug,
        text: part.text,
      });
    }
  }

  return chunks;
}
