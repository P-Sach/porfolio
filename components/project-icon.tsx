import {
  Bot,
  Briefcase,
  Code,
  Database,
  Globe,
  Heart,
  Layers,
  Map,
  MessageSquare,
  Rocket,
  Share2,
  ShoppingCart,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { ProjectIconKey } from "@/lib/content/presets"

// Keys are validated against PROJECT_ICON_KEYS by the content schema, so this
// is a closed lookup, never a dynamic import of an arbitrary icon name.
const ICONS: Record<ProjectIconKey, LucideIcon> = {
  Heart,
  Share2,
  MessageSquare,
  ShoppingCart,
  Map,
  Code,
  Globe,
  Rocket,
  Database,
  Bot,
  Layers,
  Briefcase,
  Star,
  Zap,
}

export default function ProjectIcon({ name, className }: { name: ProjectIconKey; className?: string }) {
  const Icon = ICONS[name] ?? Code
  return <Icon className={className} />
}
