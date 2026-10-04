import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Mdx } from "@/components/mdx";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, type: "article", publishedTime: p.date },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pt-32 pb-24">
      <Link
        href="/blog"
        className="text-muted hover:text-fg inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="size-4" /> All notes
      </Link>
      <header className="mt-8 mb-12">
        <p className="text-muted font-mono text-xs">
          {formatDate(post.date)} · {post.readingTime}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-balance md:text-5xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </header>
      <Mdx source={post.body} />
    </article>
  );
}
