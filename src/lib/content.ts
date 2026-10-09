import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

const projectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  /** One short line for cards; the summary is shown on the project page. */
  tagline: z.string().optional(),
  metric: z.string().optional(),
  metricLabel: z.string().optional(),
  icon: z.string().optional(),
  /** "work" case studies are linked from Experience; only "personal" ones appear under Projects. */
  kind: z.enum(["personal", "work"]).default("personal"),
  /** Hidden projects are left out of the site, sitemap and AI until ready. */
  hidden: z.boolean().default(false),
  date: z.string(),
  order: z.number().default(99),
  featured: z.boolean().default(false),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  github: z.string().optional(),
  /** Live URL. Projects with a demo get a "Live" badge and a Visit button. */
  demo: z.string().optional(),
  /** Screenshots under /public: a full-page desktop capture and a phone capture. */
  images: z.object({ desktop: z.string().optional(), mobile: z.string().optional() }).optional(),
  /** A few short feature chips for the showcase card. */
  features: z.array(z.string()).default([]),
  problem: z.string().optional(),
  outcome: z.string().optional(),
});

const postSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type ProjectMeta = z.infer<typeof projectSchema> & { slug: string };
export type Project = ProjectMeta & { body: string };
export type PostMeta = z.infer<typeof postSchema> & { slug: string; readingTime: string };
export type Post = PostMeta & { body: string };

function readMdxDir(dir: string) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx$/, ""), data, body: content };
    });
}

export function getProjects(): Project[] {
  return readMdxDir("projects")
    .map(({ slug, data, body }) => {
      const parsed = projectSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/projects/${slug}.mdx: ${parsed.error.message}`,
        );
      }
      return { ...parsed.data, slug, body };
    })
    .filter((p) => !p.hidden)
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getPosts(): Post[] {
  return readMdxDir("blog")
    .map(({ slug, data, body }) => {
      const parsed = postSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in content/blog/${slug}.mdx: ${parsed.error.message}`);
      }
      return { ...parsed.data, slug, body, readingTime: readingTime(body).text };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
