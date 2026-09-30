import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { defaultContent } from "./defaults"
import { CONTENT_KEYS, schemas, type ContentKey, type SiteContent } from "./schema"

export const CONTENT_TABLE = "site_content"
export const CONTENT_CACHE_TAG = "site-content"

async function fetchFromDatabase(): Promise<SiteContent> {
  const merged: SiteContent = structuredClone(defaultContent)
  if (!isSupabaseConfigured()) return merged

  const { data, error } = await createPublicClient().from(CONTENT_TABLE).select("key, data")
  if (error) throw error

  for (const row of data ?? []) {
    const key = row.key as ContentKey
    if (!CONTENT_KEYS.includes(key)) continue
    // Validate on read too: a malformed row falls back to defaults rather
    // than crashing or rendering unvalidated data.
    const parsed = schemas[key].safeParse(row.data)
    if (parsed.success) {
      ;(merged as unknown as Record<ContentKey, unknown>)[key] = parsed.data
    } else {
      console.error(`[content] Ignoring invalid "${key}" row`, parsed.error.flatten())
    }
  }
  return merged
}

/**
 * Uncached read for the admin. Unlike the public readers it throws when the
 * database can't be reached, so a transient outage can never show the editor
 * the seed defaults and tempt an overwrite of real content.
 */
export const loadSiteContentStrict = fetchFromDatabase

/** Uncached read that falls back to defaults instead of throwing. */
export async function loadSiteContent(): Promise<SiteContent> {
  try {
    return await fetchFromDatabase()
  } catch (err) {
    console.error("[content] Falling back to defaults:", err)
    return structuredClone(defaultContent)
  }
}

// Throws on failure so a transient outage isn't cached; the wrapper below
// then serves defaults for this request only.
const cachedFromDatabase = unstable_cache(fetchFromDatabase, ["site-content"], {
  tags: [CONTENT_CACHE_TAG],
  revalidate: 300,
})

/** Cached read for public pages. Invalidated by revalidateTag after admin saves. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await cachedFromDatabase()
  } catch (err) {
    console.error("[content] Falling back to defaults:", err)
    return structuredClone(defaultContent)
  }
}
