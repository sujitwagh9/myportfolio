"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts a leading number up when scrolled into view ("5", "1.4 TB → 18 GB" stays as text). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const m = value.match(/^(\d+)(\+?)$/);
  const target = m ? Number(m[1]) : null;
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || target === null || reduce) return;
    const start = performance.now();
    let f = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className={className}>
      {target !== null && n !== null ? `${n}${m?.[2] ?? ""}` : value}
    </span>
  );
}
