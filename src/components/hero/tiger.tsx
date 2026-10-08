"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "framer-motion";

/**
 * Geometric (low-poly) tiger face, drawn as one left half mirrored to the right.
 * Draws itself in on load, breathes, blinks, twitches its ears and follows the cursor
 * with its eyes. Fully static when the visitor prefers reduced motion.
 */

const C = {
  orange: "#F28C38",
  orangeDeep: "#E0702A",
  rust: "#C25A1E",
  light: "#F6A55A",
  white: "#F7F1E8",
  cream: "#E9DECE",
  ink: "#1A1410",
  earInner: "#3A2418",
  amber: "#F5C542",
  nose: "#3B2219",
};

type Poly = { points: string; fill: string };

// Left half of the face (x <= 200). Order matters: later shapes paint on top.
const FACETS: Poly[] = [
  { points: "200,70 162,78 168,140 200,150", fill: C.orange },
  { points: "162,78 118,100 128,150 168,140", fill: C.orangeDeep },
  { points: "118,100 84,150 128,150", fill: C.rust },
  { points: "84,150 66,198 122,196 128,150", fill: C.orangeDeep },
  { points: "128,150 168,140 176,168 124,170", fill: C.white },
  { points: "66,198 58,236 112,240 122,196", fill: C.white },
  { points: "58,236 86,286 120,262 112,240", fill: C.cream },
  { points: "124,170 176,168 182,214 122,196", fill: C.orange },
  { points: "168,140 200,150 200,218 182,214 176,168", fill: C.light },
  { points: "122,196 182,214 200,218 200,258 150,262 112,240", fill: C.white },
  { points: "150,262 200,258 200,300", fill: C.white },
  { points: "112,240 150,262 120,262", fill: C.cream },
  { points: "86,286 132,316 200,326 200,300 150,262 120,262", fill: C.cream },
  { points: "132,316 200,346 200,326", fill: C.white },
];

const STRIPES: string[] = [
  "178,82 186,90 172,124",
  "160,90 168,96 150,128",
  "120,106 146,116 124,122",
  "102,128 132,134 106,140",
  "62,210 104,214 66,220",
  "64,232 106,236 70,244",
  "76,262 110,256 84,272",
];

const OUTLINE =
  "M200 70 L162 78 L118 100 L84 150 L66 198 L58 236 L86 286 L132 316 L200 346 L268 316 L314 286 L342 236 L334 198 L316 150 L282 100 L238 78 Z";

function Half({
  mirror,
  look,
  reduce,
}: {
  mirror?: boolean;
  look: { x: number; y: number };
  reduce: boolean;
}) {
  // Mirrored half lives in a flipped coordinate system, so horizontal gaze is inverted.
  const dx = (mirror ? -1 : 1) * look.x;
  return (
    <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
      {/* Ear */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "60% 100%" }}
        animate={reduce ? undefined : { rotate: [0, 0, -8, 3, 0, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: mirror ? 6.5 : 4.5,
          times: [0, 0.4, 0.55, 0.7, 0.85, 1],
        }}
      >
        <polygon points="96,58 160,96 118,146" fill={C.rust} />
        <polygon points="108,78 148,100 120,130" fill={C.earInner} />
        <polygon points="116,96 140,104 122,124" fill={C.white} />
      </motion.g>

      {FACETS.map((f, i) => (
        <motion.polygon
          key={f.points}
          points={f.points}
          fill={f.fill}
          stroke={C.ink}
          strokeOpacity={0.12}
          strokeWidth={1}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 + i * 0.05 }}
        />
      ))}

      {STRIPES.map((points, i) => (
        <motion.polygon
          key={points}
          points={points}
          fill={C.ink}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          transition={{ duration: 0.4, delay: 0.9 + i * 0.05 }}
        />
      ))}

      {/* Eye, with a blink on a loop */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
      >
        <path
          d="M130 186 Q152 168 178 186 Q152 200 130 186 Z"
          fill={C.amber}
          stroke={C.ink}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <ellipse cx={154 + dx} cy={186 + look.y} rx={3.5} ry={8} fill={C.ink} />
        <circle cx={150 + dx} cy={181 + look.y} r={1.6} fill="#fff" />
      </motion.g>

      {/* Whisker dots */}
      {[
        [168, 246],
        [158, 254],
        [172, 258],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={C.ink} />
      ))}
    </g>
  );
}

export function Tiger({ onClick }: { onClick?: () => void }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const gx = useSpring(0, { stiffness: 120, damping: 18 });
  const gy = useSpring(0, { stiffness: 120, damping: 18 });
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [roaring, setRoaring] = useState(false);
  // The whole head turns slightly toward the pointer.
  const turnY = useTransform(gx, (v) => v * 3);
  const turnX = useTransform(gy, (v) => -v * 3);
  const tilt = useTransform(gx, (v) => v * 0.8);

  function roar() {
    if (reduce || roaring) return onClick?.();
    setRoaring(true);
    window.setTimeout(() => {
      setRoaring(false);
      onClick?.();
    }, 700);
  }

  // Eyes follow the pointer anywhere on the page.
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height * 0.45)) / (window.innerHeight / 2);
      gx.set(Math.max(-1, Math.min(1, nx)) * 5);
      gy.set(Math.max(-1, Math.min(1, ny)) * 3);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const unX = gx.on("change", (x) => setLook((l) => ({ ...l, x })));
    const unY = gy.on("change", (y) => setLook((l) => ({ ...l, y })));
    return () => {
      window.removeEventListener("pointermove", onMove);
      unX();
      unY();
    };
  }, [reduce, gx, gy]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={roar}
      data-cursor="Chat"
      aria-label="Open the AI assistant"
      className="group relative block w-full cursor-pointer rounded-full focus-visible:outline-offset-8"
    >
      {/* Soft glow behind the head */}
      <span
        aria-hidden
        className="bg-accent/25 absolute inset-[12%] rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-70"
      />
      {/* Shockwave rings on roar */}
      <AnimatePresence>
        {roaring
          ? [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="border-accent pointer-events-none absolute inset-[18%] rounded-full border-2"
                initial={{ scale: 0.7, opacity: 0.9 }}
                animate={{ scale: 1.9, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
              />
            ))
          : null}
      </AnimatePresence>
      <motion.div
        style={{ rotateY: turnY, rotateX: turnX, rotate: tilt, transformPerspective: 800 }}
        animate={
          roaring ? { x: [0, -6, 6, -5, 5, -2, 0], scale: [1, 1.08, 1.06, 1] } : { x: 0, scale: 1 }
        }
        transition={{ duration: 0.6 }}
      >
        <motion.svg
          viewBox="40 40 320 320"
          className="relative w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          aria-hidden
          animate={reduce ? undefined : { scale: [1, 1.015, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={reduce ? undefined : { rotate: [0, -2, 2, 0], transition: { duration: 0.5 } }}
        >
          <Half look={look} reduce={reduce} />
          <Half mirror look={look} reduce={reduce} />

          {/* Centre forehead stripe */}
          <motion.polygon
            points="200,78 192,96 200,128 208,96"
            fill={C.ink}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />

          {/* Nose and mouth */}
          <path d="M182 220 L218 220 L200 244 Z" fill={C.nose} strokeLinejoin="round" />
          <path
            d="M190 223 L200 223"
            stroke="#fff"
            strokeOpacity={0.5}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {roaring ? (
            <motion.path
              d="M176 256 Q200 312 224 256 Q200 266 176 256 Z"
              fill="#5A1E14"
              stroke={C.ink}
              strokeWidth={2.5}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            />
          ) : null}
          <path
            d="M200 244 L200 262 M200 262 Q186 276 170 268 M200 262 Q214 276 230 268"
            fill="none"
            stroke={C.ink}
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Outline draws itself in */}
          <motion.path
            d={OUTLINE}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>
      </motion.div>
    </button>
  );
}
