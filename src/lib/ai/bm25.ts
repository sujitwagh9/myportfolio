import type { Chunk } from "../corpus";

const STOP = new Set(
  "a an and are as at be by for from has have he his i in is it its of on or that the to was were will with you your what which who how do does did can about me my".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Okapi BM25 over the chunk texts (titles weighted double). */
export function bm25Search(chunks: Chunk[], query: string, k = 6) {
  const q = tokenize(query);
  if (q.length === 0) return [];
  const docs = chunks.map((c) => tokenize(`${c.title} ${c.title} ${c.text}`));
  const avgLen = docs.reduce((n, d) => n + d.length, 0) / Math.max(docs.length, 1);
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);

  const K1 = 1.4;
  const B = 0.75;
  const N = docs.length;

  return docs
    .map((d, i) => {
      const tf = new Map<string, number>();
      for (const t of d) tf.set(t, (tf.get(t) ?? 0) + 1);
      let score = 0;
      for (const t of q) {
        const f = tf.get(t);
        if (!f) continue;
        const n = df.get(t) ?? 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / avgLen)));
      }
      return { chunk: chunks[i]!, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
