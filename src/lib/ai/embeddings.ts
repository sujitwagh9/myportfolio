/**
 * Gemini embeddings, using the same GEMINI_API_KEY as the AI features.
 * Optional: everything falls back to BM25 keyword search when the key is unset.
 */
import { GoogleGenAI } from "@google/genai";

export const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
const DIMENSIONS = 768;

let client: GoogleGenAI | null = null;

export function embeddingsEnabled() {
  return !!process.env.GEMINI_API_KEY;
}

export async function embed(
  inputs: string[],
  inputType: "document" | "query",
): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey });
  const res = await withTimeout(
    client.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: inputs,
      config: {
        taskType: inputType === "document" ? "RETRIEVAL_DOCUMENT" : "RETRIEVAL_QUERY",
        outputDimensionality: DIMENSIONS,
      },
    }),
    inputType === "query" ? 8000 : 60000,
  );
  const vectors = (res.embeddings ?? []).map((e) => e.values ?? []);
  if (vectors.length !== inputs.length || vectors.some((v) => v.length === 0)) {
    throw new Error("Incomplete embedding response");
  }
  return vectors;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Embedding request timed out")), ms);
    p.then(
      (v) => (clearTimeout(t), resolve(v)),
      (e) => (clearTimeout(t), reject(e)),
    );
  });
}

export function cosine(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i] ?? 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}
