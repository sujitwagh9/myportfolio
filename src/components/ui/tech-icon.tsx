import {
  BarChart3,
  CalendarClock,
  Globe,
  HardDrive,
  LineChart,
  Lock,
  Snowflake,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { isDarkHex, techIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

/** Concepts and tools without a brand logo get a generic icon instead of a monogram. */
const FALLBACK: Record<string, LucideIcon> = {
  "rest apis": Globe,
  "secrets encryption": Lock,
  "encrypted compose files": Lock,
  "role-based access": UserCheck,
  "apache iceberg": Snowflake,
  seaweedfs: HardDrive,
  "power bi": BarChart3,
  matplotlib: LineChart,
  "pgagent (custom docker image)": CalendarClock,
};

/** A brand logo for a tech name, or a monogram when no logo exists. Decorative: pair with a label. */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Fallback = FALLBACK[name.toLowerCase()];
  if (Fallback)
    return <Fallback aria-hidden className={cn("text-accent-2 size-5 shrink-0", className)} />;
  const icon = techIcon(name);
  if (!icon) {
    return (
      <span
        aria-hidden
        className={cn(
          "bg-surface-2 text-muted inline-flex size-5 items-center justify-center rounded font-mono text-[9px] font-bold",
          className,
        )}
      >
        {name
          .replace(/[^A-Za-z0-9]/g, "")
          .slice(0, 2)
          .toUpperCase()}
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      fill={isDarkHex(icon.hex) ? "currentColor" : `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  );
}

/** A row of logo chips; names stay visible to screen readers and on hover. */
export function TechRow({
  names,
  max = 8,
  size = "md",
  showLabels = false,
}: {
  names: string[];
  max?: number;
  size?: "sm" | "md";
  showLabels?: boolean;
}) {
  // Icon-only rows: tools sharing a logo (PostgreSQL, pgAdmin, SQL...) collapse into one chip.
  const unique = showLabels
    ? names
    : names.filter(
        (n, i) =>
          !techIcon(n) || names.findIndex((m) => techIcon(m)?.path === techIcon(n)?.path) === i,
      );
  const shown = unique.slice(0, max);
  const extra = unique.length - shown.length;
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Tech stack">
      {shown.map((n) => (
        <li
          key={n}
          title={n}
          className={cn(
            "border-border bg-glass text-fg inline-flex items-center gap-1.5 rounded-full border",
            size === "sm" ? "p-1.5" : "px-2.5 py-1.5",
            showLabels && "pr-3",
          )}
        >
          <TechIcon name={n} className={size === "sm" ? "size-4" : "size-[18px]"} />
          <span className={showLabels ? "font-mono text-[11px]" : "sr-only"}>{n}</span>
        </li>
      ))}
      {extra > 0 ? <li className="text-muted font-mono text-xs">+{extra}</li> : null}
    </ul>
  );
}
