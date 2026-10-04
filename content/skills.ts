/**
 * Skill map. Each skill belongs to one group; `related` draws links between skills
 * that you use together. `level` is 1-3 (familiar, proficient, daily driver).
 */
export type SkillGroupId =
  "ingestion" | "storage" | "compute" | "ops" | "security" | "viz" | "ai" | "lang";

export type SkillGroup = { id: SkillGroupId; label: string; blurb: string };

export type Skill = {
  name: string;
  group: SkillGroupId;
  level: 1 | 2 | 3;
  related?: string[];
};

export const skillGroups: SkillGroup[] = [
  { id: "ingestion", label: "Ingestion", blurb: "Getting data out of source systems reliably." },
  { id: "storage", label: "Storage", blurb: "Where data lands and how it is modelled." },
  { id: "compute", label: "Compute & Query", blurb: "Transforming and querying at scale." },
  {
    id: "ops",
    label: "Infra, Ops & Observability",
    blurb: "Packaging, scheduling, running and watching it all.",
  },
  {
    id: "security",
    label: "Security & Identity",
    blurb: "Who gets in, and what stays secret.",
  },
  { id: "viz", label: "Visualization", blurb: "Putting trusted numbers in front of people." },
  { id: "ai", label: "AI & ML", blurb: "Models and agents on top of the data." },
  { id: "lang", label: "Languages & Tools", blurb: "The everyday toolkit." },
];

export const skills: Skill[] = [
  {
    name: "Apache NiFi",
    group: "ingestion",
    level: 3,
    related: ["SAP OData", "PostgreSQL", "Docker"],
  },
  { name: "SAP OData", group: "ingestion", level: 2, related: ["Apache NiFi"] },
  { name: "REST APIs", group: "ingestion", level: 2, related: ["Flask", "Python"] },

  {
    name: "PostgreSQL",
    group: "storage",
    level: 3,
    related: ["Apache Superset", "SQL", "pgAgent", "pgAdmin"],
  },
  { name: "pgAdmin", group: "storage", level: 3, related: ["PostgreSQL"] },
  { name: "MinIO", group: "storage", level: 1, related: ["Apache Iceberg"] },
  { name: "Apache Iceberg", group: "storage", level: 1, related: ["Trino", "SeaweedFS"] },
  { name: "SeaweedFS", group: "storage", level: 1, related: ["Apache Iceberg"] },
  { name: "MongoDB", group: "storage", level: 2, related: ["Flask"] },

  { name: "Apache Spark", group: "compute", level: 1, related: ["Apache Iceberg", "Python"] },
  { name: "Trino", group: "compute", level: 1, related: ["Apache Iceberg", "Apache Superset"] },
  { name: "SQL", group: "compute", level: 3, related: ["PostgreSQL"] },

  {
    name: "Docker",
    group: "ops",
    level: 3,
    related: ["Docker Compose", "Apache NiFi", "Apache Superset", "pgAgent"],
  },
  { name: "Docker Compose", group: "ops", level: 3, related: ["Docker", "Apache Superset"] },
  { name: "pgAgent", group: "ops", level: 3, related: ["PostgreSQL", "Docker"] },
  { name: "Nginx", group: "ops", level: 3, related: ["TLS / SSL", "Linux & systemd"] },
  { name: "Linux & systemd", group: "ops", level: 2, related: ["Prometheus", "Nginx"] },
  { name: "Prometheus", group: "ops", level: 2, related: ["Grafana", "Linux & systemd"] },
  { name: "Grafana", group: "ops", level: 2, related: ["Prometheus"] },
  { name: "Apache Airflow", group: "ops", level: 1, related: ["Apache Spark", "Python"] },
  { name: "Git & GitHub", group: "ops", level: 3 },

  {
    name: "Azure AD (OIDC)",
    group: "security",
    level: 2,
    related: ["OAuth 2.0", "Apache Superset"],
  },
  { name: "OAuth 2.0", group: "security", level: 2, related: ["Azure AD (OIDC)"] },
  { name: "TLS / SSL", group: "security", level: 3, related: ["Nginx"] },
  { name: "Secrets encryption", group: "security", level: 2, related: ["Docker Compose"] },
  {
    name: "Role-based access",
    group: "security",
    level: 2,
    related: ["Apache Superset", "Azure AD (OIDC)"],
  },

  {
    name: "Apache Superset",
    group: "viz",
    level: 3,
    related: ["PostgreSQL", "Azure AD (OIDC)", "LLM agents"],
  },
  { name: "Power BI", group: "viz", level: 2 },
  { name: "Matplotlib", group: "viz", level: 2, related: ["Python"] },

  { name: "LLM agents", group: "ai", level: 2, related: ["MCP servers", "Apache Superset"] },
  { name: "MCP servers", group: "ai", level: 2, related: ["LLM agents", "Python"] },
  { name: "Machine Learning", group: "ai", level: 2, related: ["Python", "CNNs"] },
  { name: "CNNs", group: "ai", level: 2, related: ["Machine Learning"] },

  { name: "Python", group: "lang", level: 3, related: ["Pandas", "NumPy", "Flask"] },
  { name: "Pandas", group: "lang", level: 3, related: ["Python"] },
  { name: "NumPy", group: "lang", level: 3, related: ["Python"] },
  { name: "JavaScript", group: "lang", level: 2, related: ["Next.js", "Node.js"] },
  { name: "Next.js", group: "lang", level: 2, related: ["JavaScript"] },
  { name: "Node.js", group: "lang", level: 2, related: ["JavaScript"] },
  { name: "Flask", group: "lang", level: 2, related: ["Python"] },
  { name: "C/C++", group: "lang", level: 2 },
];
