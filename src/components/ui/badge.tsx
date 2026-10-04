import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & { tone?: "default" | "accent" | "teal" | "signal" | "danger" }) {
  const tones = {
    default: "border-border text-muted",
    accent: "border-accent/40 text-accent",
    teal: "border-accent-2/40 text-accent-2",
    signal: "border-signal/40 text-signal",
    danger: "border-danger/40 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-chip)] border px-2 py-0.5 font-mono text-[11px] tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
