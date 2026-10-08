"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Soft spring with a little overshoot: feels physical rather than mechanical. */
export const SPRING = { type: "spring", stiffness: 90, damping: 16, mass: 0.9 } as const;

type From = "up" | "left" | "right" | "scale" | "tilt";

const START: Record<From, Record<string, number | string>> = {
  up: { y: 50 },
  left: { x: -70, rotate: -2 },
  right: { x: 70, rotate: 2 },
  scale: { scale: 0.88, y: 30 },
  tilt: { y: 60, rotateX: 25 },
};

/**
 * Brings children into view once, with a springy entrance from a chosen direction.
 * Opacity-only when the visitor prefers reduced motion.
 */
export function Reveal({
  delay = 0,
  from = "up",
  y,
  style,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; from?: From; y?: number }) {
  const reduce = useReducedMotion();
  const start = { ...START[from], ...(y !== undefined ? { y } : {}) };
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", ...start }}
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0 }
      }
      viewport={{ once: true, margin: "-60px" }}
      transition={
        reduce ? { duration: 0.2 } : { ...SPRING, delay, filter: { duration: 0.5, delay } }
      }
      style={{ transformPerspective: 1000, ...style }}
      {...props}
    />
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: SPRING },
};

/** Pop: scale up from small with a random-looking spin, like tiles being dealt. */
const pop: Variants = {
  hidden: (i: number = 0) => ({ opacity: 0, scale: 0.4, rotate: (i % 3) * 12 - 12, y: 20 }),
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 15 },
  },
};

const reduced: Variants = { hidden: { opacity: 0 }, show: { opacity: 1 } };

/** A list whose children (StaggerItem) animate in one after another. */
export function Stagger(props: HTMLMotionProps<"ul">) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      {...props}
    />
  );
}

export function StaggerItem({
  variant = "rise",
  i = 0,
  ...props
}: HTMLMotionProps<"li"> & { variant?: "rise" | "pop"; i?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li custom={i} variants={reduce ? reduced : variant === "pop" ? pop : rise} {...props} />
  );
}
