import type { Metadata } from "next";
import { BlogList } from "@/components/sections/blog-list";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Notes on data platforms, pipelines and AI agents.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
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
    <div className="mx-auto max-w-[1200px] px-5 pt-32 pb-24">
      <p className="text-accent font-mono text-xs tracking-[0.18em] uppercase">Notes</p>
      <h1 className="mt-3 mb-12 text-5xl font-semibold md:text-6xl">Writing.</h1>
      <BlogList posts={posts} />
    </div>
  );
}
