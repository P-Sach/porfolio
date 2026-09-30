"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/admin/actions"

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/files", label: "Resume & Photo" },
]

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <header className="border-b-4 border-black bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 p-4">
        <span className="text-xl font-black">CMS</span>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-1.5 text-sm font-bold ${active ? "bg-black text-white" : "hover:bg-black/10"}`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-bold hover:underline">
            View site <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm" className="border-2 border-black font-bold">
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
