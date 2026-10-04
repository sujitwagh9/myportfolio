"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillGroups, skills, type SkillGroupId } from "@content/skills";
import { TechIcon } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

const LEVEL = ["", "Familiar", "Proficient", "Daily driver"];

/**
 * Logo tiles grouped by area. Pick a group to focus it; hover or focus a tool to light
 * up the tools it is used with. Depth is shown as three dots, not a progress bar.
 */
export function SkillMap() {
  const [group, setGroup] = useState<SkillGroupId | "all">("all");
  const [active, setActive] = useState<string | null>(null);

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const s = skills.find((x) => x.name === active);
    const set = new Set(s?.related ?? []);
    for (const x of skills) if (x.related?.includes(active)) set.add(x.name);
    return set;
  }, [active]);

  const groups = group === "all" ? skillGroups : skillGroups.filter((g) => g.id === group);

  return (
    <div className="space-y-8">
      <div role="toolbar" aria-label="Filter skills by area" className="flex flex-wrap gap-2">
        {[{ id: "all" as const, label: "All" }, ...skillGroups].map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            aria-pressed={group === g.id}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              group === g.id
                ? "border-accent bg-accent text-accent-fg"
                : "border-border text-muted hover:text-fg",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {groups.map((g) => (
          <motion.section key={g.id} layout aria-labelledby={`sg-${g.id}`}>
            <h3
              id={`sg-${g.id}`}
              className="text-muted mb-3 font-mono text-xs tracking-wide uppercase"
            >
              {g.label}
            </h3>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {skills
                .filter((s) => s.group === g.id)
                .map((s) => {
                  const isActive = active === s.name;
                  const isRelated = related.has(s.name);
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(s.name)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(s.name)}
                        onBlur={() => setActive(null)}
                        className={cn(
                          "glass flex w-full items-center gap-3 rounded-[var(--radius-input)] p-3 text-left transition-all duration-200",
                          isActive && "border-accent shadow-[0_0_24px_-8px_var(--accent)]",
                          isRelated && "border-accent-2",
                          active && !isActive && !isRelated && "opacity-40",
                        )}
                      >
                        <TechIcon name={s.name} className="size-6" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{s.name}</span>
                          <span className="mt-1 flex gap-1" aria-hidden>
                            {[1, 2, 3].map((d) => (
                              <span
                                key={d}
                                className={cn(
                                  "size-1.5 rounded-full",
                                  d <= s.level ? "bg-accent" : "bg-border",
                                )}
                              />
                            ))}
                          </span>
                          <span className="sr-only">
                            {LEVEL[s.level]}
                            {s.related?.length ? `, used with ${s.related.join(", ")}` : ""}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </motion.section>
        ))}
      </div>

      <p className="text-muted flex flex-wrap items-center gap-4 font-mono text-xs" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="bg-accent size-1.5 rounded-full" />
          <span className="bg-accent size-1.5 rounded-full" />
          <span className="bg-accent size-1.5 rounded-full" /> daily driver
        </span>
        <span className="flex items-center gap-1.5">
          <span className="border-accent-2 size-3 rounded border" /> used together
        </span>
      </p>
    </div>
  );
}
