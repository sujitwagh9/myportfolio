"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { EASE, Reveal } from "@/components/motion/reveal";
import { SplitTitle } from "@/components/motion/split-title";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  const reduce = useReducedMotion();
  // Titles lean slightly with scroll speed, so fast scrolling feels fluid.
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 });
  const skew = useTransform(velocity, [-2000, 0, 2000], reduce ? [0, 0, 0] : [4, 0, -4], {
    clamp: true,
  });

  return (
    <div className="relative z-10 mb-6 max-w-2xl md:mb-8">
      <motion.p
        className="text-accent mb-3 flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase"
        initial={{ opacity: 0, x: reduce ? 0 : -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.span
          aria-hidden
          className="bg-accent h-px w-8 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        {index} / {eyebrow}
      </motion.p>
      <motion.div style={{ skewY: skew }}>
        <SplitTitle text={title} className="text-3xl font-semibold text-balance md:text-4xl" />
      </motion.div>
      {intro ? (
        <Reveal delay={0.2} y={16}>
          <p className="text-muted mt-4 text-lg text-pretty">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * Page section. As it scrolls into view its content eases up into place (scroll-linked,
 * so it reverses smoothly when scrolling back), and an oversized outlined word slides
 * sideways behind it for depth.
 */
export function Section({
  id,
  children,
  className = "",
  watermark,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  watermark?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(enter, [0, 1], [reduce ? 0 : 70, 0]);
  const scale = useTransform(enter, [0, 1], [reduce ? 1 : 0.96, 1]);
  const wx = useTransform(pass, [0, 1], reduce ? ["0%", "0%"] : ["15%", "-35%"]);

  return (
    <section id={id} ref={ref} className="relative overflow-x-clip">
      {watermark ? (
        <motion.span
          aria-hidden
          style={{ x: wx }}
          className="font-display pointer-events-none absolute top-4 left-0 text-[clamp(5rem,16vw,14rem)] leading-none font-bold whitespace-nowrap text-transparent uppercase opacity-60 select-none [-webkit-text-stroke:1px_var(--border)]"
        >
          {watermark}
        </motion.span>
      ) : null}
      <motion.div
        style={{ y, scale }}
        className={`relative mx-auto max-w-[1100px] px-5 py-10 md:py-14 ${className}`}
      >
        {children}
      </motion.div>
    </section>
  );
}
