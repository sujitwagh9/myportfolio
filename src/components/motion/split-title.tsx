"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./reveal";

/** Heading whose words slide up from behind a mask, one after another. */
export function SplitTitle({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={
              reduce
                ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                : {
                    hidden: { y: "110%" },
                    show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
                  }
            }
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}
