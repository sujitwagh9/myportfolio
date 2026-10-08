"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A tile you can pick up and throw; it springs back home with a wobble. */
export function DraggableTile({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      title={title}
      data-cursor="Drag"
      drag={!reduce}
      dragSnapToOrigin
      dragElastic={0.7}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 12 }}
      whileHover={reduce ? undefined : { y: -4, rotate: -3 }}
      whileDrag={{ scale: 1.15, rotate: 8, zIndex: 20, cursor: "grabbing" }}
      whileTap={{ scale: 0.95 }}
      className={className}
      style={{ touchAction: "pan-y" }}
    >
      {children}
    </motion.div>
  );
}
