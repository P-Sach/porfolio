import ProfileEditor from "@/components/admin/profile-editor"
import { requireAdminPage } from "@/lib/auth"
import { loadSiteContentStrict } from "@/lib/content/store"

export default async function ProfileAdminPage() {
  await requireAdminPage()
  const { profile } = await loadSiteContentStrict()
  return <ProfileEditor initial={profile} />
}
