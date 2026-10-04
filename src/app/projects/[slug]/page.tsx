import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Mdx } from "@/components/mdx";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { GithubIcon } from "@/components/ui/brand-icons";
import { getProject, getProjects } from "@/lib/content";
import { formatDate, isPlaceholder } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-[1200px] px-5 pt-32 pb-24">
      <Link
        href="/#projects"
        className="text-muted hover:text-fg inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <p className="text-accent font-mono text-xs tracking-[0.18em] uppercase">
            Case study · {formatDate(project.date)}
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-balance md:text-6xl">{project.title}</h1>
          <p className="text-muted mt-5 max-w-2xl text-xl text-pretty">
            {project.tagline ?? project.summary}
          </p>
        </div>
        <div className="from-accent/25 via-accent/5 glass relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br to-transparent p-6">
          <ContentIcon
            name={project.icon}
            className="text-fg/10 absolute -top-4 -right-4 size-32"
          />
          {project.metric ? (
            <>
              <p
                className={`font-display relative leading-none font-semibold ${project.metric.length > 6 ? "text-4xl" : "text-5xl"}`}
              >
                {project.metric}
              </p>
              <p className="text-muted relative mt-2 font-mono text-xs tracking-wide uppercase">
                {project.metricLabel}
              </p>
            </>
          ) : (
            <ContentIcon name={project.icon} className="text-accent relative size-10" />
          )}
        </div>
      </header>

      {/* At a glance: enough for a skim. The full write-up follows. */}
      <section aria-label="At a glance" className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Glance label="Problem" text={project.problem} />
        <ArrowRight className="text-accent-2 hidden size-6 self-center md:block" aria-hidden />
        <Glance label="Outcome" text={project.outcome} accent />
      </section>

      <div className="glass mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] p-5">
        {project.role ? (
          <p className={`text-sm ${isPlaceholder(project.role) ? "text-muted italic" : ""}`}>
            <span className="text-muted font-mono text-xs uppercase">Role · </span>
            {project.role}
          </p>
        ) : null}
        <TechRow names={project.stack} max={12} showLabels />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_16rem]">
        <div>
          <h2 className="text-muted mb-6 font-mono text-xs tracking-[0.18em] uppercase">
            The full story
          </h2>
          <Mdx source={project.body} />
        </div>
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          {project.github && !isPlaceholder(project.github) ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass hover:border-accent flex items-center gap-2 rounded-[var(--radius-card)] p-5 text-sm"
            >
              <GithubIcon className="size-4" /> Source code
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="glass hover:border-accent flex items-center gap-2 rounded-[var(--radius-card)] p-5 text-sm"
            >
              <ExternalLink className="size-4" /> Live demo
            </a>
          ) : null}
          <Link
            href="/#contact"
            className="bg-accent text-accent-fg flex items-center justify-center gap-2 rounded-full p-4 text-sm font-medium"
          >
            Talk to me about this
          </Link>
        </aside>
      </div>
    </article>
  );
}

function Glance({ label, text, accent }: { label: string; text?: string; accent?: boolean }) {
  if (!text) return <div />;
  return (
    <div className={`glass rounded-[var(--radius-card)] p-6 ${accent ? "border-signal/40" : ""}`}>
      <p
        className={`font-mono text-xs tracking-wide uppercase ${accent ? "text-signal" : "text-muted"}`}
      >
        {label}
      </p>
      <p className={`mt-2 leading-relaxed ${isPlaceholder(text) ? "text-muted italic" : ""}`}>
        {text}
      </p>
    </div>
  );
}
