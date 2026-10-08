"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A soft glow that follows the pointer, plus a ring that grows over anything clickable
 * and shows a label from `data-cursor` (e.g. "Chat", "Drag"). Mouse only; skipped for
 * touch and reduced motion. The native cursor stays visible.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });
  const gx = useSpring(x, { stiffness: 60, damping: 20 });
  const gy = useSpring(y, { stiffness: 60, damping: 20 });
  const last = useRef<Element | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t =
        (e.target as Element | null)?.closest("[data-cursor], a, button, input, textarea, label") ??
        null;
      if (t !== last.current) {
        last.current = t;
        setHover(t ? (t.getAttribute("data-cursor") ?? "") : null);
      }
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = hover ? (hover.length ? 64 : 44) : 24;

  return (
    <>
      {/* Ambient glow that trails the pointer */}
      <motion.div
        aria-hidden
        style={{ x: gx, y: gy }}
        className="pointer-events-none fixed top-0 left-0 -z-10 -mt-[250px] -ml-[250px] size-[500px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_65%)]"
      />
      {/* Ring */}
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed top-0 left-0 z-[70]"
      >
        <motion.div
          animate={{ width: size, height: size, scale: down ? 0.8 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className={`border-accent flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border ${
            hover ? "bg-accent/15 backdrop-blur-[2px]" : ""
          }`}
        >
          {hover ? (
            <span className="text-accent font-mono text-[10px] font-semibold uppercase">
              {hover}
            </span>
          ) : null}
        </motion.div>
      </motion.div>
    </>
  );
}
