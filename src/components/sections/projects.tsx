"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectSearch } from "@/components/ai/project-search";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  tagline?: string;
  metric?: string;
  metricLabel?: string;
  icon?: string;
  stack: string[];
  featured: boolean;
  date: string;
};

/** Cover tints cycle through the palette so neighbouring cards look different. */
const TINTS = [
  "from-accent/25 via-accent/5",
  "from-accent-2/25 via-accent-2/5",
  "from-signal/20 via-signal/5",
];

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  const [order, setOrder] = useState<string[] | null>(null);
  const onResults = useCallback((hrefs: string[] | null) => setOrder(hrefs), []);

  const visible = useMemo(() => {
    if (!order) return projects;
    const rank = new Map(order.map((h, i) => [h, i]));
    return projects
      .filter((p) => rank.has(`/projects/${p.slug}`))
      .sort((a, b) => rank.get(`/projects/${a.slug}`)! - rank.get(`/projects/${b.slug}`)!);
  }, [order, projects]);

  return (
    <div className="space-y-8">
      <ProjectSearch onResults={onResults} />
      {visible.length === 0 ? (
        <p className="text-muted">No projects match that search.</p>
      ) : (
        <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <AnimatePresence initial={false}>
            {visible.map((p, i) => {
              const large = !order && p.featured && i < 2;
              return (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={cn(large ? "lg:col-span-3" : "lg:col-span-2")}
                >
                  <ProjectCard project={p} large={large} tint={TINTS[i % TINTS.length]!} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  large,
  tint,
}: {
  project: ProjectCardData;
  large: boolean;
  tint: string;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="glass group hover:border-accent flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] transition-[border-color,transform] duration-300 hover:-translate-y-1"
    >
      {/* Visual cover: the headline number does the talking. */}
      <div
        className={cn(
          "relative flex flex-col justify-end overflow-hidden bg-gradient-to-br to-transparent p-6",
          tint,
          large ? "min-h-52" : "min-h-40",
        )}
      >
        <ContentIcon
          name={project.icon}
          className="text-fg/10 absolute -top-4 -right-4 size-36 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
        />
        {project.metric ? (
          <>
            <p
              className={cn(
                "font-display relative leading-none font-semibold",
                project.metric.length > 6
                  ? large
                    ? "text-4xl md:text-5xl"
                    : "text-3xl"
                  : large
                    ? "text-5xl md:text-6xl"
                    : "text-4xl",
              )}
            >
              {project.metric}
            </p>
            <p className="text-muted relative mt-2 font-mono text-[11px] tracking-wide uppercase">
              {project.metricLabel}
            </p>
          </>
        ) : (
          <ContentIcon name={project.icon} className="text-accent relative size-10" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6 pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn("font-semibold text-balance", large ? "text-2xl" : "text-lg")}>
            {project.title}
          </h3>
          <ArrowUpRight className="text-muted group-hover:text-accent size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="text-muted flex-1 text-sm">{project.tagline ?? project.summary}</p>
        <TechRow names={project.stack} max={large ? 7 : 5} size="sm" />
      </div>
    </Link>
  );
}
