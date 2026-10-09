import Link from "next/link";
import { ArrowRight, ArrowUpRight, MousePointer2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/brand-icons";
import { DeviceMockup } from "@/components/ui/device-mockup";
import { TechRow } from "@/components/ui/tech-icon";
import type { Project } from "@/lib/content";
import { isPlaceholder } from "@/lib/utils";

/** Full-width card for a deployed project: device mockup on one side, details and links on the other. */
export function LiveShowcase({ project: p }: { project: Project }) {
  const host = p.demo ? new URL(p.demo).host : "";
  return (
    <Reveal from="up">
      <article className="glass group grid items-center gap-8 overflow-hidden rounded-[var(--radius-card)] p-5 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
        <a
          href={p.demo}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Open"
          aria-label={`Open ${p.title} live site`}
          className="relative block"
        >
          <DeviceMockup
            desktop={p.images?.desktop}
            mobile={p.images?.mobile}
            url={p.demo}
            title={p.title}
          />
          <span className="bg-fg text-bg absolute top-12 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] opacity-90 transition-opacity group-hover:opacity-0 [@media(hover:none)]:hidden">
            <MousePointer2 className="size-3" /> hover to scroll
          </span>
        </a>

        <div>
          <p className="text-signal flex items-center gap-2 font-mono text-xs">
            <span className="relative flex size-2">
              <span className="bg-signal absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-signal relative inline-flex size-2 rounded-full" />
            </span>
            Live · {host}
          </p>
          <h3 className="mt-3 text-3xl font-semibold">{p.title}</h3>
          <p className="text-muted mt-2 text-pretty">{p.tagline ?? p.summary}</p>

          {p.features.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.features.map((f) => (
                <li key={f} className="border-border rounded-full border px-3 py-1 text-xs">
                  {f}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5">
            <TechRow names={p.stack} max={8} size="sm" />
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {p.demo ? (
              <Button asChild>
                <a href={p.demo} target="_blank" rel="noopener noreferrer">
                  Visit live site <ArrowUpRight />
                </a>
              </Button>
            ) : null}
            {p.github && !isPlaceholder(p.github) ? (
              <Button variant="outline" asChild>
                <a href={p.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="size-4" /> Code
                </a>
              </Button>
            ) : null}
            <Button variant="ghost" asChild>
              <Link href={`/projects/${p.slug}`}>
                Case study <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
