"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowUp, RotateCcw, Sparkles, Square } from "lucide-react";
import { site } from "@content/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useUI } from "@/components/layout/ui-provider";
import type { ChatEvent, ChatSource } from "@/lib/ai/schemas";
import { cn } from "@/lib/utils";
import { RichText } from "./rich-text";

type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  error?: string;
  pending?: boolean;
};

export const STARTER_QUESTIONS = [
  "What does Sujit work on at the Kalyani Group?",
  "Which tools does Sujit use for data ingestion?",
  "Tell me about the Dark Store Network project.",
  "What hackathons has Sujit won?",
];

const MAX_INPUT = 1000;

export function ChatPanel() {
  const { chatOpen, setChatOpen, pendingQuestion, consumePendingQuestion } = useUI();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const send = useCallback(
    async (text: string, history: Msg[]) => {
      const question = text.trim().slice(0, MAX_INPUT);
      if (!question || busy) return;
      const next: Msg[] = [...history, { role: "user", content: question }];
      setMessages([...next, { role: "assistant", content: "", pending: true }]);
      setInput("");
      setBusy(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const update = (fn: (m: Msg) => Msg) =>
        setMessages((prev) => [...prev.slice(0, -1), fn(prev[prev.length - 1]!)]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next
              .filter((m) => !m.error && m.content)
              .slice(-10)
              .map(({ role, content }) => ({ role, content })),
          }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? "Something went wrong. Please try again.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as ChatEvent;
            if (event.type === "sources") {
              setMockMode(!!event.mock);
              update((m) => ({ ...m, sources: event.sources }));
            } else if (event.type === "delta")
              update((m) => ({ ...m, content: m.content + event.text }));
            else if (event.type === "error") throw new Error(event.message);
          }
        }
        update((m) => ({ ...m, pending: false }));
      } catch (err) {
        if (ctrl.signal.aborted) {
          update((m) => ({ ...m, pending: false, content: m.content || "Stopped." }));
        } else {
          update((m) => ({ ...m, pending: false, error: (err as Error).message }));
        }
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy],
  );

  // Questions sent from elsewhere (hero button, command palette).
  useEffect(() => {
    if (chatOpen && pendingQuestion) {
      const q = consumePendingQuestion();
      if (q) void send(q, messages);
    }
  }, [chatOpen, pendingQuestion, consumePendingQuestion, send, messages]);

  function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const idx = messages.lastIndexOf(lastUser);
    void send(lastUser.content, messages.slice(0, idx));
  }

  return (
    <Sheet open={chatOpen} onOpenChange={setChatOpen}>
      <SheetContent aria-describedby="chat-desc">
        <div className="border-border border-b px-5 py-4 pr-14">
          <SheetTitle className="font-display flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="text-accent size-4" /> Ask {site.name.split(" ")[0]}
            {mockMode ? <Badge tone="danger">mock mode</Badge> : null}
          </SheetTitle>
          <SheetDescription id="chat-desc" className="text-muted text-xs">
            Answers come only from this portfolio, with sources. It will say when it doesn&apos;t
            know.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4" aria-live="polite">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-muted text-sm">Try one of these:</p>
              <ul className="grid gap-2">
                {STARTER_QUESTIONS.map((q) => (
                  <li key={q}>
                    <button
                      onClick={() => void send(q, [])}
                      className="border-border bg-glass hover:border-accent hover:text-accent w-full rounded-[var(--radius-input)] border px-4 py-3 text-left text-sm transition-colors"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="space-y-4">
              {messages.map((m, i) => (
                <li
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "user" ? "bg-accent text-accent-fg" : "glass",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <>
                        {m.content ? <RichText text={m.content} sources={m.sources ?? []} /> : null}
                        {m.pending && !m.content ? <TypingDots /> : null}
                        {m.error ? (
                          <div className="text-danger flex flex-col gap-2">
                            <span className="flex items-center gap-2">
                              <AlertCircle className="size-4" /> {m.error}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={retry}
                              className="self-start"
                            >
                              <RotateCcw /> Retry
                            </Button>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      m.content
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="border-border border-t p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input, messages);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Your question
          </label>
          <div className="border-border bg-surface focus-within:border-accent-2 flex items-end gap-2 rounded-[var(--radius-input)] border p-2">
            <textarea
              id="chat-input"
              rows={1}
              value={input}
              maxLength={MAX_INPUT}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input, messages);
                }
              }}
              placeholder="Ask about projects, experience, skills…"
              className="placeholder:text-muted max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
            />
            {busy ? (
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="Stop"
                onClick={() => abortRef.current?.abort()}
              >
                <Square />
              </Button>
            ) : (
              <Button type="submit" size="icon" aria-label="Send" disabled={!input.trim()}>
                <ArrowUp />
              </Button>
            )}
          </div>
          <p className="text-muted mt-2 text-right font-mono text-[10px]">
            {input.length}/{MAX_INPUT}
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-muted size-1.5 animate-bounce rounded-full"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}
