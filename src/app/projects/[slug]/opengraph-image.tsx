import { getProject, getProjects } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og/render";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project case study";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  return renderOg({
    eyebrow: "Case study",
    title: p?.title ?? "Project",
    subtitle: p?.stack.join(" · "),
  });
}
