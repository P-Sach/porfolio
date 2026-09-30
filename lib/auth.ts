import { redirect } from "next/navigation"
import { isAdminConfigured } from "@/lib/supabase/config"
import { createSessionClient } from "@/lib/supabase/server"

/**
 * Returns the signed-in user only if they are the site owner: a confirmed
 * account whose email matches ADMIN_EMAIL. Anyone else who somehow holds a
 * Supabase session (e.g. signups left enabled) gets null.
 */
export async function getAdminUser() {
  if (!isAdminConfigured()) return null
  const supabase = await createSessionClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user?.email || !user.email_confirmed_at) return null
  if (user.email.toLowerCase() !== process.env.ADMIN_EMAIL!.trim().toLowerCase()) return null
  return user
}

/** For admin pages: send anyone who isn't the owner to the login screen. */
export async function requireAdminPage() {
  const user = await getAdminUser()
  if (!user) redirect("/admin/login")
  return user
}

/** Call first in every server action and route handler that mutates data. */
export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) throw new Error("Unauthorized")
  return user
}
