"use client";

import { MessageSquare, ShieldCheck } from "lucide-react";
import { STARTER_QUESTIONS } from "@/components/ai/chat-panel";
import { JobFitAnalyzer } from "@/components/ai/job-fit-analyzer";
import { useUI } from "@/components/layout/ui-provider";
import { TiltCard } from "@/components/interactive/tilt-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function AISection() {
  const { askAI } = useUI();
  return (
    <div className="space-y-5">
      <Reveal from="scale">
        <TiltCard
          max={3}
          className="glass grid gap-6 rounded-[var(--radius-card)] p-6 md:grid-cols-[1fr_1.2fr] md:p-8"
        >
          <div>
            <span className="bg-accent/10 text-accent flex size-11 items-center justify-center rounded-full">
              <MessageSquare className="size-5" />
            </span>
            <h3 className="mt-4 text-2xl font-semibold">Chat with my AI</h3>
            <p className="text-muted mt-2 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="text-signal size-4" /> Answers only from this site, with
              sources.
            </p>
            <Button className="mt-5" onClick={() => askAI()}>
              Start a chat
            </Button>
          </div>
          <Stagger className="grid content-center gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <StaggerItem key={q}>
                <button
                  onClick={() => askAI(q)}
                  className="border-border hover:border-accent hover:text-accent w-full rounded-[var(--radius-input)] border px-4 py-3 text-left text-sm transition-colors"
                >
                  {q}
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </TiltCard>
      </Reveal>

      <Reveal from="tilt">
        <h3 className="mb-4 text-xl font-semibold">
          Hiring?{" "}
          <span className="text-muted font-normal">Paste a job description and check the fit.</span>
        </h3>
        <JobFitAnalyzer />
      </Reveal>
    </div>
  );
}
