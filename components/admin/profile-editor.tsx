"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/content/schema"
import SectionEditor from "./editor"
import { ItemCard, RowActions, SwitchField, TextAreaField, TextField, move } from "./fields"

export default function ProfileEditor({ initial }: { initial: Profile }) {
  return (
    <SectionEditor
      sectionKey="profile"
      title="Profile"
      description="The home page: name, typing title, about text, expertise cards, social links and the CV button."
      initial={initial}
    >
      {(p, set) => {
        const patch = (changes: Partial<Profile>) => set({ ...p, ...changes })
        const setExpertise = (expertise: Profile["expertise"]) => patch({ expertise })

        return (
          <div className="space-y-8">
            <section className="space-y-4 rounded-xl border-2 border-black bg-white/70 p-4">
              <h2 className="text-xl font-black">Hero</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name" value={p.name} onChange={(name) => patch({ name })} />
                <TextField label="Typing title" value={p.title} onChange={(title) => patch({ title })} hint="Typed out under your name, e.g. Software Developer." />
              </div>
              <TextAreaField label="Tagline" value={p.tagline} onChange={(tagline) => patch({ tagline })} rows={3} />
            </section>

            <section className="space-y-4 rounded-xl border-2 border-black bg-white/70 p-4">
              <h2 className="text-xl font-black">About</h2>
              <TextField label="Location" value={p.location} onChange={(location) => patch({ location })} hint='Shown highlighted: "Based in {location}."' />
              <TextAreaField label="About text" value={p.about} onChange={(about) => patch({ about })} rows={5} />
              <div className="flex flex-wrap items-end gap-6">
                <SwitchField label="Show availability badge" checked={p.available} onChange={(available) => patch({ available })} />
                {p.available && (
                  <div className="min-w-[14rem] flex-1">
                    <TextField label="Badge text" value={p.availableText} onChange={(availableText) => patch({ availableText })} />
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4 rounded-xl border-2 border-black bg-white/70 p-4">
              <h2 className="text-xl font-black">Core expertise cards</h2>
              <div className="space-y-3">
                {p.expertise.map((item, i) => (
                  <ItemCard key={i} title={item.title} defaultOpen={!item.title}>
                    <TextField label="Title" value={item.title} onChange={(title) => setExpertise(p.expertise.map((x, idx) => (idx === i ? { ...x, title } : x)))} />
                    <TextField label="Description" value={item.description} onChange={(description) => setExpertise(p.expertise.map((x, idx) => (idx === i ? { ...x, description } : x)))} />
                    <RowActions index={i} count={p.expertise.length} onMove={(d) => setExpertise(move(p.expertise, i, d))} onRemove={() => setExpertise(p.expertise.filter((_, idx) => idx !== i))} />
                  </ItemCard>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="border-2 border-black font-bold" disabled={p.expertise.length >= 8} onClick={() => setExpertise([...p.expertise, { title: "", description: "" }])}>
                <Plus className="mr-1 h-4 w-4" /> Add card
              </Button>
            </section>

            <section className="space-y-4 rounded-xl border-2 border-black bg-white/70 p-4">
              <h2 className="text-xl font-black">Links &amp; CV</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField label="GitHub URL" value={p.socials.github} onChange={(github) => patch({ socials: { ...p.socials, github } })} />
                <TextField label="LinkedIn URL" value={p.socials.linkedin} onChange={(linkedin) => patch({ socials: { ...p.socials, linkedin } })} />
                <TextField label="Email" type="email" value={p.socials.email} onChange={(email) => patch({ socials: { ...p.socials, email } })} />
              </div>
              <SwitchField label='Show the "Download CV" button' checked={p.showResume} onChange={(showResume) => patch({ showResume })} />
              <p className="text-xs text-muted-foreground">The file itself is managed under Resume &amp; Photo.</p>
            </section>
          </div>
        )
      }}
    </SectionEditor>
  )
}
