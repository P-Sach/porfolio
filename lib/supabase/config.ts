export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const ASSET_BUCKET = "site-assets"

/** Public reads + login only need the URL and anon key. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

/** The admin area additionally needs the service-role key and an owner email. */
export function isAdminConfigured(): boolean {
  return (
    isSupabaseConfigured() &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    Boolean(process.env.ADMIN_EMAIL)
  )
}

export function assetPublicUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${ASSET_BUCKET}/${path}`
}
