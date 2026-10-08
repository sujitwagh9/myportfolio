"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin bar along the top edge that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="from-accent to-accent-2 fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r"
    />
  );
}
