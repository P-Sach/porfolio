import ProjectSelector from "@/components/project-selector"
import SiteShell from "@/components/site-shell"
import { getSiteContent } from "@/lib/content/store"

export const revalidate = 3600

export const metadata = { title: "Projects" }

export default async function ProjectsPage() {
  const { profile, projects } = await getSiteContent()

  return (
    <SiteShell active="projects" socials={profile.socials} showResume={profile.showResume}>
      <section className="py-16 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        <div className="relative z-10">
          <ProjectSelector projects={projects} />
        </div>
      </section>
    </SiteShell>
  )
}
