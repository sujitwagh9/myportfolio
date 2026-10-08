"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Each letter springs up when hovered, like keys on a keyboard. */
export function WaveText({
  text,
  className,
  gradient,
}: {
  text: string;
  className?: string;
  /** Spread one gradient across all letters (each letter shows its own slice). */
  gradient?: string;
}) {
  const reduce = useReducedMotion();
  const letters = Array.from(text);
  const n = letters.length;
  return (
    <span className={className} aria-label={text}>
      {letters.map((ch, i) =>
        ch === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            style={
              gradient
                ? {
                    backgroundImage: gradient,
                    backgroundSize: `${n * 100}% 100%`,
                    backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
                : undefined
            }
            whileHover={reduce ? undefined : { y: -14, rotate: i % 2 ? 6 : -6, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
          >
            {ch}
          </motion.span>
        ),
      )}
    </span>
  );
}
