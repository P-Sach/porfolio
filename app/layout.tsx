import type { Metadata } from "next"
import "./globals.css"
import { getSiteContent } from "@/lib/content/store"

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteContent()
  return {
    title: { default: `${profile.name} — ${profile.title}`, template: `%s | ${profile.name}` },
    description: profile.tagline,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
