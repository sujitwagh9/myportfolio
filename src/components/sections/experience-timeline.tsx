"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, MapPin, X } from "lucide-react";
import type { Experience } from "@content/experience";
import { Reveal } from "@/components/motion/reveal";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ContentIcon } from "@/components/ui/icon";
import { TechRow } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

export type RoleView = Experience & {
  work: { slug: string; title: string; icon?: string; metric?: string; metricLabel?: string }[];
};

/**
 * One compact company card: logo, location and the roles as a small timeline.
 * Each role opens a popup with a handful of highlighted bullets.
 */
export function ExperienceTimeline({
  company,
  location,
  roles,
}: {
  company: string;
  location: string;
  roles: RoleView[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const logo = roles.find((r) => r.logo)?.logo;
  const start = roles.at(-1)?.period.split("–")[0]?.trim();
  const initials = company
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const role = open === null ? null : roles[open]!;

  return (
    <>
      <Reveal from="up" className="glass mx-auto max-w-md rounded-[var(--radius-card)] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <CompanyMark logo={logo} company={company} initials={initials} />
          <div>
            <h3 className="text-lg leading-tight font-semibold">{company}</h3>
            <p className="text-muted flex items-center gap-1 text-xs">
              <MapPin className="size-3" /> {location}
            </p>
            {start ? <p className="text-muted font-mono text-[10px]">since {start}</p> : null}
          </div>
        </div>

        <ol className="relative mt-6 space-y-1.5">
          <span aria-hidden className="bg-border absolute top-4 bottom-4 left-[13px] w-px" />
          {roles.map((r, i) => (
            <li key={`${r.role}-${r.period}`}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-haspopup="dialog"
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-[var(--radius-input)] border px-3 py-3 pl-9 text-left transition-all duration-300",
                  r.current
                    ? "border-accent/50 bg-surface shadow-sm"
                    : "hover:border-border hover:bg-surface/60 border-transparent",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 left-[9px] size-[9px] -translate-y-1/2 rounded-full ring-4 ring-[var(--bg)]",
                    r.current ? "bg-signal" : "bg-muted group-hover:bg-accent",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {r.role}
                    {r.current ? (
                      <span className="text-signal ml-2 inline-flex items-center gap-1 align-middle font-mono text-[10px] font-normal">
                        <span className="bg-signal size-1.5 animate-pulse rounded-full" /> now
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted font-mono text-[11px]">{r.period}</span>
                </span>
                <ChevronRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
          ))}
        </ol>

        <p className="text-muted mt-5 font-mono text-[10px]">
          {roles.length > 1 ? `${roles.at(-1)!.role} → ${roles[0]!.role} · ` : ""}tap a role to see
          what I did
        </p>
      </Reveal>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="top-1/2 max-h-[85vh] max-w-lg -translate-y-1/2 overflow-y-auto">
          {role ? (
            <RolePopup
              role={role}
              company={company}
              logo={logo}
              initials={initials}
              onClose={() => setOpen(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function CompanyMark({
  logo,
  company,
  initials,
  size = "md",
}: {
  logo?: string;
  company: string;
  initials: string;
  size?: "md" | "sm";
}) {
  const box = size === "md" ? "size-14" : "size-11";
  return logo ? (
    <span
      className={cn(
        box,
        "flex shrink-0 items-center justify-center rounded-2xl bg-[#14285a] p-1.5 shadow-[0_10px_28px_-10px_#14285a] ring-1 ring-white/10",
      )}
    >
      <Image
        src={logo}
        alt={`${company} logo`}
        width={48}
        height={48}
        className="size-full object-contain"
      />
    </span>
  ) : (
    <span
      className={cn(
        box,
        "from-accent to-accent-2 text-accent-fg font-display flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-bold",
      )}
    >
      {initials}
    </span>
  );
}

function RolePopup({
  role,
  company,
  logo,
  initials,
  onClose,
}: {
  role: RoleView;
  company: string;
  logo?: string;
  initials: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <CompanyMark logo={logo} company={company} initials={initials} size="sm" />
        <div className="min-w-0 flex-1">
          <DialogTitle className="text-xl font-semibold sm:text-2xl">{role.role}</DialogTitle>
          <DialogDescription className="text-muted text-sm">
            {company}
            {role.team ? ` · ${role.team}` : ""}
          </DialogDescription>
          <p className="text-muted mt-0.5 font-mono text-[11px]">{role.period}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted hover:text-fg hover:bg-surface-2 -mt-1 -mr-1 rounded-full p-2 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      <ul className="mt-6 space-y-3.5">
        {role.points.map((pt, i) => (
          <motion.li
            key={pt}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.08 + i * 0.07 }}
            className="flex gap-3 leading-relaxed"
          >
            <span className="bg-accent mt-[0.6em] size-1.5 shrink-0 rounded-full" aria-hidden />
            <span className="text-pretty">
              <Highlighted text={pt} delay={0.2 + i * 0.07} />
            </span>
          </motion.li>
        ))}
      </ul>

      <div className="border-border mt-6 border-t pt-5">
        <TechRow names={role.stack} max={10} size="sm" />
      </div>

      {role.work.length ? (
        <div className="mt-5">
          <p className="text-muted mb-2 font-mono text-[10px] tracking-wide uppercase">
            Case studies
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {role.work.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/projects/${w.slug}`}
                  className="border-border hover:border-accent group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors"
                >
                  <ContentIcon name={w.icon} className="text-accent size-3" />
                  {w.title}
                  <ArrowUpRight className="text-muted group-hover:text-accent size-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Renders **key words** as a yellow highlighter mark that sweeps in. */
function Highlighted({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\*\*[^*]+\*\*$/.test(part) ? (
          <motion.mark
            key={i}
            className="rounded-[4px] bg-transparent [box-decoration-break:clone] bg-no-repeat px-1 py-px font-semibold [-webkit-box-decoration-break:clone]"
            style={{ backgroundImage: "linear-gradient(#FFD84D, #FFD84D)", color: "#17140a" }}
            initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
            animate={{ backgroundSize: "100% 100%" }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {part.slice(2, -2)}
          </motion.mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
