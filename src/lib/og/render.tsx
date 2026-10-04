import { ImageResponse } from "next/og";
import { site } from "@content/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card used by the home, project and blog OG routes. */
export function renderOg({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0B0D10",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(255,122,61,0.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(61,214,196,0.25), transparent 45%)",
        color: "#ECEAE6",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: "#FF7A3D",
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: title.length > 40 ? 64 : 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 30, color: "#9AA0A8", lineHeight: 1.35 }}>{subtitle}</div>
        ) : null}
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#9AA0A8" }}
      >
        <span>{site.name}</span>
        <span>
          {site.role} · {site.company}
        </span>
      </div>
    </div>,
    ogSize,
  );
}
