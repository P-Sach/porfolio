"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SkillCategory } from "@/lib/content/schema"
import SectionEditor from "./editor"
import { ItemCard, RowActions, TagsInput, TextField, move } from "./fields"

export default function SkillsEditor({ initial }: { initial: SkillCategory[] }) {
  return (
    <SectionEditor
      sectionKey="skills"
      title="Skills"
      description="Each category becomes a panel of draggable chips on the Skills page. The site search is built from these too."
      initial={initial}
    >
      {(categories, set) => {
        const update = (i: number, changes: Partial<SkillCategory>) =>
          set(categories.map((c, idx) => (idx === i ? { ...c, ...changes } : c)))

        return (
          <div className="space-y-4">
            {categories.map((category, i) => (
              <ItemCard key={i} title={category.title} subtitle={`${category.items.length} items`} defaultOpen={!category.title}>
                <TextField label="Category title" value={category.title} onChange={(title) => update(i, { title })} />
                <TagsInput label="Skills" values={category.items} onChange={(items) => update(i, { items })} />
                <RowActions index={i} count={categories.length} onMove={(d) => set(move(categories, i, d))} onRemove={() => window.confirm("Remove this category?") && set(categories.filter((_, idx) => idx !== i))} />
              </ItemCard>
            ))}
            <Button type="button" variant="outline" className="border-2 border-black font-bold" disabled={categories.length >= 10} onClick={() => set([...categories, { title: "", items: [] }])}>
              <Plus className="mr-1 h-4 w-4" /> Add category
            </Button>
          </div>
        )
      }}
    </SectionEditor>
  )
}
