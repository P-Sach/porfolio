"use client"

import { useEffect, useState, useTransition, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Loader2, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { revertSection, saveSection, type ActionResult } from "@/app/admin/actions"

interface SectionEditorProps<T> {
  sectionKey: "profile" | "experience" | "projects" | "skills"
  title: string
  description: string
  initial: T
  children: (value: T, setValue: (next: T) => void) => ReactNode
}

// Shared save / revert / unsaved-changes handling for every content editor.
export default function SectionEditor<T>({ sectionKey, title, description, initial, children }: SectionEditorProps<T>) {
  const router = useRouter()
  const [value, setValue] = useState<T>(initial)
  const [saved, setSaved] = useState(() => JSON.stringify(initial))
  const [status, setStatus] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  // Pick up the server's copy after a save or revert triggers a refresh.
  useEffect(() => {
    setValue(initial)
    setSaved(JSON.stringify(initial))
  }, [initial])

  const dirty = JSON.stringify(value) !== saved

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const run = (action: () => Promise<ActionResult>, onOk?: () => void) =>
    startTransition(async () => {
      try {
        const result = await action()
        setStatus(result)
        if (result.ok) {
          onOk?.()
          router.refresh()
        }
      } catch {
        setStatus({ ok: false, error: "Something went wrong. Check your connection and try again." })
      }
    })

  const onSave = () => run(() => saveSection(sectionKey, value), () => setSaved(JSON.stringify(value)))
  const onRevert = () => {
    if (window.confirm("Restore the version before your last save? Unsaved edits here will be lost.")) {
      run(() => revertSection(sectionKey))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {children(value, setValue)}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t-4 border-black bg-white/90 p-4 backdrop-blur">
        <Button onClick={onSave} disabled={pending || !dirty} className="border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save &amp; publish
        </Button>
        <Button variant="outline" onClick={onRevert} disabled={pending} className="border-2 border-black font-bold">
          <RotateCcw className="mr-2 h-4 w-4" /> Undo last save
        </Button>
        {dirty && !status && <span className="text-sm font-medium text-amber-700">Unsaved changes</span>}
        {status && (
          <span role="status" className={`text-sm font-medium ${status.ok ? "text-green-700" : "text-red-700"}`}>
            {status.ok ? status.message : status.error}
          </span>
        )}
      </div>
    </div>
  )
}
