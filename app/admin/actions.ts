"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import {
  MAX_PHOTO_BYTES,
  MAX_RESUME_BYTES,
  detectImage,
  isPdf,
  sanitizeDownloadName,
} from "@/lib/content/assets"
import { defaultContent } from "@/lib/content/defaults"
import { CONTENT_CACHE_TAG, CONTENT_TABLE } from "@/lib/content/store"
import { assetsSchema, schemas, type Assets, type ContentKey } from "@/lib/content/schema"
import { ASSET_BUCKET, isAdminConfigured } from "@/lib/supabase/config"
import { createAdminClient } from "@/lib/supabase/admin"
import { createSessionClient } from "@/lib/supabase/server"

const HISTORY_TABLE = "site_content_history"

export type ActionResult = { ok: true; message: string } | { ok: false; error: string }

const fail = (error: string): ActionResult => ({ ok: false, error })

function isEditableKey(key: string): key is Exclude<ContentKey, "assets"> {
  return key === "profile" || key === "experience" || key === "projects" || key === "skills"
}

function refreshSite() {
  revalidateTag(CONTENT_CACHE_TAG)
  revalidatePath("/", "layout")
}

async function authorize(): Promise<ActionResult | null> {
  try {
    await requireAdmin()
    return null
  } catch {
    return fail("Your session has expired. Please sign in again.")
  }
}

// --- Auth -------------------------------------------------------------------

export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isAdminConfigured()) return fail("The CMS is not configured on this deployment.")

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return fail("Enter your email and password.")

  const supabase = await createSessionClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  // One generic message for every failure so the form can't be used to probe
  // which accounts exist.
  const generic = fail("Invalid email or password.")
  if (error || !data.user) return generic
  if (data.user.email?.toLowerCase() !== process.env.ADMIN_EMAIL!.trim().toLowerCase()) {
    await supabase.auth.signOut()
    return generic
  }

  redirect("/admin")
}

export async function signOut() {
  const supabase = await createSessionClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

// --- Content ----------------------------------------------------------------

export async function saveSection(key: string, payload: unknown): Promise<ActionResult> {
  const denied = await authorize()
  if (denied) return denied
  if (!isEditableKey(key)) return fail("Unknown section.")

  const parsed = schemas[key].safeParse(payload)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const where = issue.path.length ? `${issue.path.join(" › ")}: ` : ""
    return fail(`${where}${issue.message}`)
  }

  const db = createAdminClient()

  // Keep the previous value (or the seeded default on first save) for one-step undo.
  const { data: prev, error: readError } = await db
    .from(CONTENT_TABLE)
    .select("data")
    .eq("key", key)
    .maybeSingle()
  if (readError) return fail("Could not read the current content. Try again.")

  await db.from(HISTORY_TABLE).insert({ key, data: prev?.data ?? defaultContent[key] })

  const { error } = await db
    .from(CONTENT_TABLE)
    .upsert({ key, data: parsed.data, updated_at: new Date().toISOString() })
  if (error) return fail("Saving failed. Your changes were not published.")

  refreshSite()
  return { ok: true, message: "Saved and published." }
}

export async function revertSection(key: string): Promise<ActionResult> {
  const denied = await authorize()
  if (denied) return denied
  if (!isEditableKey(key)) return fail("Unknown section.")

  const db = createAdminClient()
  const { data: last } = await db
    .from(HISTORY_TABLE)
    .select("id, data")
    .eq("key", key)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!last) return fail("There is no earlier version to restore.")

  const parsed = schemas[key].safeParse(last.data)
  if (!parsed.success) return fail("The earlier version is no longer valid and can't be restored.")

  const { error } = await db
    .from(CONTENT_TABLE)
    .upsert({ key, data: parsed.data, updated_at: new Date().toISOString() })
  if (error) return fail("Restoring failed.")

  await db.from(HISTORY_TABLE).delete().eq("id", last.id)
  refreshSite()
  return { ok: true, message: "Restored the previous version." }
}

// --- Files (resume + photo) -------------------------------------------------

type AssetKind = "resume" | "photo"

async function readAssets(db: ReturnType<typeof createAdminClient>): Promise<Assets> {
  const { data } = await db.from(CONTENT_TABLE).select("data").eq("key", "assets").maybeSingle()
  const parsed = assetsSchema.safeParse(data?.data)
  return parsed.success ? parsed.data : { resume: null, photo: null }
}

async function writeAssets(db: ReturnType<typeof createAdminClient>, next: Assets, prev: Assets) {
  await db.from(HISTORY_TABLE).insert({ key: "assets", data: prev })
  return db
    .from(CONTENT_TABLE)
    .upsert({ key: "assets", data: next, updated_at: new Date().toISOString() })
}

export async function uploadAsset(kind: AssetKind, formData: FormData): Promise<ActionResult> {
  const denied = await authorize()
  if (denied) return denied
  if (kind !== "resume" && kind !== "photo") return fail("Unknown file type.")

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return fail("Choose a file to upload.")

  const limit = kind === "resume" ? MAX_RESUME_BYTES : MAX_PHOTO_BYTES
  if (file.size > limit) return fail(`File is too large (max ${limit / 1024 / 1024} MB).`)

  // Validate by content, and choose extension/content-type ourselves. The
  // client-supplied name and MIME type are never trusted or stored.
  const bytes = new Uint8Array(await file.arrayBuffer())
  let ext: string
  let contentType: string
  if (kind === "resume") {
    if (!isPdf(bytes)) return fail("That file is not a valid PDF.")
    ext = "pdf"
    contentType = "application/pdf"
  } else {
    const image = detectImage(bytes)
    if (!image) return fail("Photo must be a PNG, JPEG or WebP image.")
    ext = image.ext
    contentType = image.mime
  }

  const db = createAdminClient()
  const path = `${kind}/${kind}-${Date.now()}.${ext}`

  const { error: uploadError } = await db.storage
    .from(ASSET_BUCKET)
    .upload(path, bytes, { contentType, upsert: false, cacheControl: "3600" })
  if (uploadError) return fail("Upload failed. Please try again.")

  const prev = await readAssets(db)
  const entry = {
    path,
    updatedAt: new Date().toISOString(),
    ...(kind === "resume" ? { downloadName: sanitizeDownloadName(formData.get("downloadName")) } : {}),
  }
  const { error } = await writeAssets(db, { ...prev, [kind]: entry }, prev)
  if (error) {
    await db.storage.from(ASSET_BUCKET).remove([path])
    return fail("The file uploaded but could not be published. Nothing changed.")
  }

  // Old file is removed only after the new one is live.
  if (prev[kind]) await db.storage.from(ASSET_BUCKET).remove([prev[kind]!.path])

  refreshSite()
  return { ok: true, message: kind === "resume" ? "Resume replaced." : "Photo replaced." }
}

export async function deleteAsset(kind: AssetKind): Promise<ActionResult> {
  const denied = await authorize()
  if (denied) return denied
  if (kind !== "resume" && kind !== "photo") return fail("Unknown file type.")

  const db = createAdminClient()
  const prev = await readAssets(db)
  if (!prev[kind]) return fail("Nothing to delete.")

  const { error } = await writeAssets(db, { ...prev, [kind]: null }, prev)
  if (error) return fail("Delete failed.")

  await db.storage.from(ASSET_BUCKET).remove([prev[kind]!.path])
  refreshSite()
  return { ok: true, message: kind === "resume" ? "Uploaded resume deleted." : "Photo deleted." }
}
