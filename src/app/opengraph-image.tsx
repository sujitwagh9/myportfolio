import { site } from "@content/site";
import { ogSize, renderOg } from "@/lib/og/render";

export const alt = `${site.name}, ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: site.role, title: site.name, subtitle: site.positioning });
}
