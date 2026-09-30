import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/content/schema"

export type NavId = "home" | "experience" | "projects" | "skills"

export const NAV_ITEMS: { id: NavId; href: string; label: string }[] = [
  { id: "home", href: "/", label: "Home" },
  { id: "experience", href: "/experience", label: "Work Experience" },
  { id: "projects", href: "/projects", label: "Projects" },
  { id: "skills", href: "/skills", label: "Skills" },
]

export function NavLinks({ active }: { active: NavId }) {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`flex items-center gap-2 text-lg font-bold p-3 rounded-xl ${
            item.id === active ? "bg-black text-white" : "hover:bg-black/10"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}

export function SocialLinks({ socials }: { socials: Profile["socials"] }) {
  const buttonClass = "w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"
  return (
    <div className="space-y-2">
      <a href={socials.github} target="_blank" rel="noopener noreferrer" className="block">
        <Button variant="outline" className={buttonClass}>
          <Github className="h-5 w-5" /> Github
        </Button>
      </a>
      <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="block">
        <Button variant="outline" className={buttonClass}>
          <Linkedin className="h-5 w-5" /> LinkedIn
        </Button>
      </a>
      <a href={`mailto:${socials.email}`} className="block">
        <Button variant="outline" className={buttonClass}>
          <Mail className="h-5 w-5" /> Mail
        </Button>
      </a>
    </div>
  )
}
