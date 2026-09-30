import FilesPanel from "@/components/admin/files-panel"
import { requireAdminPage } from "@/lib/auth"
import { loadSiteContentStrict } from "@/lib/content/store"
import { assetPublicUrl } from "@/lib/supabase/config"

export default async function FilesAdminPage() {
  await requireAdminPage()
  const { assets } = await loadSiteContentStrict()
  return <FilesPanel assets={assets} photoUrl={assets.photo ? assetPublicUrl(assets.photo.path) : null} />
}
