"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Result = { href: string; score: number };

/**
 * Semantic search box for the projects grid. Reports the ordered list of matching
 * hrefs (or null when cleared) so the grid can filter and re-rank itself.
 */
export function ProjectSearch({ onResults }: { onResults: (hrefs: string[] | null) => void }) {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"semantic" | "keyword" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      onResults(null);
      setMode(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { mode: "semantic" | "keyword"; results: Result[] };
        setMode(data.mode);
        onResults(data.results.map((r) => r.href));
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, onResults]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full max-w-md">
        <Search
          className="text-muted absolute top-1/2 left-4 size-4 -translate-y-1/2"
          aria-hidden
        />
        <label htmlFor="project-search" className="sr-only">
          Search projects and notes
        </label>
        <input
          id="project-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by meaning, e.g. “moving SAP data”"
          className="border-border bg-glass placeholder:text-muted focus-visible:border-accent-2 h-11 w-full rounded-full border pr-10 pl-11 text-sm outline-none"
        />
        {q ? (
          <button
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="text-muted hover:text-fg absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      {mode ? (
        <Badge tone={mode === "semantic" ? "teal" : "default"}>
          {loading ? "searching…" : mode === "semantic" ? "semantic search" : "keyword mode"}
        </Badge>
      ) : null}
    </div>
  );
}
