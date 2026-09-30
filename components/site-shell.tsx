"use client"

import type { ReactNode } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import DownloadCvButton from "@/components/download-cv-button"
import MobileNavigation from "@/components/mobile-navigation"
import { NavLinks, SocialLinks, type NavId } from "@/components/site-links"
import type { Profile } from "@/lib/content/schema"

interface SiteShellProps {
  active: NavId
  socials: Profile["socials"]
  showResume: boolean
  /** Extra header controls rendered before the CV button (e.g. search on the home page). */
  headerExtra?: ReactNode
  children: ReactNode
}

// The frame shared by every public page: header, sidebar, mobile sheet.
export default function SiteShell({ active, socials, showResume, headerExtra, children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Portfolio</h1>

            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl border-2 border-black" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r-4 border-black p-0">
                  <MobileNavigation active={active} socials={socials} showResume={showResume} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              {headerExtra}
              {showResume && <DownloadCvButton />}
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-6rem)]">
          <div className="hidden md:block border-r-4 border-black bg-white/40 p-4">
            <nav className="space-y-2">
              <NavLinks active={active} />
            </nav>
            <div className="mt-8">
              <h2 className="text-xl font-black mb-4">CONNECT</h2>
              <SocialLinks socials={socials} />
            </div>
          </div>

          <div className="overflow-auto p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
