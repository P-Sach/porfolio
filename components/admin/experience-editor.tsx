"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ExperienceItem } from "@/lib/content/schema"
import SectionEditor from "./editor"
import { ItemCard, RowActions, StringListEditor, TagsInput, TextField, move } from "./fields"

const blank: ExperienceItem = { company: "", role: "", duration: "", location: "", description: [], technologies: [] }

export default function ExperienceEditor({ initial }: { initial: ExperienceItem[] }) {
  return (
    <SectionEditor
      sectionKey="experience"
      title="Work experience"
      description="Timeline entries, newest first. Order here is the order on the site."
      initial={initial}
    >
      {(items, set) => {
        const update = (i: number, changes: Partial<ExperienceItem>) =>
          set(items.map((item, idx) => (idx === i ? { ...item, ...changes } : item)))

        return (
          <div className="space-y-4">
            {items.map((item, i) => (
              <ItemCard key={i} title={item.role} subtitle={item.company} defaultOpen={!item.role && !item.company}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Role" value={item.role} onChange={(role) => update(i, { role })} />
                  <TextField label="Company" value={item.company} onChange={(company) => update(i, { company })} />
                  <TextField label="Dates" value={item.duration} onChange={(duration) => update(i, { duration })} hint='Free text, e.g. "Feb 2026 - Current".' />
                  <TextField label="Location" value={item.location} onChange={(location) => update(i, { location })} />
                </div>
                <StringListEditor label="Description bullets" values={item.description} onChange={(description) => update(i, { description })} multiline addLabel="Add bullet" />
                <TagsInput label="Technologies & skills" values={item.technologies} onChange={(technologies) => update(i, { technologies })} />
                <RowActions index={i} count={items.length} onMove={(d) => set(move(items, i, d))} onRemove={() => window.confirm("Remove this entry?") && set(items.filter((_, idx) => idx !== i))} />
              </ItemCard>
            ))}
            {items.length === 0 && <p className="text-muted-foreground">No entries yet.</p>}
            <Button type="button" variant="outline" className="border-2 border-black font-bold" disabled={items.length >= 30} onClick={() => set([blank, ...items])}>
              <Plus className="mr-1 h-4 w-4" /> Add experience
            </Button>
          </div>
        )
      }}
    </SectionEditor>
  )
}
