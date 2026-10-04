import {
  Archive,
  Award,
  Boxes,
  Code2,
  FileLock2,
  GraduationCap,
  KeyRound,
  Layers,
  Map,
  ScanLine,
  Server,
  Settings2,
  Trophy,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Named icons that content files can refer to by string. */
const ICONS: Record<string, LucideIcon> = {
  archive: Archive,
  award: Award,
  boxes: Boxes,
  code: Code2,
  lock: FileLock2,
  education: GraduationCap,
  key: KeyRound,
  layers: Layers,
  map: Map,
  scan: ScanLine,
  server: Server,
  settings: Settings2,
  trophy: Trophy,
  workflow: Workflow,
};

export function ContentIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && ICONS[name]) || Boxes;
  return <Icon className={className} aria-hidden />;
}
