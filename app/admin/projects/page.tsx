import ProjectsEditor from "@/components/admin/projects-editor"
import { requireAdminPage } from "@/lib/auth"
import { loadSiteContentStrict } from "@/lib/content/store"

export default async function ProjectsAdminPage() {
  await requireAdminPage()
  const { projects } = await loadSiteContentStrict()
  return <ProjectsEditor initial={projects} />
}
