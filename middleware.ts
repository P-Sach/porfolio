import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export function middleware(request: NextRequest) {
  return updateSession(request)
}

// Only the admin area goes through auth; public pages stay fully static/ISR.
export const config = {
  matcher: ["/admin/:path*"],
}
