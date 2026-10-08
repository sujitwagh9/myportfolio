"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Card that tilts toward the pointer in 3D and carries a light that follows it,
 * lighting up the border and surface. Flat on touch and with reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. 0 keeps the light but no tilt (good for big cards). */
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 45%)`;
  const border = useMotionTemplate`radial-gradient(260px circle at ${mx}% ${my}%, var(--accent), transparent 60%)`;

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (!reduce && max) {
      ry.set((px - 0.5) * 2 * max);
      rx.set(-(py - 0.5) * 2 * max);
    }
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("group/tilt relative h-full", className)}
    >
      {children}
      {glare ? (
        <>
          {/* Surface light */}
          <motion.span
            aria-hidden
            style={{ background: light }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          />
          {/* Border light: a masked ring that only shows near the pointer */}
          <motion.span
            aria-hidden
            style={{ background: border }}
            className="spotlight-ring pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          />
        </>
      ) : null}
    </motion.div>
  );
}
