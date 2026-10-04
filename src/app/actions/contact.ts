"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { site } from "@content/site";
import { clientIp, logRequest, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email.").max(160),
  message: z.string().trim().min(20, "Please write at least 20 characters.").max(3000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.coerce.number(),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(5000),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function sendEmail(input: { name: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!key || !to) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Portfolio message from ${input.name}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const startedAt = Date.now();
  const ip = clientIp(await headers());

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message")
        fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // Bots: filled honeypot or submitted faster than a human can type. Pretend success.
  if (data.website || startedAt - data.startedAt < 3000) {
    logRequest("contact", ip, 204, startedAt);
    return { status: "success", message: "Thanks! Your message has been sent." };
  }

  const rl = await rateLimit(`contact:${ip}`, 3, 3600);
  if (!rl.ok) {
    logRequest("contact", ip, 429, startedAt);
    return {
      status: "error",
      message: "You've sent a few messages already. Please try again later.",
    };
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    logRequest("contact", ip, 403, startedAt);
    return {
      status: "error",
      message: "Spam check failed. Please refresh the page and try again.",
    };
  }

  try {
    const sent = await sendEmail({
      name: sanitizeText(data.name, 80),
      email: data.email,
      message: sanitizeText(data.message, 3000),
    });
    if (!sent) {
      logRequest("contact", ip, 503, startedAt);
      return {
        status: "error",
        message: `The contact form isn't set up yet. Please email ${site.email} directly.`,
      };
    }
    logRequest("contact", ip, 200, startedAt);
    return { status: "success", message: "Thanks! Your message has been sent. I'll reply soon." };
  } catch {
    logRequest("contact", ip, 502, startedAt);
    return {
      status: "error",
      message: `Couldn't send right now. Please email ${site.email} directly.`,
    };
  }
}
