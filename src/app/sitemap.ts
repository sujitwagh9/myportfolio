import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/blog"), changeFrequency: "monthly", priority: 0.6 },
    ...getProjects().map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: new Date(p.date),
      priority: 0.8,
    })),
    ...getPosts().map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
  ];
}
