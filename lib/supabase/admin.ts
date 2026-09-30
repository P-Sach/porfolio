import "server-only"
import { createClient } from "@supabase/supabase-js"
import { supabaseUrl } from "./config"

/**
 * Service-role client. Bypasses RLS, so it must only be used after
 * requireAdmin() has succeeded. Never import this from client code.
 */
export function createAdminClient() {
  return createClient(supabaseUrl!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
