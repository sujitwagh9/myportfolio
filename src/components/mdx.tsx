import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
};

/** Renders trusted local MDX from /content. JS expressions are disabled for safety. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-lg prose-neutral dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent prose-strong:text-fg prose-code:font-mono prose-pre:border prose-pre:border-border prose-pre:bg-surface max-w-none">
      <MDXRemote source={source} components={components} options={{ blockJS: true }} />
    </div>
  );
}
