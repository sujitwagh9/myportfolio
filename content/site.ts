/**
 * Site-wide identity. Edit this file to change your name, role, links and positioning.
 * Anything wrapped in [PLACEHOLDER: ...] still needs your input.
 */
export const site = {
  name: "Sujit Wagh",
  role: "Data & AI Engineer",
  company: "Kalyani Group",
  location: "Pune, India",
  /** The one line under your name in the hero. Keep it short. */
  positioning: "I build data platforms, and the AI that makes them answer back.",
  shortBio:
    "Data & AI Engineer at the Kalyani Group. I built the group's self-hosted, open-source Data Platform (Apache NiFi, Apache Superset, PostgreSQL, Docker) as an intern, and now run it full time across five production environments.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "sujitwagh1233@gmail.com",
  resumeUrl: "/resume.pdf",
  socials: {
    linkedin: "https://in.linkedin.com/in/sujitwagh9",
    github: "https://github.com/sujitwagh9",
  },
  keywords: [
    "Data Engineer",
    "AI Engineer",
    "Apache NiFi",
    "Apache Superset",
    "PostgreSQL",
    "Docker",
    "Data Platform",
    "Azure AD",
    "Nginx",
    "Grafana",
    "Prometheus",
    "Kalyani Group",
    "Pune",
  ],
  about: {
    /** The About section shows only this. Keep it to two sentences. */
    intro:
      "I'm a data engineer from Pune. I love taking messy data and turning it into something people actually use, and lately, teaching it to answer back in plain English.",
    /** Not shown on the page; the AI assistant uses it to answer questions about you. */
    story: [
      "I'm a Data & AI Engineer on the Data Platform Team at the Kalyani Group in Pune. I joined as an AI/ML intern and now work there full time. I studied Information Technology (B.Tech) at Vishwakarma Institute of Technology, Pune.",
      "As an intern I took the group's Data Platform from research to production: I evaluated the open-source tools, built Version 1 on Apache NiFi, Apache Superset and PostgreSQL in Docker, and deployed it to five production environments (BFAL US, Saarloha, KSSL, BFL and the IoT team). The platform replaced dependency on costly third-party SaaS.",
      "Much of the work was solving problems that had no documentation: running NiFi in containers, building a pgAgent image that didn't exist, adding Azure AD sign-on, and keeping secrets safe on shared VMs.",
      "[PLACEHOLDER: one or two sentences about what got you into data engineering, in your own voice.]",
    ],
    /** Not shown on the page; used by the AI assistant. */
    whatIDo: [
      { text: "Ingestion & transformation pipelines", tech: "Apache NiFi" },
      { text: "Storage & job scheduling", tech: "PostgreSQL" },
      { text: "Self-serve dashboards", tech: "Apache Superset" },
      { text: "Containerised deployments", tech: "Docker" },
      { text: "Monitoring & alerting", tech: "Grafana" },
      { text: "SSO, TLS & secrets", tech: "Azure AD" },
    ],
    /** Not shown on the page; used by the AI assistant. */
    values: [
      "Own the stack: open-source and self-hosted where it makes sense",
      "Reproducibility over heroics: if it is not in a Docker image, it does not exist",
      "Data people can trust, delivered to the people who need it",
    ],
  },
  education: {
    institution: "Vishwakarma Institute of Technology",
    degree: "Bachelor of Technology in Information Technology",
    period: "Nov 2022 – Jun 2026",
    location: "Pune, Maharashtra",
    grade: "CGPA: 8.68",
    coursework: [
      "Data Structures",
      "Operating Systems",
      "Database Management",
      "Object Oriented Programming",
      "Algorithms Analysis",
      "Machine Learning",
      "Artificial Intelligence",
      "Computer Networks",
    ],
  },
  achievements: [
    {
      title: "2nd Runner-Up, Hackron'25 (sponsored by Blinkit)",
      short: "Hackron'25 · 2nd Runner-Up",
      prize: "Rs. 10,000",
      icon: "trophy",
      detail:
        "Built a City-Wide Dark Store Network Projection System; received a cash prize of Rs. 10,000.",
    },
    {
      title: "Winner, Vodafone Idea Tech Marathon",
      short: "Vodafone Idea Tech Marathon · Winner",
      prize: "Rs. 25,000",
      icon: "award",
      detail:
        "Built a global cybersecurity threat analysis dashboard in Power BI in 90 minutes; won Rs. 25,000.",
    },
    {
      title: "Winner, Kalyani Group Hackathon",
      short: "Kalyani Group Hackathon · Winner",
      prize: "Internship opportunity",
      icon: "award",
      detail:
        "Cleared an all-India test and interview run by the Kalyani Group, and was one of the top 7 applicants selected for an internship.",
    },
    {
      title: "Competitive programming",
      short: "LeetCode 1550+ · GfG 3★ · CodeChef 2★",
      prize: "",
      icon: "code",
      detail: "3-Star Coder on GeeksforGeeks, 2-Star on CodeChef, rated 1550+ on LeetCode.",
    },
  ],
  certifications: ["[PLACEHOLDER: add certifications, or delete this entry]"],
  /**
   * Coding profiles shown as cards. GitHub and LeetCode stats are fetched live (refreshed every
   * 6 hours); `fallback` values are shown if those sites can't be reached. GfG and CodeChef have
   * no public API, so their cards show the values written here.
   */
  profiles: {
    github: { username: "sujitwagh9" },
    leetcode: { username: "sujitwagh9", fallback: { solved: 454, rating: 1550 } },
    gfg: { username: "sujitwagh9", badge: "3★ Coder" },
    codechef: { username: "sujitwagh9", badge: "2★" },
  },
  /** Logos shown in the About section, in this order. */
  toolkit: [
    "Python",
    "SQL",
    "Apache NiFi",
    "Apache Superset",
    "PostgreSQL",
    "Docker",
    "Nginx",
    "Grafana",
    "Apache Spark",
    "LLM agents",
    "MCP servers",
    "Linux",
  ],
} as const;

export type Site = typeof site;
