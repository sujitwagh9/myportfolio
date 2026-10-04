"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceEntity } from "@content/experience";
import { cn } from "@/lib/utils";

/**
 * Hub-and-spoke diagram: the Data Platform in the middle, one node per deployment.
 * Selecting a node (click, tap or keyboard) shows what was delivered there.
 */
export function DeploymentHub({ entities }: { entities: ExperienceEntity[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const W = 560;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2;
  const rx = 215;
  const ry = 112;
  const nodes = entities.map((e, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / entities.length;
    return { ...e, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
  const current = entities[active];

  return (
    <div className="glass rounded-[var(--radius-card)] p-4 md:p-6">
      <p className="text-muted mb-2 font-mono text-xs tracking-wide uppercase">
        Live across the group · select a deployment
      </p>
      <div className="relative mx-auto w-full max-w-[560px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
          {nodes.map((n, i) => (
            <g key={n.code}>
              <line
                x1={cx}
                y1={cy}
                x2={n.x}
                y2={n.y}
                stroke={i === active ? "var(--accent)" : "var(--accent-2)"}
                strokeOpacity={i === active ? 1 : 0.35}
                strokeWidth={2}
              />
              {!reduce ? (
                <motion.circle
                  r={3}
                  fill="var(--accent-2)"
                  initial={{ cx, cy }}
                  animate={{ cx: [cx, n.x], cy: [cy, n.y] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeInOut",
                  }}
                />
              ) : null}
            </g>
          ))}
          <circle
            cx={cx}
            cy={cy}
            r={46}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth={2}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="var(--fg)"
          >
            Data
          </text>
          <text
            x={cx}
            y={cy + 13}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="var(--fg)"
          >
            Platform
          </text>
        </svg>
        {/* Real buttons positioned over the SVG nodes, so they are keyboard accessible. */}
        {nodes.map((n, i) => (
          <button
            key={n.code}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-pressed={i === active}
            style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-xs font-semibold whitespace-nowrap transition-colors",
              i === active
                ? "border-accent bg-accent text-accent-fg"
                : "border-border bg-surface text-fg hover:border-accent",
            )}
          >
            {n.code}
          </button>
        ))}
      </div>
      {current ? (
        <div className="border-border mt-3 border-t pt-4" aria-live="polite">
          <p className="font-semibold">
            {current.code}
            <span
              className={cn(
                "text-muted ml-2 text-sm font-normal",
                current.name.includes("[PLACEHOLDER") && "italic",
              )}
            >
              {current.name}
            </span>
          </p>
          <p className="text-muted mt-1 text-sm">{current.bullets.join(" ")}</p>
        </div>
      ) : null}
    </div>
  );
}
