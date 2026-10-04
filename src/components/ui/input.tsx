import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-[var(--radius-input)] border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted transition-colors focus-visible:border-accent-2 focus-visible:outline-none aria-[invalid=true]:border-danger";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(base, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(base, "min-h-32 resize-y", className)} {...props} />;
}
