import {
  Globe,
  Smartphone,
  Cloud,
  Workflow,
  Code2,
  Atom,
  Palette,
  Server,
  Terminal,
  TerminalSquare,
  Database,
  Zap,
  MonitorSmartphone,
  Container,
  GitBranch,
  Boxes,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated Lucide icon map. Skills store an icon *name*; if it matches one of
 * these it renders the vector icon, otherwise callers fall back to an image or
 * a monogram. Keeping an explicit map keeps the bundle small.
 */
const map: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Cloud,
  Workflow,
  Code2,
  Atom,
  Palette,
  Server,
  Terminal,
  TerminalSquare,
  Database,
  Zap,
  MonitorSmartphone,
  Container,
  GitBranch,
  Boxes,
};

export function hasIcon(name?: string | null): boolean {
  return !!name && name in map;
}

export function Icon({
  name,
  className,
  fallback = "Boxes",
}: {
  name?: string | null;
  className?: string;
  fallback?: keyof typeof map;
}) {
  const Cmp = (name && map[name]) || map[fallback];
  return <Cmp className={className} aria-hidden="true" />;
}
