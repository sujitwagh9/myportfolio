import { getPost, getPosts } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og/render";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Note";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return renderOg({ eyebrow: "Note", title: p?.title ?? "Note", subtitle: p?.summary });
}
