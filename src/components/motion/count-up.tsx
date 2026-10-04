"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up to a number when scrolled into view. Values that aren't a plain number
 * (e.g. "1.4 TB → 18 GB") render as-is. The final value is in the server HTML.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(\+?)$/);
  const target = match ? Number(match[1]) : null;
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || target === null || reduce) return;
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className={className}>
      {target !== null && n !== null ? `${n}${match?.[2] ?? ""}` : value}
    </span>
  );
}
