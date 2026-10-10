"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type Burst = { id: number; x: number; y: number };
type Mode = "hidden" | "idle" | "snap" | "big" | "text";

const SNAP = "a, button, [role=tab], [data-cursor]";
const MAX_SNAP_W = 480;
const MAX_SNAP_H = 140;
const SPRING = { stiffness: 420, damping: 32, mass: 0.45 };

/**
 * Pointer companion, drawn in theme colours so it reads on light and dark:
 *  - a small dot glued to the pointer
 *  - a ring that trails it, and on buttons and links wraps itself around the element
 *    (matching its shape) with a slight magnetic pull
 *  - a label pill for anything with `data-cursor` (the tiger says "Chat", the deck "Deal")
 *  - a burst of sparks on click
 * Mouse only; off for touch and reduced motion. The native cursor stays visible.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const rw = useMotionValue(28);
  const rh = useMotionValue(28);
  const rr = useMotionValue(14);
  const sx = useSpring(rx, SPRING);
  const sy = useSpring(ry, SPRING);
  const sw = useSpring(rw, SPRING);
  const sh = useSpring(rh, SPRING);
  const sr = useSpring(rr, SPRING);
  const gx = useSpring(px, { stiffness: 60, damping: 20 });
  const gy = useSpring(py, { stiffness: 60, damping: 20 });

  const target = useRef<Element | null>(null);
  const pointer = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    let burstId = 0;

    const layout = () => {
      const { x, y } = pointer.current;
      const t = target.current;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) {
        setMode("text");
        return;
      }
      if (t) {
        const r = t.getBoundingClientRect();
        if (r.width <= MAX_SNAP_W && r.height <= MAX_SNAP_H && !t.hasAttribute("data-cursor")) {
          const pad = 5;
          const w = r.width + pad * 2;
          const h = r.height + pad * 2;
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          rx.set(cx + (x - cx) * 0.15 - w / 2);
          ry.set(cy + (y - cy) * 0.15 - h / 2);
          rw.set(w);
          rh.set(h);
          const radius = parseFloat(getComputedStyle(t).borderTopLeftRadius) || 10;
          rr.set(Math.min(radius + pad, h / 2));
          setMode("snap");
          return;
        }
        const s = 54;
        rx.set(x - s / 2);
        ry.set(y - s / 2);
        rw.set(s);
        rh.set(s);
        rr.set(s / 2);
        setMode("big");
        return;
      }
      const s = 30;
      rx.set(x - s / 2);
      ry.set(y - s / 2);
      rw.set(s);
      rh.set(s);
      rr.set(s / 2);
      setMode("idle");
    };

    const retarget = (el: Element | null) => {
      const t = el?.closest("input, textarea, [contenteditable=true]") ?? el?.closest(SNAP) ?? null;
      if (t !== target.current) {
        target.current = t;
        setLabel(t?.getAttribute("data-cursor") ?? null);
      }
      layout();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current = { x: e.clientX, y: e.clientY };
      px.set(e.clientX);
      py.set(e.clientY);
      retarget(e.target as Element | null);
    };
    // After a click the element under the pointer may change (popup opened, deck dealt).
    const afterClick = () =>
      window.setTimeout(() => {
        const { x, y } = pointer.current;
        retarget(document.elementFromPoint(x, y));
      }, 80);
    const leave = () => setMode("hidden");
    const press = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setDown(true);
      const id = ++burstId;
      setBursts((b) => [...b.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 700);
    };
    const release = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", layout, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    window.addEventListener("click", afterClick);
    return () => {
      window.removeEventListener("click", afterClick);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", layout);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [px, py, rx, ry, rw, rh, rr]);

  if (!enabled) return null;
  const ringVisible = mode === "idle" || mode === "snap" || mode === "big";

  return (
    <>
      {/* Soft glow trail (dark theme only) */}
      <motion.div
        aria-hidden
        style={{ x: gx, y: gy }}
        className="pointer-events-none fixed top-0 left-0 -z-10 -mt-[250px] -ml-[250px] hidden size-[500px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_65%)] dark:block"
      />

      {/* Ring: trails the pointer, wraps buttons and links */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, width: sw, height: sh, borderRadius: sr }}
        animate={{
          opacity: ringVisible ? 1 : 0,
          scale: down ? 0.92 : 1,
          borderWidth: mode === "snap" ? 1.5 : 1.5,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { type: "spring", stiffness: 500, damping: 25 },
        }}
        className={`border-accent pointer-events-none fixed top-0 left-0 z-[70] border-solid ${
          mode === "snap"
            ? "bg-accent/10 shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
            : mode === "big"
              ? "bg-accent/10"
              : ""
        }`}
      />

      {/* Dot */}
      <motion.div
        aria-hidden
        style={{ x: px, y: py }}
        animate={{
          scale: mode === "idle" ? (down ? 0.6 : 1) : 0,
          opacity: mode === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className="bg-accent pointer-events-none fixed top-0 left-0 z-[71] -mt-[3px] -ml-[3px] size-1.5 rounded-full"
      />

      {/* Label pill */}
      <motion.div
        aria-hidden
        style={{ x: px, y: py }}
        className="pointer-events-none fixed top-0 left-0 z-[72]"
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.5, x: 14, y: 10 }}
              animate={{ opacity: 1, scale: 1, x: 24, y: 18 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="bg-accent text-accent-fg block rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase shadow-lg"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Click bursts */}
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-[69]"
            style={{ x: b.x, y: b.y }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="border-accent absolute -mt-3 -ml-3 size-6 rounded-full border"
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className={`absolute -mt-[2px] -ml-[2px] size-1 rounded-full ${i % 2 ? "bg-accent-2" : "bg-accent"}`}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(a) * 26, y: Math.sin(a) * 26, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
