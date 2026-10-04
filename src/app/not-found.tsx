import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col items-start justify-center px-5 pt-16">
      <p className="text-accent font-mono text-xs tracking-[0.18em] uppercase">404</p>
      <h1 className="mt-3 text-5xl font-semibold">This page fell out of the pipeline.</h1>
      <Button asChild className="mt-8">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
