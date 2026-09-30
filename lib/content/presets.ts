// Whitelisted presets. The CMS stores keys, never raw class names or icon
// names, so arbitrary strings can't reach className/component lookups.
// Class strings are spelled out in full so Tailwind's scanner picks them up.

export const PROJECT_COLORS = {
  pink: "bg-gradient-to-br from-pink-500 to-purple-500",
  indigo: "bg-gradient-to-br from-indigo-500 to-purple-500",
  green: "bg-gradient-to-br from-green-500 to-teal-500",
  orange: "bg-gradient-to-br from-orange-500 to-red-500",
  blue: "bg-gradient-to-br from-blue-500 to-cyan-500",
  yellow: "bg-gradient-to-br from-yellow-500 to-orange-500",
  slate: "bg-gradient-to-br from-slate-600 to-slate-900",
} as const

export type ProjectColor = keyof typeof PROJECT_COLORS
export const PROJECT_COLOR_KEYS = Object.keys(PROJECT_COLORS) as [ProjectColor, ...ProjectColor[]]

export const PROJECT_ICON_KEYS = [
  "Heart",
  "Share2",
  "MessageSquare",
  "ShoppingCart",
  "Map",
  "Code",
  "Globe",
  "Rocket",
  "Database",
  "Bot",
  "Layers",
  "Briefcase",
  "Star",
  "Zap",
] as const

export type ProjectIconKey = (typeof PROJECT_ICON_KEYS)[number]
