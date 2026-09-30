"use client"

import { useState, type ReactNode } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-bold">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  placeholder?: string
  type?: string
}

export function TextField({ label, value, onChange, hint, placeholder, type = "text" }: TextFieldProps) {
  return (
    <Field label={label} hint={hint}>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-black"
      />
    </Field>
  )
}

export function TextAreaField({ label, value, onChange, hint, rows = 4 }: Omit<TextFieldProps, "type" | "placeholder"> & { rows?: number }) {
  return (
    <Field label={label} hint={hint}>
      <Textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="border-2 border-black" />
    </Field>
  )
}

export function SwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 font-bold cursor-pointer">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  )
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="flex h-10 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  )
}

/** Move up / move down / remove controls for a list row. */
export function RowActions({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number
  count: number
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  return (
    <div className="flex gap-1">
      <Button type="button" variant="outline" size="icon" className="h-8 w-8 border-2 border-black" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="h-8 w-8 border-2 border-black" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="h-8 w-8 border-2 border-black text-red-600" onClick={onRemove} aria-label="Remove">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

/** Collapsible card for one list entry. Summary stays visible when collapsed. */
export function ItemCard({ title, subtitle, defaultOpen = false, children }: { title: string; subtitle?: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border-2 border-black bg-white/70 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <summary className="cursor-pointer select-none list-none p-4 font-bold flex items-center justify-between gap-4">
        <span>
          {title || <span className="text-muted-foreground">Untitled</span>}
          {subtitle && <span className="ml-2 font-normal text-muted-foreground">{subtitle}</span>}
        </span>
        <span className="text-xs text-muted-foreground group-open:hidden">Edit</span>
        <span className="text-xs text-muted-foreground hidden group-open:inline">Collapse</span>
      </summary>
      <div className="border-t-2 border-black p-4 space-y-4">{children}</div>
    </details>
  )
}

/** Ordered list of free-text rows (bullets, features). */
export function StringListEditor({
  label,
  values,
  onChange,
  multiline = false,
  addLabel = "Add",
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  multiline?: boolean
  addLabel?: string
}) {
  const update = (i: number, v: string) => onChange(values.map((x, idx) => (idx === i ? v : x)))
  return (
    <Field label={label}>
      <div className="space-y-2">
        {values.map((value, i) => (
          <div key={i} className="flex gap-2 items-start">
            {multiline ? (
              <Textarea value={value} rows={2} onChange={(e) => update(i, e.target.value)} className="border-2 border-black" />
            ) : (
              <Input value={value} onChange={(e) => update(i, e.target.value)} className="border-2 border-black" />
            )}
            <RowActions index={i} count={values.length} onMove={(d) => onChange(move(values, i, d))} onRemove={() => onChange(values.filter((_, idx) => idx !== i))} />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="border-2 border-black font-bold" onClick={() => onChange([...values, ""])}>
          <Plus className="h-4 w-4 mr-1" /> {addLabel}
        </Button>
      </div>
    </Field>
  )
}

/** Chip input: type and press Enter or comma; paste a comma-separated list to add many. */
export function TagsInput({ label, values, onChange, hint }: { label: string; values: string[]; onChange: (values: string[]) => void; hint?: string }) {
  const [draft, setDraft] = useState("")

  const commit = (text: string) => {
    const parts = text
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s && !values.includes(s))
    if (parts.length) onChange([...values, ...Array.from(new Set(parts))])
    setDraft("")
  }

  return (
    <Field label={label} hint={hint ?? "Press Enter or comma to add. Paste a comma-separated list to add several."}>
      <div className="flex flex-wrap gap-2 rounded-md border-2 border-black bg-white p-2">
        {values.map((v, i) => (
          <span key={`${v}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((_, idx) => idx !== i))}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => {
            const v = e.target.value
            if (v.includes(",")) commit(v)
            else setDraft(v)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commit(draft)
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1))
            }
          }}
          onBlur={() => commit(draft)}
          className="min-w-[8rem] flex-1 bg-transparent p-1 text-sm outline-none"
          placeholder="Add…"
        />
      </div>
    </Field>
  )
}
