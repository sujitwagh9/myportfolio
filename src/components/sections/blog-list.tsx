import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function BlogList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-border border-border divide-y border-y">
      {posts.map((p, i) => (
        <li key={p.slug}>
          <Reveal delay={i * 0.05}>
            <Link
              href={`/blog/${p.slug}`}
              className="group grid gap-2 py-6 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-8"
            >
              <span className="text-muted font-mono text-xs">{formatDate(p.date)}</span>
              <span>
                <span className="group-hover:text-accent text-xl font-semibold transition-colors">
                  {p.title}
                </span>
                <span className="text-muted mt-1 block text-sm">{p.summary}</span>
              </span>
              <span className="text-muted font-mono text-xs">{p.readingTime}</span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
