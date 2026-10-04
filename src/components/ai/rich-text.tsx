import { Fragment } from "react";
import type { ChatSource } from "@/lib/ai/schemas";

/**
 * Minimal, safe renderer for model output: paragraphs, "-" bullets, **bold** and [S#]
 * citations. Never uses dangerouslySetInnerHTML.
 */
export function RichText({ text, sources }: { text: string; sources: ChatSource[] }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        if (lines.length > 0 && lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.replace(/^\s*[-*•]\s+/, "")} sources={sources} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                <Inline text={l} sources={sources} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function Inline({ text, sources }: { text: string; sources: ChatSource[] }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[S\d+(?:,\s*S\d+)*\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
        const cite = part.match(/^\[(S\d+(?:,\s*S\d+)*)\]$/);
        if (cite) {
          return cite[1]!.split(/,\s*/).map((id) => {
            const src = sources.find((s) => s.id === id);
            if (!src) return null;
            return (
              <a
                key={`${i}-${id}`}
                href={src.href}
                title={src.title}
                className="border-accent-2/40 text-accent-2 hover:bg-accent-2/10 mx-0.5 inline-flex -translate-y-px items-center rounded border px-1 font-mono text-[10px] no-underline"
              >
                {src.section}
              </a>
            );
          });
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
