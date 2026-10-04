"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const DataField = dynamic(() => import("./data-field"), {
  ssr: false,
  loading: () => <StaticFlow />,
});

function canRender3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** 3D particle stream on capable devices, a static SVG everywhere else. */
export function HeroVisual() {
  const [enabled, setEnabled] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    // Defer until the browser is idle so the 3D bundle never competes with first paint.
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const run = () => setEnabled(canRender3D());
    if (w.requestIdleCallback) w.requestIdleCallback(run);
    else setTimeout(run, 300);
  }, []);
  const dark = resolvedTheme !== "light";
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]">
      {enabled ? (
        <DataField accent={dark ? "#FF7A3D" : "#C2410C"} teal={dark ? "#3DD6C4" : "#0F766E"} />
      ) : (
        <StaticFlow />
      )}
    </div>
  );
}

function StaticFlow() {
  return (
    <svg
      viewBox="0 0 1200 600"
      className="absolute top-1/2 left-1/2 h-[600px] w-[1200px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-60"
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, lane) => (
        <g key={lane}>
          {Array.from({ length: 28 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 43 + lane * 17) % 1200}
              cy={150 + lane * 60 + Math.sin(i + lane) * 8}
              r={2}
              fill={lane < 3 ? "var(--accent)" : "var(--accent-2)"}
              opacity={0.3 + ((i * 7) % 10) / 15}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
