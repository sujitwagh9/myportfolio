"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const initial: ContactState = { status: "idle", message: "" };

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [startedAt, setStartedAt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setStartedAt(Date.now()), []);
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        className="glass flex flex-col items-start gap-3 rounded-[var(--radius-card)] p-8"
        role="status"
      >
        <CheckCircle2 className="text-signal size-8" />
        <p className="text-lg">{state.message}</p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  return (
    <form
      ref={formRef}
      action={action}
      className="glass space-y-4 rounded-[var(--radius-card)] p-6"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" id="name" error={err.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            aria-invalid={!!err.name}
            aria-describedby={err.name ? "name-error" : undefined}
          />
        </Field>
        <Field label="Email" id="email" error={err.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={160}
            aria-invalid={!!err.email}
            aria-describedby={err.email ? "email-error" : undefined}
          />
        </Field>
      </div>
      <Field label="Message" id="message" error={err.message}>
        <Textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={3000}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? "message-error" : undefined}
        />
      </Field>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-response-field-name="turnstileToken"
          />
        </>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={`text-sm ${state.status === "error" ? "text-danger" : "text-muted"}`}
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Send />}
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-muted font-mono text-xs tracking-wide uppercase">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
