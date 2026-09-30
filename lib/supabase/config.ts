export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const ASSET_BUCKET = "site-assets"

/** Public reads + login only need the URL and anon key. */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false
  try {
    // A malformed URL (missing https://, stray quotes) makes the client
    // constructor throw, so treat it as "not configured" instead.
    const { protocol } = new URL(supabaseUrl)
    return protocol === "https:" || protocol === "http:"
  } catch {
    return false
  }
}

/** Names (never values) of the env vars that are missing or invalid. */
export function missingAdminConfig(): string[] {
  const missing: string[] = []
  let urlOk = false
  try {
    urlOk = Boolean(supabaseUrl) && ["https:", "http:"].includes(new URL(supabaseUrl!).protocol)
  } catch {}
  if (!urlOk) missing.push(supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL (set, but not a valid https:// URL)" : "NEXT_PUBLIC_SUPABASE_URL")
  if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY")
  if (!process.env.ADMIN_EMAIL) missing.push("ADMIN_EMAIL")
  return missing
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
