"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type UIState = {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  /** Opens the chat and sends this question immediately. */
  askAI: (question?: string) => void;
  pendingQuestion: string | null;
  consumePendingQuestion: () => string | null;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingQuestion, setPending] = useState<string | null>(null);

  const askAI = useCallback((question?: string) => {
    if (question) setPending(question);
    setPaletteOpen(false);
    setChatOpen(true);
  }, []);

  const consumePendingQuestion = useCallback(() => {
    const q = pendingQuestion;
    setPending(null);
    return q;
  }, [pendingQuestion]);

  const value = useMemo(
    () => ({
      chatOpen,
      setChatOpen,
      askAI,
      pendingQuestion,
      consumePendingQuestion,
      paletteOpen,
      setPaletteOpen,
    }),
    [chatOpen, askAI, pendingQuestion, consumePendingQuestion, paletteOpen],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
