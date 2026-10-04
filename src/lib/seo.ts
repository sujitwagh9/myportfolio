import { site } from "../../content/site";
import { absoluteUrl } from "./utils";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    worksFor: { "@type": "Organization", name: site.company },
    alumniOf: { "@type": "CollegeOrUniversity", name: site.education.institution },
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
    email: `mailto:${site.email}`,
    url: absoluteUrl("/"),
    sameAs: Object.values(site.socials).filter((u) => !u.includes("PLACEHOLDER")),
    knowsAbout: [
      "Data Engineering",
      "Apache NiFi",
      "Apache Superset",
      "PostgreSQL",
      "Docker",
      "LLM agents",
    ],
  };
}
