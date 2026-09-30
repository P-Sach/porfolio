import ExperienceEditor from "@/components/admin/experience-editor"
import { requireAdminPage } from "@/lib/auth"
import { loadSiteContentStrict } from "@/lib/content/store"

export default async function ExperienceAdminPage() {
  await requireAdminPage()
  const { experience } = await loadSiteContentStrict()
  return <ExperienceEditor initial={experience} />
}
