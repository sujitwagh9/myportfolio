import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { site } from "@content/site";
import { Section, SectionHeading } from "./section-heading";
import { ContactForm } from "./contact-form";

export function Contact() {
  const links = [
    { href: `mailto:${site.email}`, label: site.email, icon: Mail },
    { href: site.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon },
    ...(site.socials.github.includes("PLACEHOLDER")
      ? []
      : [{ href: site.socials.github, label: "GitHub", icon: GithubIcon }]),
  ];
  return (
    <Section id="contact">
      <SectionHeading index="05" eyebrow="Contact" title="Say hello." />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <ul className="space-y-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass hover:border-accent flex items-center gap-3 rounded-[var(--radius-card)] p-5 transition-colors"
              >
                <l.icon className="text-accent size-5" />
                <span>{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <ContactForm turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      </div>
    </Section>
  );
}
