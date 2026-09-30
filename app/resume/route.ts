import { NextResponse } from "next/server"
import { getSiteContent } from "@/lib/content/store"
import { assetPublicUrl, isSupabaseConfigured } from "@/lib/supabase/config"

// Stable public URL for the CV. Every "Download CV" button points here, so the
// file behind it can be replaced from the CMS without touching any page.
export const dynamic = "force-dynamic"

const BUNDLED_FALLBACK = "/ParthSachdeva_CV_22.pdf"

export async function GET(request: Request) {
  const { assets } = await getSiteContent()

  if (assets.resume && isSupabaseConfigured()) {
    try {
      const upstream = await fetch(assetPublicUrl(assets.resume.path), { cache: "no-store" })
      if (upstream.ok && upstream.body) {
        const name = (assets.resume.downloadName ?? "Resume.pdf").replace(/[^A-Za-z0-9 _.()-]/g, "")
        return new NextResponse(upstream.body, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${name}"`,
            "Cache-Control": "public, max-age=60",
          },
        })
      }
    } catch {
      // fall through to the bundled copy
    }
  }

  return NextResponse.redirect(new URL(BUNDLED_FALLBACK, request.url))
}
