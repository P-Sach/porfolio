import type { SiteContent } from "./schema"

export interface SearchItem {
  title: string
  category: string
  url: string
  keywords: string[]
}

/** Derived from live content so search can never drift from what's on the site. */
export function buildSearchIndex(content: SiteContent): SearchItem[] {
  const items: SearchItem[] = []
  const seen = new Set<string>()

  for (const group of content.skills) {
    for (const name of group.items) {
      const key = name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      items.push({ title: name, category: "Skills", url: "/skills", keywords: [key, group.title.toLowerCase()] })
    }
  }
  for (const p of content.projects) {
    items.push({ title: p.title, category: "Project", url: "/projects", keywords: p.technologies.map((t) => t.toLowerCase()) })
  }
  for (const e of content.experience) {
    items.push({
      title: `${e.role} — ${e.company}`,
      category: "Experience",
      url: "/experience",
      keywords: [e.company.toLowerCase(), ...e.technologies.map((t) => t.toLowerCase())],
    })
  }
  items.push(
    { title: "Work Experience", category: "Section", url: "/experience", keywords: ["work", "experience", "jobs", "career", "employment"] },
    { title: "Projects", category: "Section", url: "/projects", keywords: ["projects", "portfolio", "development"] },
    { title: "Skills", category: "Section", url: "/skills", keywords: ["skills", "technologies", "tech stack", "expertise"] },
    { title: "About Me", category: "About", url: "/", keywords: ["about", "bio", "information", "location", content.profile.location.toLowerCase()] },
    { title: "Contact", category: "Contact", url: "/", keywords: ["contact", "email", "github", "linkedin", "social"] },
  )
  return items
}

export function searchItems(index: SearchItem[], query: string, limit = 5): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return index
    .filter((i) => i.title.toLowerCase().includes(q) || i.keywords.some((k) => k.includes(q)))
    .slice(0, limit)
}
