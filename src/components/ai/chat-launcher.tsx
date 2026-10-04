"use client";

import { Sparkles } from "lucide-react";
import { useUI } from "@/components/layout/ui-provider";

export function ChatLauncher() {
  const { askAI, chatOpen } = useUI();
  if (chatOpen) return null;
  return (
    <button
      onClick={() => askAI()}
      aria-label="Open AI chat"
      className="bg-accent text-accent-fg fixed right-5 bottom-5 z-40 inline-flex size-14 items-center justify-center rounded-full shadow-[0_10px_40px_-10px_var(--accent)] transition-transform hover:scale-105"
    >
      <Sparkles className="size-5" />
    </button>
  );
}
