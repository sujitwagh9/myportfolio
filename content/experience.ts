/**
 * Experience timeline, newest first. Internship details come from the internship report;
 * anything still marked [PLACEHOLDER: ...] needs your input. Never add a metric you cannot back up.
 */
export type ExperienceEntity = {
  code: string;
  name: string;
  bullets: string[];
};

export type Experience = {
  company: string;
  role: string;
  team?: string;
  period: string;
  current?: boolean;
  location: string;
  summary: string;
  /** Impact numbers shown on the card; bullets are only shown on "Show details". */
  highlights: { value: string; label: string }[];
  bullets: string[];
  stack: string[];
  entities?: ExperienceEntity[];
};

const DEPLOYED =
  "Deployed the Data Platform end to end (environment setup, service configuration, SSL, reverse proxy, go-live validation) and maintain it.";

export const experience: Experience[] = [
  {
    company: "Kalyani Group",
    role: "Data & AI Engineer",
    team: "Data Team",
    period: "July 2026 – Present",
    current: true,
    location: "Pune, India",
    highlights: [
      { value: "5", label: "live deployments owned" },
      { value: "SSO", label: "Azure AD rollout" },
    ],
    summary:
      "Joined full time after the internship. I own the Data Platform I built as an intern, from new deployments to day-to-day operations.",
    bullets: [
      "Own all live Data Platform deployments across the group: health monitoring through Grafana and Prometheus, infrastructure and application issues, and uptime.",
      "Rolling out new client deployments across the Kalyani Group ecosystem.",
      "Extending Azure AD single sign-on from Apache Superset to the rest of the platform's services.",
      "Building new platform features based on feedback from existing deployments.",
      "Working on the Prompt to Dashboard project for the Internal Team",
    ],
    stack: [
      "Apache NiFi",
      "Apache Superset",
      "PostgreSQL",
      "Docker",
      "Nginx",
      "Azure AD",
      "Grafana",
      "Prometheus",
    ],
  },
  {
    company: "Kalyani Group",
    role: "AI/ML Intern",
    team: "Data Platform Team",
    period: "Jul 2025 – July 2026",
    location: "Pune, India",
    highlights: [
      { value: "0 → 1", label: "platform built" },
      { value: "5", label: "production deployments" },
      { value: "1.4 TB → 18 GB", label: "IoT data archived" },
      { value: "7", label: "open-source tools" },
    ],
    summary:
      "Took end-to-end ownership of building the group's on-premise Data Platform, from research and development to live production deployments.",
    bullets: [
      "Researched open-source tools (Apache Superset, Apache NiFi, PostgreSQL, Apache Spark, Apache Iceberg, MinIO, pgAdmin, Grafana, Prometheus) and scoped Data Platform V1 around seven of them, covering ingestion, transformation, visualization and observability.",
      "Built Version 1 of the platform and deployed it to five production environments (BFAL US, Saarloha, KSSL, BFL and the IoT team), plus internal VMs for development and testing. The platform was well received by stakeholders.",
      "Compressed nearly 1.4 TB of IoT production data to 18 GB for archival when the IoT team was running out of storage, stabilising their production environment.",
      "Built a custom Docker image for pgAgent, which had no official image, to automate data pipeline jobs across multiple databases after finding pgCron limited to a single database.",
      "Integrated Azure AD sign-on (OAuth 2.0 / OpenID Connect) into Apache Superset, including mapping Azure AD users to Superset roles.",
      "Co-designed a Config Manager that generates each deployment's configuration from a few inputs (company, SSL certificates, services, authentication), reducing manual errors and speeding up deployments.",
      "Encrypted Docker Compose files with a unique key per deployment, so credentials stay protected even with VM access, and kept the key out of shell history and process lists.",
      "Set up Nginx as an SSL-terminating reverse proxy with per-service FQDNs, and coordinated DNS and network access with the networking team.",
    ],
    stack: [
      "Apache NiFi",
      "Apache Superset",
      "PostgreSQL",
      "pgAgent",
      "pgAdmin",
      "Docker",
      "Nginx",
      "Grafana",
      "Prometheus",
      "Azure AD",
      "Linux",
    ],
    entities: [
      {
        code: "BFAL US",
        name: "Bharat Forge Aluminum USA, Inc",
        bullets: [DEPLOYED],
      },
      {
        code: "Saarloha",
        name: "Saarloha Advanced Materials",
        bullets: [DEPLOYED],
      },
      {
        code: "KSSL",
        name: "Kalyani Strategic Systems",
        bullets: [DEPLOYED],
      },
      {
        code: "BFL",
        name: "Bharat Forge Limited",
        bullets: [DEPLOYED],
      },
      {
        code: "IoT",
        name: "IoT Internal Team",
        bullets: [
          "Deployed the platform on the IoT production server with system and application monitoring, and archived ~1.4 TB of production data into 18 GB.",
        ],
      },
    ],
  },
];
