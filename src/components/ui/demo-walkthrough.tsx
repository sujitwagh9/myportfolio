"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { src: string; mobile?: string; caption: string; detail?: string };

const STEP_MS = 4200;

/**
 * Recorded product demo. On larger screens: a laptop plus a phone showing the same
 * step in the mobile layout. On phones: just the phone, full size, so it stays
 * readable. Steps advance on their own, pause on hover, and can be stepped with the
 * buttons, the rail or the arrow keys. Autoplay is off for reduced motion and while
 * the player is off-screen.
 */
export function DemoWalkthrough({
  steps,
  host,
  title,
}: {
  steps: Step[];
  host?: string;
  title: string;
}) {
  const [i, setI] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const playing = !paused && !hovered && !reduce && inView;

  const go = useCallback((n: number) => setI((n + steps.length) % steps.length), [steps.length]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(i + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, i, go]);

  const step = steps[i]!;
  const hasMobile = steps.every((s) => s.mobile);

  return (
    <div
      ref={ref}
      className="group select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      {/* ── Phone only (small screens) ─────────────────────────────── */}
      {hasMobile ? (
        <div className="mx-auto w-[64%] max-w-[260px] sm:hidden">
          <Phone
            src={step.mobile!}
            alt={`${title}: ${step.caption}, mobile view`}
            reduce={!!reduce}
          />
          <p className="mt-3 text-center text-sm font-semibold">
            <span className="text-accent mr-1.5 font-mono text-xs">
              {String(i + 1).padStart(2, "0")}
            </span>
            {step.caption}
          </p>
        </div>
      ) : null}

      <div className={cn("relative", hasMobile && "hidden pr-[14%] pb-[5%] sm:block")}>
        {/* ── Laptop ─────────────────────────────────────────────── */}
        <div className="drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)]">
          {/* Lid */}
          <div className="relative rounded-t-[14px] bg-[#1b1c20] p-[1.8%] pb-[2.2%] ring-1 ring-white/10">
            <span
              aria-hidden
              className="absolute top-[0.7%] left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#3a3b40] sm:size-1.5"
            />
            {/* Screen */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-[#0b0b0d]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={step.src}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={step.src}
                    alt={`${title}: ${step.caption}`}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    quality={90}
                    className="object-cover object-top"
                    priority={i === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Caption */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 pt-8 sm:p-4 sm:pt-14">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step.caption}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs font-semibold text-white sm:text-base"
                  >
                    <span className="text-accent mr-2 font-mono text-[10px] sm:text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.caption}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Prev / next */}
              <button
                type="button"
                onClick={() => go(i - 1)}
                aria-label="Previous step"
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(i + 1)}
                aria-label="Next step"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          {/* Base */}
          <div className="relative -mx-[5%] h-2.5 rounded-b-[14px] bg-gradient-to-b from-[#d4d6db] to-[#8f9299] sm:h-3.5">
            <span
              aria-hidden
              className="absolute top-0 left-1/2 h-1 w-[15%] -translate-x-1/2 rounded-b-md bg-[#a9acb3] sm:h-1.5"
            />
          </div>
        </div>

        {/* ── Phone, in step with the laptop ─────────────────────── */}
        {hasMobile ? (
          <div className="absolute right-0 bottom-0 w-[27%] max-w-[210px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-2deg]">
            <Phone
              src={step.mobile!}
              alt={`${title}: ${step.caption}, mobile view`}
              reduce={!!reduce}
            />
          </div>
        ) : null}
      </div>

      {/* Step rail with per-step progress */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "Play demo" : "Pause demo"}
          className="border-border text-muted hover:text-fg rounded-full border p-1.5 transition-colors"
        >
          {paused || reduce ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
        <ol className="flex flex-1 gap-1.5" aria-label="Demo steps">
          {steps.map((s, n) => (
            <li key={s.src} className="flex-1">
              <button
                type="button"
                onClick={() => go(n)}
                aria-label={`Step ${n + 1}: ${s.caption}`}
                aria-current={n === i ? "step" : undefined}
                className="block w-full py-2"
              >
                <span className="bg-border relative block h-1 overflow-hidden rounded-full">
                  {n === i && playing ? (
                    <motion.span
                      key={`fill-${i}`}
                      className="bg-accent absolute inset-y-0 left-0 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                  ) : (
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-[width] duration-300",
                        n <= i ? "bg-accent w-full" : "w-0",
                        n === i && "bg-accent/70",
                      )}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {host ? (
          <span className="text-muted hidden font-mono text-[10px] sm:inline">
            {host} · {i + 1}/{steps.length}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Phone frame whose screen crossfades between step captures. */
function Phone({ src, alt, reduce }: { src: string; alt: string; reduce: boolean }) {
  return (
    <div className="rounded-[1.6rem] border-[5px] border-[#111] bg-[#111] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      <div className="relative aspect-[390/844] overflow-hidden rounded-[1.2rem] bg-black">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="260px"
              quality={90}
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>
        <span
          aria-hidden
          className="absolute top-1.5 left-1/2 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-[#111]"
        />
      </div>
    </div>
  );
}
