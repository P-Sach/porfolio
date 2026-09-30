import Link from "next/link"
import { Briefcase, FileText, FolderKanban, Sparkles, User } from "lucide-react"
import { requireAdminPage } from "@/lib/auth"
import { loadSiteContentStrict } from "@/lib/content/store"

export default async function AdminDashboard() {
  await requireAdminPage()
  const content = await loadSiteContentStrict()

  const cards = [
    { href: "/admin/profile", label: "Profile", detail: `${content.profile.expertise.length} expertise cards`, icon: User },
    { href: "/admin/experience", label: "Experience", detail: `${content.experience.length} entries`, icon: Briefcase },
    { href: "/admin/projects", label: "Projects", detail: `${content.projects.length} projects`, icon: FolderKanban },
    { href: "/admin/skills", label: "Skills", detail: `${content.skills.reduce((n, c) => n + c.items.length, 0)} skills in ${content.skills.length} categories`, icon: Sparkles },
    {
      href: "/admin/files",
      label: "Resume & Photo",
      detail: content.assets.resume ? "Custom resume uploaded" : "Using bundled resume",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-muted-foreground">Everything on the public site is edited here. Saving publishes immediately.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, detail, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border-2 border-black bg-white/70 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            <Icon className="mb-3 h-6 w-6" />
            <div className="text-lg font-black">{label}</div>
            <div className="text-sm text-muted-foreground">{detail}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
