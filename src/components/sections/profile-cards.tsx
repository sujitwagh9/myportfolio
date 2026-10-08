"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookMarked, Star, Users } from "lucide-react";
import { siCodechef, siGeeksforgeeks, siGithub, siLeetcode, type SimpleIcon } from "simple-icons";
import { TiltCard } from "@/components/interactive/tilt-card";
import { CountUp } from "@/components/motion/count-up";
import type { GithubStats, LeetcodeStats } from "@/lib/profiles";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 120, damping: 16 } as const;

const LANG: Record<string, string> = {
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#663399",
  "C++": "#00599C",
};

function Brand({
  icon,
  className,
  color,
}: {
  icon: SimpleIcon;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-6", className)}
      fill={color ?? `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  );
}

/** Cards fly in with a 3D flip, one after another. */
function Enter({
  i,
  className,
  children,
}: {
  i: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1000 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: 18, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING, delay: i * 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function ProfileCards({
  github,
  githubUser,
  leetcode,
  leetcodeUser,
  gfg,
  codechef,
}: {
  github: GithubStats;
  githubUser: string;
  leetcode: LeetcodeStats;
  leetcodeUser: string;
  gfg: { username: string; badge: string };
  codechef: { username: string; badge: string };
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[auto_auto] md:gap-4">
      {/* GitHub */}
      <Enter i={0} className="col-span-2 min-w-0 md:row-span-2">
        <TiltCard max={4} className="glass rounded-[var(--radius-card)] p-4 sm:p-6">
          <div className="flex items-center gap-4">
            {github ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={github.avatar}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="ring-accent/40 size-12 shrink-0 rounded-full ring-2 sm:size-14"
              />
            ) : (
              <span className="bg-surface-2 flex size-14 items-center justify-center rounded-full">
                <Brand icon={siGithub} color="currentColor" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-semibold">
                <Brand icon={siGithub} color="currentColor" className="size-4" /> GitHub
              </p>
              <p className="text-muted font-mono text-xs">@{githubUser}</p>
            </div>
            <a
              href={`https://github.com/${githubUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:border-accent hover:text-accent inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              Visit <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          {github ? (
            <>
              <dl className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: BookMarked, label: "Repos", value: github.repos },
                  { icon: Star, label: "Stars", value: github.stars },
                  { icon: Users, label: "Followers", value: github.followers },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-surface-2 flex min-w-0 flex-col-reverse rounded-[var(--radius-input)] p-2.5 sm:p-3"
                  >
                    <dt className="text-muted flex items-center gap-1 font-mono text-[10px] uppercase">
                      <s.icon className="size-3" /> {s.label}
                    </dt>
                    <dd className="font-display text-xl font-semibold sm:text-2xl">
                      <CountUp value={String(s.value)} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-muted mt-6 mb-2 font-mono text-[10px] tracking-wide uppercase">
                Top repositories
              </p>
              <ul className="space-y-2">
                {github.top.map((r, i) => (
                  <motion.li
                    key={r.url}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING, delay: 0.3 + i * 0.08 }}
                  >
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border hover:border-accent group block rounded-[var(--radius-input)] border p-3 transition-colors"
                    >
                      <span className="flex min-w-0 items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-medium capitalize">
                          {r.name}
                        </span>
                        <span className="text-muted flex shrink-0 items-center gap-3 font-mono text-[11px]">
                          {r.language ? (
                            <span className="hidden items-center gap-1 sm:flex">
                              <span
                                className="size-2 rounded-full"
                                style={{ background: LANG[r.language] ?? "var(--accent-2)" }}
                              />
                              {r.language}
                            </span>
                          ) : null}
                          <span className="flex items-center gap-0.5">
                            <Star className="size-3" /> {r.stars}
                          </span>
                        </span>
                      </span>
                      <span className="text-muted mt-1 line-clamp-1 block text-xs">
                        {r.description}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-muted mt-6 text-sm">
              Repositories, stars and more on my GitHub profile.
            </p>
          )}
        </TiltCard>
      </Enter>

      {/* LeetCode */}
      <Enter i={1} className="col-span-2 min-w-0">
        <TiltCard max={5} className="glass rounded-[var(--radius-card)] p-4 sm:p-6">
          <a
            href={`https://leetcode.com/u/${leetcodeUser}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 rounded-[inherit]"
            aria-label={`LeetCode profile @${leetcodeUser}`}
          />
          <div className="flex items-center gap-2">
            <Brand icon={siLeetcode} />
            <p className="flex-1 font-semibold">LeetCode</p>
            <ArrowUpRight className="text-muted size-4" />
          </div>
          <div className="mt-4 flex items-center gap-4 sm:gap-6">
            <SolvedRing stats={leetcode} />
            <div className="min-w-0 flex-1 space-y-3">
              {leetcode.rating ? (
                <div>
                  <p
                    className="font-display text-2xl font-semibold sm:text-3xl"
                    style={{ color: "#FFA116" }}
                  >
                    <CountUp value={String(leetcode.rating)} />
                  </p>
                  <p className="text-muted font-mono text-[10px] uppercase">
                    Contest rating
                    {leetcode.topPercent ? ` · top ${leetcode.topPercent.toFixed(1)}%` : ""}
                  </p>
                </div>
              ) : null}
              {leetcode.live ? (
                <div className="space-y-1.5">
                  {(
                    [
                      ["Easy", leetcode.easy, leetcode.totals.easy, "#00B8A3"],
                      ["Medium", leetcode.medium, leetcode.totals.medium, "#FFC01E"],
                      ["Hard", leetcode.hard, leetcode.totals.hard, "#FF375F"],
                    ] as const
                  ).map(([label, n, total, color], i) => (
                    <div key={label}>
                      <div className="text-muted flex justify-between font-mono text-[10px]">
                        <span>{label}</span>
                        <span>{n}</span>
                      </div>
                      <div className="bg-surface-2 mt-0.5 h-1.5 overflow-hidden rounded-full">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${total ? Math.max(2, (n / total) * 100) : 0}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.1,
                            delay: 0.3 + i * 0.12,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </TiltCard>
      </Enter>

      {/* GfG + CodeChef */}
      {[
        {
          icon: siGeeksforgeeks,
          name: "GeeksforGeeks",
          ...gfg,
          href: `https://www.geeksforgeeks.org/user/${gfg.username}/`,
        },
        {
          icon: siCodechef,
          name: "CodeChef",
          ...codechef,
          href: `https://www.codechef.com/users/${codechef.username}`,
        },
      ].map((p, i) => (
        <Enter key={p.name} i={i + 2} className="min-w-0">
          <TiltCard max={10} className="rounded-[var(--radius-card)]">
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[var(--radius-card)] p-4 sm:gap-6 sm:p-6"
            >
              <span
                aria-hidden
                className="absolute -top-10 -right-10 size-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                style={{ background: `#${p.icon.hex === "5B4638" ? "B07A4F" : p.icon.hex}` }}
              />
              <div className="flex items-center justify-between">
                <Brand
                  icon={p.icon}
                  className="size-8"
                  color={p.icon.hex === "5B4638" ? "currentColor" : undefined}
                />
                <ArrowUpRight className="text-muted group-hover:text-accent size-4 transition-colors" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold sm:text-3xl">{p.badge}</p>
                <p className="text-muted mt-1 text-sm">{p.name}</p>
                <p className="text-muted truncate font-mono text-[10px]">@{p.username}</p>
              </div>
            </a>
          </TiltCard>
        </Enter>
      ))}
    </div>
  );
}

/** Three-segment ring (easy / medium / hard) that draws itself, total solved in the middle. */
function SolvedRing({ stats }: { stats: LeetcodeStats }) {
  const reduce = useReducedMotion();
  const r = 46;
  const c = 2 * Math.PI * r;
  const parts = stats.live
    ? [
        { n: stats.easy, color: "#00B8A3" },
        { n: stats.medium, color: "#FFC01E" },
        { n: stats.hard, color: "#FF375F" },
      ]
    : [{ n: 1, color: "#FFA116" }];
  const sum = parts.reduce((a, p) => a + p.n, 0) || 1;
  const gap = stats.live ? 4 : 0;
  let offset = 0;
  return (
    <div className="relative size-24 shrink-0 sm:size-32">
      <svg viewBox="0 0 110 110" className="size-full -rotate-90" aria-hidden>
        <circle cx="55" cy="55" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        {parts.map((p, i) => {
          const len = Math.max(0, (p.n / sum) * c - gap);
          const el = (
            <motion.circle
              key={i}
              cx="55"
              cy="55"
              r={r}
              fill="none"
              stroke={p.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: reduce ? `${len} ${c}` : `0 ${c}` }}
              whileInView={{ strokeDasharray: `${len} ${c}` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          );
          offset += (p.n / sum) * c;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-semibold sm:text-3xl">
          <CountUp value={String(stats.solved)} />
        </span>
        <span className="text-muted font-mono text-[10px] uppercase">solved</span>
      </div>
    </div>
  );
}
