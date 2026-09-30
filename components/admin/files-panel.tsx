"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileText, Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteAsset, uploadAsset, type ActionResult } from "@/app/admin/actions"
import type { Assets } from "@/lib/content/schema"

interface FilesPanelProps {
  assets: Assets
  photoUrl: string | null
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString()
}

function AssetCard({
  kind,
  title,
  icon,
  accept,
  maxMb,
  current,
  fallbackNote,
  children,
  extraField,
}: {
  kind: "resume" | "photo"
  title: string
  icon: React.ReactNode
  accept: string
  maxMb: number
  current: Assets["resume"]
  fallbackNote: string
  children?: React.ReactNode
  extraField?: { name: string; label: string; defaultValue: string }
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  const run = (action: () => Promise<ActionResult>, after?: () => void) =>
    startTransition(async () => {
      try {
        const result = await action()
        setStatus(result)
        if (result.ok) {
          after?.()
          router.refresh()
        }
      } catch {
        setStatus({ ok: false, error: "Upload failed. The file may be too large or the connection dropped." })
      }
    })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const file = data.get("file")
    if (!(file instanceof File) || file.size === 0) {
      setStatus({ ok: false, error: "Choose a file first." })
      return
    }
    if (file.size > maxMb * 1024 * 1024) {
      setStatus({ ok: false, error: `That file is larger than ${maxMb} MB.` })
      return
    }
    run(() => uploadAsset(kind, data), () => formRef.current?.reset())
  }

  const onDelete = () => {
    if (window.confirm(`Delete the uploaded ${kind}? ${fallbackNote}`)) run(() => deleteAsset(kind))
  }

  return (
    <section className="space-y-4 rounded-xl border-2 border-black bg-white/70 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="flex items-center gap-2 text-xl font-black">
        {icon} {title}
      </h2>

      <div className="rounded-lg border-2 border-dashed border-black/40 p-3 text-sm">
        {current ? (
          <>
            <p className="font-bold">Uploaded file is live</p>
            <p className="text-muted-foreground">Updated {formatDate(current.updatedAt)}</p>
          </>
        ) : (
          <p className="text-muted-foreground">No upload yet. {fallbackNote}</p>
        )}
        {children}
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${kind}-file`} className="font-bold">
            {current ? "Replace with a new file" : "Upload a file"}
          </Label>
          <Input id={`${kind}-file`} name="file" type="file" accept={accept} className="border-2 border-black" />
          <p className="text-xs text-muted-foreground">Max {maxMb} MB.</p>
        </div>
        {extraField && (
          <div className="space-y-1.5">
            <Label htmlFor={extraField.name} className="font-bold">
              {extraField.label}
            </Label>
            <Input id={extraField.name} name={extraField.name} defaultValue={extraField.defaultValue} maxLength={80} className="border-2 border-black" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending} className="border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {current ? "Replace" : "Upload"}
          </Button>
          {current && (
            <Button type="button" variant="outline" disabled={pending} onClick={onDelete} className="border-2 border-black font-bold text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete uploaded file
            </Button>
          )}
          {status && (
            <span role="status" className={`text-sm font-medium ${status.ok ? "text-green-700" : "text-red-700"}`}>
              {status.ok ? status.message : status.error}
            </span>
          )}
        </div>
      </form>
    </section>
  )
}

export default function FilesPanel({ assets, photoUrl }: FilesPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Resume &amp; Photo</h1>
        <p className="text-muted-foreground">Changes go live immediately. Every &quot;Download CV&quot; button on the site points at one stable link, so nothing else needs editing.</p>
      </div>

      <AssetCard
        kind="resume"
        title="Resume (PDF)"
        icon={<FileText className="h-5 w-5" />}
        accept="application/pdf,.pdf"
        maxMb={5}
        current={assets.resume}
        fallbackNote="Visitors currently get the copy bundled with the site. To hide the button entirely, turn it off under Profile."
        extraField={{ name: "downloadName", label: "File name visitors see when they download", defaultValue: assets.resume?.downloadName?.replace(/\.pdf$/i, "") ?? "Parth Sachdeva CV" }}
      >
        <a href="/resume" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold underline">
          Open the live /resume link
        </a>
      </AssetCard>

      <AssetCard
        kind="photo"
        title="Profile photo"
        icon={<ImageIcon className="h-5 w-5" />}
        accept="image/png,image/jpeg,image/webp"
        maxMb={3}
        current={assets.photo}
        fallbackNote="The bundled photo is shown. Use a square-ish image; it is cropped into a circle."
      >
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="Current profile" className="mt-3 h-32 w-32 rounded-full border-2 border-black object-cover" />
        )}
      </AssetCard>
    </div>
  )
}
