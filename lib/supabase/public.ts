import { createClient } from "@supabase/supabase-js"
import { supabaseAnonKey, supabaseUrl } from "./config"

/** Stateless anon client for public, cacheable reads (no cookies involved). */
export function createPublicClient() {
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
