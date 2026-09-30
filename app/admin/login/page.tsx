import { redirect } from "next/navigation"
import { getAdminUser } from "@/lib/auth"
import { isAdminConfigured, missingAdminConfig } from "@/lib/supabase/config"
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
          <p>Missing or invalid on this deployment:</p>
          <ul className="list-disc pl-5">
            {missingAdminConfig().map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
          <p>
            Add them for the <b>Production</b> environment, then redeploy <b>without the build cache</b> (the{" "}
            <code>NEXT_PUBLIC_</code> values are baked in at build time).
          </p>
        </div>
      )}
    </div>
  )
}
