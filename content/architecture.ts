/**
 * Nodes for the Architecture Playground: the self-hosted Data Platform (V1), left to right.
 * "security" is shown as a band that wraps every stage.
 */
export type ArchNode = {
  id: string;
  stage: string;
  title: string;
  does: string;
  tech: string[];
  notes?: string;
};

export const architecture: ArchNode[] = [
  {
    id: "ingestion",
    stage: "01",
    title: "Ingestion",
    does: "Pulls data from source systems and automates the processing that used to be done by hand, with retries and back-pressure built into each flow.",
    tech: ["Apache NiFi"],
    notes:
      "There was no reliable documentation for running NiFi in containers. The working setup came from reading error logs and testing configurations systematically.",
  },
  {
    id: "storage",
    stage: "02",
    title: "Storage",
    does: "PostgreSQL holds the platform's data and Superset's metadata (dashboards, charts, users), managed through pgAdmin.",
    tech: ["PostgreSQL", "pgAdmin"],
    notes: "Evaluated for later versions: Apache Iceberg and MinIO.",
  },
  {
    id: "compute",
    stage: "03",
    title: "Transformation",
    does: "Cleans, joins and reshapes data between ingestion and reporting, inside NiFi flows and PostgreSQL.",
    tech: ["Apache NiFi", "SQL"],
    notes: "Apache Spark was evaluated for heavier workloads.",
  },
  {
    id: "orchestration",
    stage: "04",
    title: "Scheduling",
    does: "Runs pipeline jobs on a schedule across multiple databases.",
    tech: ["pgAgent (custom Docker image)"],
    notes:
      "pg_cron only works on one database per cluster, so I containerised pgAgent myself, since no official image existed.",
  },
  {
    id: "visualization",
    stage: "05",
    title: "Visualization",
    does: "Self-serve dashboards for each business, running as a multi-service setup with Redis and Celery workers.",
    tech: ["Apache Superset", "Redis"],
  },
  {
    id: "observability",
    stage: "06",
    title: "Observability",
    does: "Node Exporter runs as a systemd service on every VM, Prometheus scrapes its metrics, and Grafana shows live system-health dashboards.",
    tech: ["Grafana", "Prometheus", "Node Exporter"],
  },
  {
    id: "security",
    stage: "07",
    title: "Security & Access",
    does: "Nginx terminates TLS and routes each service by its own FQDN. Users sign in with Azure AD, and Docker Compose files are encrypted with a unique key per deployment.",
    tech: ["Nginx", "TLS", "Azure AD (OIDC)", "Encrypted Compose files", "Docker"],
    notes: "This layer wraps every other stage rather than sitting at the end.",
  },
];
