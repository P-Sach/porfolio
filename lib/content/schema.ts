import { z } from "zod"
import { PROJECT_COLOR_KEYS, PROJECT_ICON_KEYS } from "./presets"

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"])

/** http(s)/mailto links only. Rejects javascript:, data:, vbscript:, etc. */
export function isSafeUrl(value: string): boolean {
  try {
    return ALLOWED_PROTOCOLS.has(new URL(value.trim()).protocol)
  } catch {
    return false
  }
}

const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(isSafeUrl, "Must be a valid http(s) or mailto link")

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  safeUrl.optional(),
)

const text = (max: number) => z.string().trim().min(1, "Required").max(max)
const textList = (maxItems: number, maxLen: number) =>
  z.array(text(maxLen)).max(maxItems)

export const profileSchema = z.object({
  name: text(80),
  title: text(80),
  tagline: text(300),
  location: text(80),
  about: text(1500),
  available: z.boolean(),
  availableText: text(80),
  showResume: z.boolean(),
  expertise: z
    .array(z.object({ title: text(60), description: text(160) }))
    .max(8),
  socials: z.object({
    github: safeUrl,
    linkedin: safeUrl,
    email: z.string().trim().email().max(200),
  }),
})

export const experienceItemSchema = z.object({
  company: text(80),
  role: text(120),
  duration: text(60),
  location: text(80),
  description: textList(15, 600),
  technologies: textList(30, 40),
})
export const experienceSchema = z.array(experienceItemSchema).max(30)

export const projectSchema = z.object({
  title: text(80),
  description: text(600),
  color: z.enum(PROJECT_COLOR_KEYS),
  icon: z.enum(PROJECT_ICON_KEYS),
  technologies: textList(20, 40),
  features: textList(15, 300),
  codeLink: optionalUrl,
  demoLink: optionalUrl,
  learnMoreLink: optionalUrl,
})
export const projectsSchema = z.array(projectSchema).max(30)

export const skillsSchema = z
  .array(z.object({ title: text(60), items: textList(60, 40) }))
  .max(10)

const assetRef = z.object({
  path: z.string().max(200),
  downloadName: z.string().max(100).optional(),
  updatedAt: z.string(),
})
export const assetsSchema = z.object({
  resume: assetRef.nullable(),
  photo: assetRef.nullable(),
})

export const schemas = {
  profile: profileSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  skills: skillsSchema,
  assets: assetsSchema,
} as const

export type ContentKey = keyof typeof schemas
export const CONTENT_KEYS = Object.keys(schemas) as ContentKey[]

export type Profile = z.infer<typeof profileSchema>
export type ExperienceItem = z.infer<typeof experienceItemSchema>
export type Project = z.infer<typeof projectSchema>
export type SkillCategory = z.infer<typeof skillsSchema>[number]
export type Assets = z.infer<typeof assetsSchema>

export interface SiteContent {
  profile: Profile
  experience: ExperienceItem[]
  projects: Project[]
  skills: SkillCategory[]
  assets: Assets
}
