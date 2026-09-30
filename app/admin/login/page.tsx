import { redirect } from "next/navigation"
import { getAdminUser } from "@/lib/auth"
import { isAdminConfigured } from "@/lib/supabase/config"
import LoginForm from "./login-form"

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin")

  const configured = isAdminConfigured()

  return (
    <div className="mx-auto mt-16 max-w-md rounded-3xl border-4 border-black bg-white/70 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] backdrop-blur-xl">
      <h1 className="mb-1 text-3xl font-black">CMS sign in</h1>
      <p className="mb-6 text-sm text-muted-foreground">Owner access only.</p>

      {configured ? (
        <LoginForm />
      ) : (
        <div className="space-y-2 text-sm">
          <p className="font-bold text-red-700">The CMS isn&apos;t configured on this deployment.</p>
          <p>
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> and <code>ADMIN_EMAIL</code>, then redeploy. See the README for the full setup.
          </p>
        </div>
      )}
    </div>
  )
}
