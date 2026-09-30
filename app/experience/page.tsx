import SiteShell from "@/components/site-shell"
import SectionHeading from "@/components/ui/section-heading"
import Timeline from "@/components/ui/timeline"
import { getSiteContent } from "@/lib/content/store"

export const revalidate = 3600

export const metadata = { title: "Work Experience" }

export default async function ExperiencePage() {
  const { profile, experience } = await getSiteContent()

  return (
    <SiteShell active="experience" socials={profile.socials} showResume={profile.showResume}>
      <section className="py-16 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="container relative z-10">
          <SectionHeading title="Work Experience" subtitle="My professional journey" />
          <div className="mt-16">
            <Timeline items={experience} />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
