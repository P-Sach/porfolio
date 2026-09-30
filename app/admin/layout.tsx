import type { Metadata } from "next"
import AdminNav from "@/components/admin/admin-nav"
import { getAdminUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "CMS",
  robots: { index: false, follow: false },
}

// Always render per-request: the admin depends on the visitor's session cookie.
export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {user?.email && <AdminNav email={user.email} />}
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  )
}
