"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectIcon from "@/components/project-icon"
import { PROJECT_COLOR_KEYS, PROJECT_COLORS, PROJECT_ICON_KEYS } from "@/lib/content/presets"
import type { Project } from "@/lib/content/schema"
import SectionEditor from "./editor"
import { ItemCard, RowActions, SelectField, StringListEditor, TagsInput, TextAreaField, TextField, move } from "./fields"

// Optional links are edited as plain strings; blank means "no link" (the
// server schema turns "" into undefined).
type ProjectForm = Omit<Project, "codeLink" | "demoLink" | "learnMoreLink"> & {
  codeLink: string
  demoLink: string
  learnMoreLink: string
}

const toForm = (p: Project): ProjectForm => ({
  ...p,
  codeLink: p.codeLink ?? "",
  demoLink: p.demoLink ?? "",
  learnMoreLink: p.learnMoreLink ?? "",
})

const blank: ProjectForm = {
  title: "",
  description: "",
  color: "indigo",
  icon: "Code",
  technologies: [],
  features: [],
  codeLink: "",
  demoLink: "",
  learnMoreLink: "",
}

export default function ProjectsEditor({ initial }: { initial: Project[] }) {
  return (
    <SectionEditor
      sectionKey="projects"
      title="Projects"
      description="Project cards in the order they appear. Links must be http(s) or mailto; leave blank to hide the button."
      initial={initial.map(toForm)}
    >
      {(items, set) => {
        const update = (i: number, changes: Partial<ProjectForm>) =>
          set(items.map((item, idx) => (idx === i ? { ...item, ...changes } : item)))

        return (
          <div className="space-y-4">
            {items.map((item, i) => (
              <ItemCard key={i} title={item.title} defaultOpen={!item.title}>
                <TextField label="Title" value={item.title} onChange={(title) => update(i, { title })} />
                <TextAreaField label="Description" value={item.description} onChange={(description) => update(i, { description })} rows={3} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Card colour" value={item.color} options={PROJECT_COLOR_KEYS} onChange={(color) => update(i, { color })} />
                  <SelectField label="Icon" value={item.icon} options={PROJECT_ICON_KEYS} onChange={(icon) => update(i, { icon })} />
                </div>
                <div className={`${PROJECT_COLORS[item.color]} flex items-center gap-3 rounded-lg border-2 border-black p-3 text-white`}>
                  <ProjectIcon name={item.icon} className="h-6 w-6" />
                  <span className="font-bold">{item.title || "Preview"}</span>
                </div>
                <TagsInput label="Technologies" values={item.technologies} onChange={(technologies) => update(i, { technologies })} />
                <StringListEditor label="Key features" values={item.features} onChange={(features) => update(i, { features })} multiline addLabel="Add feature" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextField label="Code link" value={item.codeLink} onChange={(codeLink) => update(i, { codeLink })} placeholder="https://github.com/…" />
                  <TextField label="Demo link" value={item.demoLink} onChange={(demoLink) => update(i, { demoLink })} placeholder="https://…" />
                  <TextField label="Learn more link" value={item.learnMoreLink} onChange={(learnMoreLink) => update(i, { learnMoreLink })} placeholder="https://…" />
                </div>
                <RowActions index={i} count={items.length} onMove={(d) => set(move(items, i, d))} onRemove={() => window.confirm("Remove this project?") && set(items.filter((_, idx) => idx !== i))} />
              </ItemCard>
            ))}
            {items.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
            <Button type="button" variant="outline" className="border-2 border-black font-bold" disabled={items.length >= 30} onClick={() => set([blank, ...items])}>
              <Plus className="mr-1 h-4 w-4" /> Add project
            </Button>
          </div>
        )
      }}
    </SectionEditor>
  )
}
