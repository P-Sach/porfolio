// Pure upload validators (no server imports) so they can be unit-tested.

export const MAX_RESUME_BYTES = 5 * 1024 * 1024
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024

/** PDFs start with the bytes "%PDF-". Checked on content, never on file.type/extension. */
export function isPdf(bytes: Uint8Array): boolean {
  return (
    bytes.length > 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  )
}

export interface DetectedImage {
  ext: "png" | "jpg" | "webp"
  mime: "image/png" | "image/jpeg" | "image/webp"
}

/** Sniffs PNG / JPEG / WebP from magic bytes. SVG and everything else is rejected. */
export function detectImage(b: Uint8Array): DetectedImage | null {
  if (
    b.length > 8 &&
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) {
    return { ext: "png", mime: "image/png" }
  }
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" }
  }
  if (
    b.length > 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) {
    return { ext: "webp", mime: "image/webp" }
  }
  return null
}

/** Safe filename for Content-Disposition: letters, digits, space, _ . ( ) - only. */
export function sanitizeDownloadName(input: unknown): string {
  const raw = typeof input === "string" ? input : ""
  const base = raw
    .replace(/\.pdf$/i, "")
    .replace(/[^A-Za-z0-9 _.()-]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^[.\s]+/, "")
    .trim()
    .slice(0, 80)
  return `${base || "Resume"}.pdf`
}
