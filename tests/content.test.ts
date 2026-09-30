import { describe, expect, it } from "vitest"
import { defaultContent } from "@/lib/content/defaults"
import {
  detectImage,
  isPdf,
  sanitizeDownloadName,
} from "@/lib/content/assets"
import { buildSearchIndex, searchItems } from "@/lib/content/search"
import {
  isSafeUrl,
  profileSchema,
  projectSchema,
  schemas,
  type ContentKey,
} from "@/lib/content/schema"

const bytes = (...n: number[]) => new Uint8Array(n)

describe("seed content", () => {
  it.each(Object.keys(schemas) as ContentKey[])("%s validates against its schema", (key) => {
    const result = schemas[key].safeParse(defaultContent[key])
    expect(result.success).toBe(true)
  })
})

describe("isSafeUrl", () => {
  it.each([
    "https://example.com",
    "http://example.com/a?b=c",
    "mailto:someone@example.com",
    "  https://example.com  ",
    "HTTPS://EXAMPLE.COM",
  ])("accepts %s", (url) => expect(isSafeUrl(url)).toBe(true))

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "java\nscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "//evil.example.com",
    "/relative/path",
    "#",
    "",
  ])("rejects %j", (url) => expect(isSafeUrl(url)).toBe(false))
})

describe("project schema", () => {
  const base = defaultContent.projects[0]

  it("rejects javascript: links on every link field", () => {
    for (const field of ["codeLink", "demoLink", "learnMoreLink"] as const) {
      const r = projectSchema.safeParse({ ...base, [field]: "javascript:alert(1)" })
      expect(r.success, field).toBe(false)
    }
  })

  it("treats blank optional links as absent", () => {
    const r = projectSchema.safeParse({ ...base, codeLink: "", demoLink: "   " })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.codeLink).toBeUndefined()
      expect(r.data.demoLink).toBeUndefined()
    }
  })

  it("only accepts whitelisted colors and icons", () => {
    expect(projectSchema.safeParse({ ...base, color: "bg-red-500 p-96" }).success).toBe(false)
    expect(projectSchema.safeParse({ ...base, icon: "constructor" }).success).toBe(false)
  })
})

describe("profile schema", () => {
  it("rejects unsafe social links and bad emails", () => {
    const p = defaultContent.profile
    expect(profileSchema.safeParse({ ...p, socials: { ...p.socials, github: "javascript:x" } }).success).toBe(false)
    expect(profileSchema.safeParse({ ...p, socials: { ...p.socials, email: "not-an-email" } }).success).toBe(false)
  })
})

describe("upload validators", () => {
  it("accepts real PDF magic bytes and rejects everything else", () => {
    expect(isPdf(new TextEncoder().encode("%PDF-1.7\n..."))).toBe(true)
    expect(isPdf(new TextEncoder().encode("MZ\x90\x00 fake.exe renamed .pdf"))).toBe(false)
    expect(isPdf(new TextEncoder().encode("<html><script>alert(1)</script>"))).toBe(false)
    expect(isPdf(bytes())).toBe(false)
    expect(isPdf(new TextEncoder().encode("%PDF"))).toBe(false)
  })

  it("sniffs png/jpeg/webp and rejects svg", () => {
    expect(detectImage(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))?.ext).toBe("png")
    expect(detectImage(bytes(0xff, 0xd8, 0xff, 0xe0))?.ext).toBe("jpg")
    expect(
      detectImage(bytes(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0x56))?.ext,
    ).toBe("webp")
    expect(detectImage(new TextEncoder().encode("<svg onload=alert(1)></svg>"))).toBeNull()
  })

  it("sanitizes download names (no path traversal, quotes or header injection)", () => {
    expect(sanitizeDownloadName("Parth Sachdeva CV")).toBe("Parth Sachdeva CV.pdf")
    expect(sanitizeDownloadName("../../etc/passwd")).toBe("etcpasswd.pdf")
    expect(sanitizeDownloadName('a"; filename="evil.exe')).not.toMatch(/["\r\n;/\\]/)
    expect(sanitizeDownloadName("x\r\nSet-Cookie: a=b")).not.toMatch(/[\r\n:]/)
    expect(sanitizeDownloadName("")).toBe("Resume.pdf")
    expect(sanitizeDownloadName(undefined)).toBe("Resume.pdf")
    expect(sanitizeDownloadName("a".repeat(500)).length).toBeLessThanOrEqual(84)
  })
})

describe("search index", () => {
  const index = buildSearchIndex(defaultContent)

  it("is derived from content", () => {
    expect(searchItems(index, "react").length).toBeGreaterThan(0)
    expect(searchItems(index, "adoptable")[0]?.url).toBe("/projects")
    expect(searchItems(index, "cars24")[0]?.url).toBe("/experience")
  })

  it("returns nothing for blank queries and respects the limit", () => {
    expect(searchItems(index, "   ")).toEqual([])
    expect(searchItems(index, "e", 3).length).toBeLessThanOrEqual(3)
  })
})
