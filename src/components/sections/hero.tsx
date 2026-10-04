"use client";

import Link from "next/link";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { site } from "@content/site";
import { IntentGreeting } from "@/components/ai/intent-greeting";
import { useUI } from "@/components/layout/ui-provider";
import { CountUp } from "@/components/motion/count-up";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroVisual } from "@/components/three/hero-visual";
import { Button } from "@/components/ui/button";
import { TechIcon } from "@/components/ui/tech-icon";

// Hero entrance is CSS-driven (.hero-in) so it is visible before hydration: good for LCP and no-JS.
const delay = (s: number) => ({ animationDelay: `${s}s` });

const STACK = [
  "Apache NiFi",
  "Apache Superset",
  "PostgreSQL",
  "Docker",
  "Nginx",
  "Grafana",
  "Prometheus",
  "Python",
  "Redis",
  "Linux",
  "Azure AD",
  "Apache Spark",
];

export function Hero() {
  const { askAI } = useUI();
  const [first, ...rest] = site.name.split(" ");

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-10">
      <HeroVisual />
      <div className="mx-auto w-full max-w-[1200px] px-5">
        <p
          style={delay(0)}
          className="hero-in border-border bg-glass text-muted mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs"
        >
          <span className="bg-signal size-1.5 animate-pulse rounded-full" aria-hidden />
          {site.role} @ {site.company}
        </p>
        <h1
          style={delay(0.08)}
          className="hero-in text-6xl leading-[0.95] font-semibold sm:text-7xl md:text-8xl lg:text-[7.5rem]"
        >
          {first}
          <br />
          <span className="text-gradient">{rest.join(" ")}</span>
        </h1>
        <p
          style={delay(0.16)}
          className="hero-in text-muted mt-6 max-w-xl text-lg text-pretty md:text-xl"
        >
          {site.positioning}
        </p>

        <div style={delay(0.24)} className="hero-in mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Button size="lg" asChild>
              <Link href="/#contact">
                <Mail /> Get in touch
              </Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="outline" asChild>
              <a href={site.resumeUrl} download>
                <Download /> Resume
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="outline" onClick={() => askAI()}>
              <Sparkles /> Ask my AI
            </Button>
          </Magnetic>
        </div>

        <dl
          style={delay(0.32)}
          className="hero-in mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {site.stats.map((s) => (
            <div
              key={s.label}
              className="glass flex flex-col-reverse rounded-[var(--radius-input)] px-4 py-3"
            >
              <dt className="text-muted font-mono text-[10px] tracking-wide uppercase">
                {s.label}
              </dt>
              <dd
                className={`font-display text-accent leading-tight font-semibold ${s.value.length > 5 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`}
              >
                <CountUp value={s.value} />
              </dd>
            </div>
          ))}
        </dl>

        <div style={delay(0.4)} className="hero-in mt-8">
          <IntentGreeting />
        </div>
      </div>

      <LogoMarquee />

      <Link
        href="/#about"
        aria-label="Scroll to About"
        className="border-border text-muted hover:text-fg absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full border p-3 transition-colors md:block"
      >
        <ArrowDown className="size-4" />
      </Link>
    </section>
  );
}

/** Slowly scrolling band of the tools I work with. Pauses on hover; static with reduced motion. */
function LogoMarquee() {
  const items = [...STACK, ...STACK];
  return (
    <div className="group relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <p className="sr-only">Tools I work with: {STACK.join(", ")}</p>
      <ul
        className="flex w-max animate-[marquee_40s_linear_infinite] gap-3 group-hover:[animation-play-state:paused]"
        aria-hidden
      >
        {items.map((name, i) => (
          <li
            key={`${name}-${i}`}
            className="border-border bg-glass text-fg flex items-center gap-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap"
          >
            <TechIcon name={name} className="size-4" />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
