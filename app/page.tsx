import HomeClient from "@/components/home-client"
import { buildSearchIndex } from "@/lib/content/search"
import { getSiteContent } from "@/lib/content/store"
import { assetPublicUrl } from "@/lib/supabase/config"

export const revalidate = 3600

export default async function HomePage() {
  const content = await getSiteContent()
  const photo = content.assets.photo

  return (
    <HomeClient
      profile={content.profile}
      photoUrl={photo ? assetPublicUrl(photo.path) : null}
      searchIndex={buildSearchIndex(content)}
    />
  )
}
