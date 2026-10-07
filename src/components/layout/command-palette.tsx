"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { ArrowRight, FileText, FolderGit2, Hash, Moon, Search, Sparkles, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { sections } from "./nav";
import { useUI } from "./ui-provider";

type Item = { slug: string; title: string };
type SearchResult = { href: string; title: string; kind: "project" | "post"; score: number };

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-[var(--radius-input)] px-3 py-2.5 text-sm text-fg aria-selected:bg-surface-2 aria-selected:text-accent [&_svg]:size-4 [&_svg]:text-muted";

export function CommandPalette({ projects }: { projects: Item[] }) {
  const router = useRouter();
  const { paletteOpen, setPaletteOpen, askAI } = useUI();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [mode, setMode] = useState<"semantic" | "keyword" | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  // Debounced semantic search over projects and notes.
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setMode(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          mode: "semantic" | "keyword";
          results: SearchResult[];
        };
        setResults(data.results.slice(0, 5));
        setMode(data.mode);
      } catch {
        /* aborted or offline: keep static items */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  function go(href: string) {
    setPaletteOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <Dialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <DialogContent>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to a section, open a project, switch theme or ask the AI assistant.
        </DialogDescription>
        <Command label="Command palette" shouldFilter={true} loop>
          <div className="border-border flex items-center gap-3 border-b px-4">
            <Search className="text-muted size-4" aria-hidden />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search projects, sections, or ask a question…"
              className="text-fg placeholder:text-muted h-14 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="text-muted px-3 py-6 text-center text-sm">
              No matches. Press the AI option to ask instead.
            </Command.Empty>

            {query.trim().length > 2 ? (
              <Command.Group heading="Ask AI" className="cmdk-group">
                <Command.Item
                  value={`ask ${query}`}
                  keywords={[query]}
                  onSelect={() => {
                    const q = query;
                    setQuery("");
                    askAI(q);
                  }}
                  className={itemClass}
                >
                  <Sparkles /> Ask my AI: “{query}”
                </Command.Item>
              </Command.Group>
            ) : null}

            {results.length > 0 ? (
              <Command.Group
                heading={mode === "semantic" ? "Semantic matches" : "Keyword matches"}
                className="cmdk-group"
              >
                {results.map((r) => (
                  <Command.Item
                    key={r.href}
                    value={`result ${r.title}`}
                    keywords={[query]}
                    onSelect={() => go(r.href)}
                    className={itemClass}
                  >
                    {r.kind === "project" ? <FolderGit2 /> : <FileText />}
                    <span className="flex-1 truncate">{r.title}</span>
                    <ArrowRight />
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}

            <Command.Group heading="Sections" className="cmdk-group">
              {sections.map((s) => (
                <Command.Item
                  key={s.id}
                  value={`section ${s.label}`}
                  onSelect={() => go(`/#${s.id}`)}
                  className={itemClass}
                >
                  <Hash /> {s.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Projects" className="cmdk-group">
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`project ${p.title}`}
                  onSelect={() => go(`/projects/${p.slug}`)}
                  className={itemClass}
                >
                  <FolderGit2 /> {p.title}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions" className="cmdk-group">
              <Command.Item
                value="action ask ai chat"
                onSelect={() => askAI()}
                className={itemClass}
              >
                <Sparkles /> Open AI chat
              </Command.Item>
              <Command.Item
                value="action toggle theme dark light"
                onSelect={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                  setPaletteOpen(false);
                }}
                className={itemClass}
              >
                {resolvedTheme === "dark" ? <Sun /> : <Moon />} Toggle theme
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
