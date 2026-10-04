"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "hiring", label: "Hiring" },
  { id: "collaboration", label: "Collaborating" },
  { id: "consulting", label: "Data platform consulting" },
  { id: "browsing", label: "Just browsing" },
] as const;

type Intent = (typeof OPTIONS)[number]["id"];

/** Optional personalised hero line. The visitor picks from fixed intents; no free text. */
export function IntentGreeting() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function choose(next: Intent) {
    setIntent(next);
    setLoading(true);
    try {
      const res = await fetch("/api/greeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: next }),
      });
      const data = (await res.json()) as { text?: string };
      setText(data.text ?? "");
    } catch {
      setText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label="What brings you here?"
        className="flex flex-wrap items-center gap-2"
      >
        <span className="text-muted font-mono text-xs">I&apos;m here for:</span>
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => void choose(o.id)}
            aria-pressed={intent === o.id}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              intent === o.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-accent-2 hover:text-fg",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="min-h-6" aria-live="polite">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.p
              key="l"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted text-sm"
            >
              …
            </motion.p>
          ) : text ? (
            <motion.p
              key={text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-fg text-sm"
            >
              {text}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
