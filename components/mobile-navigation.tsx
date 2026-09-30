import DownloadCvButton from "@/components/download-cv-button"
import { NavLinks, SocialLinks, type NavId } from "@/components/site-links"
import type { Profile } from "@/lib/content/schema"

interface MobileNavigationProps {
  active: NavId
  socials: Profile["socials"]
  showResume: boolean
}

export default function MobileNavigation({ active, socials, showResume }: MobileNavigationProps) {
  return (
    <div className="h-full bg-white/40 backdrop-blur-md flex flex-col">
      <div className="p-6 border-b-4 border-black">
        <h2 className="text-2xl font-black">PORTFOLIO</h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-2 mb-8">
          <NavLinks active={active} />
        </nav>

        <div>
          <h2 className="text-xl font-black mb-4">CONNECT</h2>
          <SocialLinks socials={socials} />
        </div>
      </div>

      {showResume && (
        <div className="p-4 border-t-4 border-black mt-auto">
          <DownloadCvButton className="w-full text-center block" />
        </div>
      )}
    </div>
  )
}
