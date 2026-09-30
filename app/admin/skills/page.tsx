import SkillsEditor from "@/components/admin/skills-editor"
import { requireAdminPage } from "@/lib/auth"
import { loadSiteContentStrict } from "@/lib/content/store"

export default async function SkillsAdminPage() {
  await requireAdminPage()
  const { skills } = await loadSiteContentStrict()
  return <SkillsEditor initial={skills} />
}
