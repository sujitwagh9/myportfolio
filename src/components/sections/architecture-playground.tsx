"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { architecture } from "@content/architecture";
import { TechIcon, TechRow } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

/**
 * The platform as a left-to-right pipeline with a security band underneath.
 * Each stage is a tab; arrow keys move between stages.
 */
export function ArchitecturePlayground() {
  const flow = architecture.filter((n) => n.id !== "security");
  const security = architecture.find((n) => n.id === "security");
  const [selected, setSelected] = useState(architecture[0]!.id);
  const reduce = useReducedMotion();
  const node = architecture.find((n) => n.id === selected)!;
  const ids = architecture.map((n) => n.id);

  function onKey(e: React.KeyboardEvent) {
    const i = ids.indexOf(selected);
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = ids[(i + step + ids.length) % ids.length]!;
    setSelected(next);
    document.getElementById(`arch-${next}`)?.focus();
  }

  const tab = (id: string) => ({
    id: `arch-${id}`,
    role: "tab" as const,
    "aria-selected": selected === id,
    "aria-controls": "arch-detail",
    tabIndex: selected === id ? 0 : -1,
    onClick: () => setSelected(id),
    onKeyDown: onKey,
  });

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Data platform stages" className="space-y-3">
        <div className="flex flex-col items-stretch gap-0 lg:flex-row lg:items-center">
          {flow.map((n, i) => (
            <Fragment key={n.id}>
              <button
                {...tab(n.id)}
                className={cn(
                  "relative flex flex-1 items-center gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-all duration-300 lg:flex-col lg:items-start",
                  selected === n.id
                    ? "border-accent bg-accent/10 shadow-[0_0_40px_-12px_var(--accent)]"
                    : "glass hover:border-accent-2",
                )}
              >
                <span className="bg-surface-2 flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-input)]">
                  <TechIcon name={n.tech[0]!} className="size-6" />
                </span>
                <span>
                  <span className="text-muted block font-mono text-[10px]">{n.stage}</span>
                  <span className="text-sm font-semibold">{n.title}</span>
                </span>
              </button>
              {i < flow.length - 1 ? <Connector reduce={!!reduce} /> : null}
            </Fragment>
          ))}
        </div>
        {security ? (
          <button
            {...tab(security.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-dashed p-4 text-left transition-all",
              selected === security.id
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent-2",
            )}
          >
            <ShieldCheck className="text-accent-2 size-5 shrink-0" />
            <span className="text-sm font-semibold">{security.title}</span>
            <span className="text-muted hidden font-mono text-xs sm:inline">
              · wraps every stage
            </span>
            <span className="ml-auto hidden md:block">
              <TechRow names={security.tech.slice(0, 4)} size="sm" />
            </span>
          </button>
        ) : null}
      </div>

      <div
        id="arch-detail"
        role="tabpanel"
        aria-labelledby={`arch-${node.id}`}
        className="glass rounded-[var(--radius-card)] p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start"
          >
            <div>
              <p className="text-accent font-mono text-xs">Stage {node.stage}</p>
              <h3 className="mt-1 text-2xl font-semibold">{node.title}</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-pretty">{node.does}</p>
              {node.notes ? (
                <p className="text-muted mt-2 max-w-2xl text-sm">{node.notes}</p>
              ) : null}
            </div>
            <TechRow names={node.tech} showLabels />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Animated arrow between stages: horizontal on desktop, vertical on mobile. */
function Connector({ reduce }: { reduce: boolean }) {
  return (
    <div className="flex items-center justify-center lg:w-8" aria-hidden>
      <svg className="h-4 w-8 rotate-90 lg:rotate-0" viewBox="0 0 32 16" preserveAspectRatio="none">
        <line
          x1="0"
          y1="8"
          x2="26"
          y2="8"
          stroke="var(--accent-2)"
          strokeWidth="2"
          className={reduce ? undefined : "flow-edge"}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M24 3 L31 8 L24 13"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
