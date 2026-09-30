import SiteShell from "@/components/site-shell"
import SkillCategory from "@/components/skill-category"
import { getSiteContent } from "@/lib/content/store"

export const revalidate = 3600

export const metadata = { title: "Skills" }

export default async function SkillsPage() {
  const { profile, skills } = await getSiteContent()

  return (
    <SiteShell active="skills" socials={profile.socials} showResume={profile.showResume}>
      <div className="space-y-12">
        {skills.map((category, i) => (
          <SkillCategory key={`${category.title}-${i}`} title={category.title} items={category.items} />
        ))}
      </div>
    </SiteShell>
  )
}
