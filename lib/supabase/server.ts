import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { supabaseAnonKey, supabaseUrl } from "./config"

/** Cookie-backed client acting as the signed-in user (server components/actions). */
export async function createSessionClient() {
  const store = await cookies()
  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // Called from a server component: cookies are read-only there.
          // The middleware refreshes the session instead.
        }
      },
    },
  })
}
