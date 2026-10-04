import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@content/site";
import { ChatLauncher } from "@/components/ai/chat-launcher";
import { ChatPanel } from "@/components/ai/chat-panel";
import { Analytics } from "@/components/layout/analytics";
import { CommandPalette } from "@/components/layout/command-palette";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { getProjects } from "@/lib/content";
import { personJsonLd } from "@/lib/seo";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
  description: site.positioning,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.socials.linkedin }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.positioning,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.positioning,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4f0" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const projects = getProjects().map((p) => ({ slug: p.slug, title: p.title }));
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="mesh-bg grain min-h-screen">
        <script
          type="application/ld+json"
          // JSON-LD built from local content only.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Providers>
          <SmoothScroll />
          <SiteHeader />
          <main id="main">{children}</main>
          <Footer />
          <CommandPalette projects={projects} />
          <ChatPanel />
          <ChatLauncher />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
