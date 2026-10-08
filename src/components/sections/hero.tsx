"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import { site } from "@content/site";
import { Tiger } from "@/components/hero/tiger";
import { WaveText } from "@/components/interactive/wave-text";
import { Magnetic } from "@/components/motion/magnetic";
import { useUI } from "@/components/layout/ui-provider";
import { Button } from "@/components/ui/button";

const PROMPTS = [
  "What does Sujit do?",
  "What are Sujit's strongest skills?",
  "Which hackathons has Sujit won?",
];

// Hero entrance is CSS-driven (.hero-in) so it is visible before hydration: good for LCP and no-JS.
const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Hero() {
  const { askAI } = useUI();
  const [q, setQ] = useState("");
  const [first, ...rest] = site.name.split(" ");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Parallax as the hero scrolls away: text drifts up and fades, the tiger sinks and shrinks.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const tigerY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const tigerScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.8]);
  const tigerRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -8]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[86svh] items-center overflow-hidden pt-24 pb-4"
    >
      <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 px-5 lg:grid-cols-[1.15fr_1fr]">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="order-2 lg:order-1">
          <p
            style={delay(0)}
            className="hero-in text-muted font-mono text-xs tracking-[0.18em] uppercase"
          >
            {site.role} · {site.location}
          </p>
          <h1
            style={delay(0.08)}
            className="hero-in mt-4 text-6xl leading-[0.95] font-semibold sm:text-7xl lg:text-8xl"
          >
            <WaveText text={first ?? ""} />{" "}
            <WaveText
              text={rest.join(" ")}
              gradient="linear-gradient(100deg, var(--fg) 0%, var(--accent) 55%, var(--accent-2) 100%)"
            />
          </h1>
          <p style={delay(0.16)} className="hero-in text-muted mt-5 max-w-md text-lg text-pretty">
            {site.positioning}
          </p>

          {/* The AI is the headline feature, so the hero opens with it. */}
          <form
            style={delay(0.24)}
            className="hero-in mt-8 max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();
              askAI(q.trim() || undefined);
              setQ("");
            }}
          >
            <label htmlFor="hero-ask" className="sr-only">
              Ask my AI a question about me
            </label>
            <div className="glass focus-within:border-accent flex items-center gap-2 rounded-full p-1.5 pl-5 transition-colors">
              <Sparkles className="text-accent size-4 shrink-0" aria-hidden />
              <input
                id="hero-ask"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={300}
                placeholder="Ask my AI anything about me…"
                className="placeholder:text-muted min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              />
              <Button type="submit" size="icon" aria-label="Ask">
                <ArrowRight />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PROMPTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => askAI(s)}
                  className="border-border text-muted hover:border-accent hover:text-fg rounded-full border px-3 py-1 text-xs transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>

          <div style={delay(0.32)} className="hero-in mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button variant="outline" asChild>
                <Link href="/#contact">
                  <Mail /> Get in touch
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="ghost" asChild>
                <a href={site.resumeUrl} download>
                  <Download /> Resume
                </a>
              </Button>
            </Magnetic>
          </div>
        </motion.div>

        <div
          style={delay(0.1)}
          className="hero-in order-1 mx-auto w-56 sm:w-72 lg:order-2 lg:w-full lg:max-w-[440px]"
        >
          <motion.div style={{ y: tigerY, scale: tigerScale, rotate: tigerRotate }}>
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Tiger onClick={() => askAI()} />
            </motion.div>
          </motion.div>
          <p className="text-muted mt-2 text-center font-mono text-[11px]">
            Click the tiger. It roars, then chats.
          </p>
        </div>
      </div>
    </section>
  );
}
