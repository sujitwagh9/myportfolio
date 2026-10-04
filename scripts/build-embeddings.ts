/**
 * Prebuild step: chunks all portfolio content and, when GEMINI_API_KEY is set, embeds it.
 * Writes src/data/embeddings.json. Never fails the build: without a key (or on API error)
 * it writes the chunks with `vector: null`, and the site uses keyword search instead.
 */
import fs from "node:fs";
import path from "node:path";
import { buildCorpus } from "../src/lib/corpus";
import { embed, EMBEDDING_MODEL } from "../src/lib/ai/embeddings";

async function main() {
  const chunks = buildCorpus();
  const out = path.join(process.cwd(), "src", "data", "embeddings.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });

  let vectors: (number[] | null)[] = chunks.map(() => null);
  let model = "none";

  if (process.env.GEMINI_API_KEY) {
    try {
      const texts = chunks.map((c) => `${c.title}\n${c.text}`);
      const batched: number[][] = [];
      for (let i = 0; i < texts.length; i += 50) {
        batched.push(...(await embed(texts.slice(i, i + 50), "document")));
      }
      vectors = batched;
      model = EMBEDDING_MODEL;
      console.log(`[embeddings] embedded ${chunks.length} chunks with ${EMBEDDING_MODEL}`);
    } catch (err) {
      console.warn(
        `[embeddings] embedding failed, using keyword search: ${(err as Error).message}`,
      );
    }
  } else {
    console.log(
      `[embeddings] GEMINI_API_KEY not set: wrote ${chunks.length} chunks for keyword search`,
    );
  }

  const index = {
    model,
    createdAt: new Date().toISOString(),
    chunks: chunks.map((c, i) => ({ ...c, vector: vectors[i] ?? null })),
  };
  fs.writeFileSync(out, JSON.stringify(index));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
