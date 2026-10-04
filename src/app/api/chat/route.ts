import { aiEnabled, BLOCKED_FINISH, getClient, MODEL, publicErrorMessage } from "@/lib/ai/gemini";
import { mockChatAnswer, mockEnabled } from "@/lib/ai/mock";
import { CHAT_SYSTEM, chatUserTurn } from "@/lib/ai/prompts";
import { retrieve } from "@/lib/ai/retrieve";
import { chatRequestSchema, type ChatEvent } from "@/lib/ai/schemas";
import { guard, jsonError, readJson } from "@/lib/api";
import { neutralizeTags, sanitizeText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { blocked, log } = await guard(req, "chat", 20, 600);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    log(400);
    return jsonError("Invalid request.", 400);
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    log(400);
    return jsonError("Please send a shorter question.", 400);
  }
  const mock = mockEnabled();
  if (!mock && !aiEnabled()) {
    log(503);
    return jsonError("The AI assistant is not configured on this deployment.", 503);
  }

  const history = parsed.data.messages.map((m) => ({
    role: m.role,
    content: neutralizeTags(sanitizeText(m.content, m.role === "user" ? 1000 : 3000)),
  }));
  const question = history[history.length - 1]!.content;
  if (!question) {
    log(400);
    return jsonError("Please type a question.", 400);
  }

  // Retrieve on the latest question plus the previous one, so follow-ups keep context.
  const previousUser =
    history
      .slice(0, -1)
      .filter((m) => m.role === "user")
      .at(-1)?.content ?? "";
  const { hits, mode } = await retrieve(`${previousUser}\n${question}`.trim(), { k: 6 });
  const chunks = hits.map((h) => h.chunk);
  const sources = chunks.map((c, i) => ({
    id: `S${i + 1}`,
    title: c.title,
    href: c.href,
    section: c.section,
  }));

  // Gemini calls the assistant role "model".
  const contents = [
    ...history.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: chatUserTurn(question, chunks) }] },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: ChatEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(e)}\n`));
      send({ type: "sources", sources, mode, mock });
      try {
        if (mock) {
          for await (const text of mockChatAnswer(chunks, req.signal))
            send({ type: "delta", text });
          send({ type: "done" });
          log(200);
          return;
        }
        const response = await getClient().models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction: CHAT_SYSTEM,
            maxOutputTokens: 1500,
            temperature: 0.3,
            abortSignal: req.signal,
          },
        });
        let finish: string | undefined;
        let blocked = false;
        for await (const chunk of response) {
          if (chunk.promptFeedback?.blockReason) blocked = true;
          const text = chunk.text;
          if (text) send({ type: "delta", text });
          finish = chunk.candidates?.[0]?.finishReason ?? finish;
        }
        if (blocked || (finish && BLOCKED_FINISH.has(finish))) {
          send({
            type: "delta",
            text: "\n\nI can't help with that one. Try asking about Sujit's projects, experience or skills.",
          });
        } else if (finish === "MAX_TOKENS") {
          send({ type: "delta", text: "…" });
        }
        send({ type: "done" });
        log(200);
      } catch (err) {
        if (!req.signal.aborted) send({ type: "error", message: publicErrorMessage(err) });
        log(502);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
