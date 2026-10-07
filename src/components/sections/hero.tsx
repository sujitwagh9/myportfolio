"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import { site } from "@content/site";
import { Tiger } from "@/components/hero/tiger";
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

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 px-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="order-2 lg:order-1">
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
            {first} <span className="text-gradient">{rest.join(" ")}</span>
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
            <Button variant="outline" asChild>
              <Link href="/#contact">
                <Mail /> Get in touch
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <a href={site.resumeUrl} download>
                <Download /> Resume
              </a>
            </Button>
          </div>
        </div>

        <div
          style={delay(0.1)}
          className="hero-in order-1 mx-auto w-56 sm:w-72 lg:order-2 lg:w-full lg:max-w-[440px]"
        >
          <Tiger onClick={() => askAI()} />
          <p className="text-muted mt-2 text-center font-mono text-[11px]">
            Tap the tiger to chat with my AI
          </p>
        </div>
      </div>
    </section>
  );
}
