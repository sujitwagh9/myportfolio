/**
 * Brand logos for tech names used in content. Names not listed fall back to a
 * monogram, so new skills never break the UI. Icons are imported individually
 * so only these ship to the browser.
 */
import {
  siApacheairflow,
  siCloudinary,
  siExpress,
  siReact,
  siTailwindcss,
  siVite,
  siApachenifi,
  siApachespark,
  siApachesuperset,
  siCplusplus,
  siDocker,
  siFlask,
  siGit,
  siGooglegemini,
  siGrafana,
  siJavascript,
  siJsonwebtokens,
  siJupyter,
  siLetsencrypt,
  siLinux,
  siMinio,
  siModelcontextprotocol,
  siMongodb,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siNumpy,
  siOpenid,
  siPandas,
  siPostgresql,
  siPrometheus,
  siPython,
  siRedis,
  siSap,
  siTensorflow,
  siTrino,
  type SimpleIcon,
} from "simple-icons";

const MAP: Record<string, SimpleIcon> = {
  "apache nifi": siApachenifi,
  nifi: siApachenifi,
  "apache superset": siApachesuperset,
  superset: siApachesuperset,
  postgresql: siPostgresql,
  pgadmin: siPostgresql,
  pgagent: siPostgresql,
  sql: siPostgresql,
  docker: siDocker,
  "docker compose": siDocker,
  nginx: siNginx,
  grafana: siGrafana,
  prometheus: siPrometheus,
  "node exporter": siPrometheus,
  python: siPython,
  "next.js": siNextdotjs,
  react: siReact,
  express: siExpress,
  "tailwind css": siTailwindcss,
  cloudinary: siCloudinary,
  vite: siVite,
  jwt: siJsonwebtokens,
  flask: siFlask,
  mongodb: siMongodb,
  "apache spark": siApachespark,
  "apache airflow": siApacheairflow,
  minio: siMinio,
  redis: siRedis,
  linux: siLinux,
  "linux & systemd": siLinux,
  bash: siLinux,
  "git & github": siGit,
  numpy: siNumpy,
  pandas: siPandas,
  javascript: siJavascript,
  "node.js": siNodedotjs,
  "c/c++": siCplusplus,
  trino: siTrino,
  "sap odata": siSap,
  "azure ad": siOpenid,
  "azure ad (oidc)": siOpenid,
  "openid connect": siOpenid,
  "oauth 2.0": siJsonwebtokens,
  "tls / ssl": siLetsencrypt,
  tls: siLetsencrypt,
  "mcp servers": siModelcontextprotocol,
  "llm agents": siGooglegemini,
  gemini: siGooglegemini,
  "machine learning": siTensorflow,
  cnns: siTensorflow,
  cnn: siTensorflow,
  jupyter: siJupyter,
};

export type TechIconData = { path: string; hex: string; title: string } | null;

export function techIcon(name: string): TechIconData {
  const key = name
    .toLowerCase()
    .replace(/\s*\(custom docker image\)$/, "")
    .trim();
  const icon = MAP[key];
  return icon ? { path: icon.path, hex: icon.hex, title: icon.title } : null;
}

/** Brand colours that are too dark to see on the dark theme render in the text colour instead. */
export function isDarkHex(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b! < 0.06;
}
