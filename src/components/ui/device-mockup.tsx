import Image from "next/image";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A browser window showing a full-page desktop screenshot, with a phone overlapping
 * it. Hovering the card slowly scrolls the desktop capture from top to bottom.
 * Expects a parent with the `group` class.
 */
export function DeviceMockup({
  desktop,
  mobile,
  url,
  title,
  className,
}: {
  desktop?: string;
  mobile?: string;
  url?: string;
  title: string;
  className?: string;
}) {
  const host = url ? new URL(url).host : undefined;
  return (
    <div className={cn("relative pr-[14%] pb-[8%]", className)}>
      {desktop ? (
        <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
          <div className="border-border bg-surface-2 flex items-center gap-2 border-b px-3 py-2">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-[#FF5F57]" />
              <span className="size-2 rounded-full bg-[#FEBC2E]" />
              <span className="size-2 rounded-full bg-[#28C840]" />
            </span>
            {host ? (
              <span className="bg-bg/70 text-muted mx-auto flex min-w-0 items-center gap-1 truncate rounded-md px-2 py-0.5 font-mono text-[10px]">
                <Lock className="size-2.5 shrink-0" /> {host}
              </span>
            ) : null}
          </div>
          {/* Full-page screenshot as a background so hover can scroll it smoothly */}
          <div
            role="img"
            aria-label={`${title}, desktop view`}
            className="page-scroll aspect-[16/10] bg-[length:100%_auto] bg-top bg-no-repeat transition-[background-position] duration-[7000ms] ease-in-out group-hover:bg-bottom motion-reduce:transition-none"
            style={{ backgroundImage: `url(${desktop})` }}
          />
        </div>
      ) : null}

      {mobile ? (
        <div className="absolute right-0 bottom-0 w-[30%] max-w-[180px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-2deg]">
          <div className="rounded-[1.4rem] border-[5px] border-[#111] bg-[#111] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative overflow-hidden rounded-[1rem]">
              <Image
                src={mobile}
                alt={`${title}, mobile view`}
                width={390}
                height={844}
                className="block h-auto w-full"
                sizes="180px"
              />
              <span
                aria-hidden
                className="absolute top-1.5 left-1/2 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-[#111]"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
