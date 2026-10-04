import fs from "node:fs";
import path from "node:path";
import { buildCorpus, type Chunk, type Section } from "../corpus";
import { bm25Search } from "./bm25";
import { cosine, embed, embeddingsEnabled, EMBEDDING_MODEL } from "./embeddings";

type IndexFile = {
  model: string;
  createdAt: string;
  chunks: (Chunk & { vector: number[] | null })[];
};

export type RetrievalMode = "semantic" | "keyword";
export type Hit = { chunk: Chunk; score: number };

let cached: IndexFile | null = null;

function loadIndex(): IndexFile {
  if (cached) return cached;
  const file = path.join(process.cwd(), "src", "data", "embeddings.json");
  try {
    cached = JSON.parse(fs.readFileSync(file, "utf8")) as IndexFile;
  } catch {
    // No index on disk (e.g. `next dev` before a build): use live content, keyword only.
    cached = {
      model: "none",
      createdAt: new Date().toISOString(),
      chunks: buildCorpus().map((c) => ({ ...c, vector: null })),
    };
  }
  return cached;
}

const queryCache = new Map<string, number[]>();

async function queryVector(query: string) {
  const hit = queryCache.get(query);
  if (hit) return hit;
  const [vector] = await embed([query], "query");
  if (!vector) throw new Error("Empty embedding response");
  if (queryCache.size > 500) queryCache.delete(queryCache.keys().next().value as string);
  queryCache.set(query, vector);
  return vector;
}

export async function retrieve(
  query: string,
  opts: { k?: number; sections?: Section[] } = {},
): Promise<{ hits: Hit[]; mode: RetrievalMode }> {
  const k = opts.k ?? 6;
  const index = loadIndex();
  const pool = opts.sections
    ? index.chunks.filter((c) => opts.sections!.includes(c.section))
    : index.chunks;

  const hasVectors =
    embeddingsEnabled() && index.model === EMBEDDING_MODEL && pool.every((c) => c.vector);

  if (hasVectors) {
    try {
      const qv = await queryVector(query);
      const hits = pool
        .map((c) => ({ chunk: stripVector(c), score: cosine(qv, c.vector!) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
      return { hits, mode: "semantic" };
    } catch {
      // Fall through to keyword search; never surface provider errors to visitors.
    }
  }

  return {
    hits: bm25Search(pool.map(stripVector), query, k),
    mode: "keyword",
  };
}

export function allChunks(): Chunk[] {
  return loadIndex().chunks.map(stripVector);
}

function stripVector(c: Chunk & { vector?: number[] | null }): Chunk {
  return { id: c.id, section: c.section, title: c.title, href: c.href, slug: c.slug, text: c.text };
}
