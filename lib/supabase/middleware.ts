import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config"

/**
 * Refreshes the auth session and redirects anonymous visitors away from
 * /admin. This is a convenience layer only: every page, server action and
 * route handler re-checks the session via requireAdmin().
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"

  if (!isSupabaseConfigured()) {
    return isLogin ? response : redirectToLogin(request)
  }

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // getUser() revalidates the token with Supabase; getSession() would not.
  const { data } = await supabase.auth.getUser()

  if (!data.user && !isLogin) return redirectToLogin(request)
  return response
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = "/admin/login"
  url.search = ""
  return NextResponse.redirect(url)
}
