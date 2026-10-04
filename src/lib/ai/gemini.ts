import "server-only";
import { ApiError, GoogleGenAI } from "@google/genai";

/** Model for chat, job-fit and the hero greeting. Override with GEMINI_MODEL. */
export const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

let client: GoogleGenAI | null = null;

export function aiEnabled() {
  return !!process.env.GEMINI_API_KEY;
}

export function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

/** Finish reasons that mean the model declined or was blocked rather than finishing normally. */
export const BLOCKED_FINISH = new Set([
  "SAFETY",
  "RECITATION",
  "BLOCKLIST",
  "PROHIBITED_CONTENT",
  "SPII",
  "IMAGE_SAFETY",
]);

/** Safe, user-facing error text. Never includes provider details. */
export function publicErrorMessage(err: unknown) {
  if (err instanceof ApiError) {
    if (err.status === 429) return "The AI is busy right now. Please try again in a minute.";
    if (err.status === 401 || err.status === 403)
      return "The AI is not configured on this deployment.";
    if (err.status >= 500) return "The AI service had a problem. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
