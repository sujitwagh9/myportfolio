"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Pointer follower that works on both themes:
 *  - a ring + dot drawn white with `mix-blend-difference`, so it inverts whatever is
 *    under it (white on dark, black on light)
 *  - a label pill ("Chat", "Drag") from `data-cursor`, in normal theme colours
 *  - a soft glow trail, dark theme only (it muddies light backgrounds)
 * Mouse only; skipped for touch and reduced motion. The native cursor stays visible.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 420, damping: 32, mass: 0.4 });
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
      setVisible(true);
      const t =
        (e.target as Element | null)?.closest("[data-cursor], a, button, input, textarea, label") ??
        null;
      if (t !== last.current) {
        last.current = t;
        setHover(t ? (t.getAttribute("data-cursor") ?? "") : null);
      }
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;
  const interactive = hover !== null;
  const ring = interactive ? 46 : 30;

  return (
    <>
      {/* Glow trail: dark theme only */}
      <motion.div
        aria-hidden
        style={{ x: gx, y: gy }}
        className="pointer-events-none fixed top-0 left-0 -z-10 -mt-[250px] -ml-[250px] hidden size-[500px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_65%)] dark:block"
      />

      {/* Ring + dot: inverting blend reads on any background */}
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry }}
        animate={{ opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[70] mix-blend-difference"
      >
        <motion.div
          animate={{ width: ring, height: ring, scale: down ? 0.75 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white ${
            interactive ? "bg-white" : ""
          }`}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x, y }}
        animate={{ opacity: visible && !interactive ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[70] -mt-[2.5px] -ml-[2.5px] size-[5px] rounded-full bg-white mix-blend-difference"
      />

      {/* Label pill, theme coloured, beside the ring */}
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed top-0 left-0 z-[71]"
      >
        <AnimatePresence>
          {hover ? (
            <motion.span
              key={hover}
              initial={{ opacity: 0, scale: 0.6, x: 18, y: 14 }}
              animate={{ opacity: 1, scale: 1, x: 30, y: 18 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="bg-fg text-bg block rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase shadow-lg"
            >
              {hover}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
