"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Command, Menu, Sparkles, X } from "lucide-react";
import { site } from "@content/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sections } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { useUI } from "./ui-provider";

export function SiteHeader() {
  const { setPaletteOpen, askAI } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled || menuOpen ? "glass border-x-0 border-t-0" : "border-b border-transparent",
      )}
    >
      <a
        href="#main"
        className="focus:bg-accent focus:text-accent-fg sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-full focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          {site.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  className="text-muted hover:text-fg rounded-full px-3 py-2 text-sm transition-colors"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <Command /> <span className="font-mono">K</span>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => askAI()}>
            <Sparkles /> Ask AI
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-border border-t px-5 pb-5 lg:hidden"
        >
          <ul className="grid grid-cols-2 gap-1 pt-3">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-surface-2 block rounded-[var(--radius-input)] px-3 py-3 text-sm"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setMenuOpen(false);
                askAI();
              }}
            >
              <Sparkles /> Ask AI
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMenuOpen(false);
                setPaletteOpen(true);
              }}
            >
              <Command /> Search
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
