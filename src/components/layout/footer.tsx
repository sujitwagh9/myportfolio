import { site } from "@content/site";

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js and Gemini.
        </p>
        <p className="font-mono text-xs">
          Press <kbd className="border-border rounded border px-1.5 py-0.5">Ctrl</kbd> +{" "}
          <kbd className="border-border rounded border px-1.5 py-0.5">K</kbd> to navigate
        </p>
      </div>
    </footer>
  );
}
