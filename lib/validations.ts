import { z } from "zod";

/**
 * Shared validation schemas. Imported by both the client admin forms and the
 * server API routes so validation rules live in exactly one place.
 */

export const skillCategories = [
  "Frontend",
  "Backend",
  "Mobile",
  "CloudDevOps",
  "Other",
] as const;

export const projectCategories = ["Web", "Mobile", "Desktop", "CloudDevOps", "Other"] as const;

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.enum(skillCategories),
  proficiency: z
    .coerce.number()
    .int()
    .min(1, "Min 1")
    .max(100, "Max 100")
    .optional()
    .or(z.nan().transform(() => undefined)),
  icon: z.string().trim().max(300).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
});
export type SkillInput = z.infer<typeof skillSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  summary: z.string().trim().min(1, "Summary is required").max(280),
  description: z.string().trim().min(1, "Description is required"),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  techStack: z.array(z.string().trim().min(1)).default([]),
  coverImageUrl: optionalUrl,
  coverImageAlt: z.string().trim().max(200).optional().or(z.literal("")),
  gallery: z.array(z.string().trim().url()).default([]),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  featured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  category: z.enum(projectCategories),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const socialLinksSchema = z.object({
  linkedin: optionalUrl,
  github: optionalUrl,
  x: optionalUrl,
  website: optionalUrl,
});

export const siteContentSchema = z.object({
  heroHeadline: z.string().trim().max(160).default(""),
  heroSubheadline: z.string().trim().max(400).default(""),
  heroPhotoUrl: optionalUrl,
  heroPhotoAlt: z.string().trim().max(200).default(""),
  positioningStatement: z.string().trim().max(240).default(""),
  aboutTitle: z.string().trim().max(160).default(""),
  aboutText: z.string().trim().max(4000).default(""),
  aboutPhotoUrl: optionalUrl,
  aboutPhotoAlt: z.string().trim().max(200).default(""),
  contactEmail: z.string().trim().email("Must be a valid email").or(z.literal("")),
  contactHeadline: z.string().trim().max(160).default(""),
  contactBody: z.string().trim().max(600).default(""),
  socialLinks: socialLinksSchema,
  metaTitle: z.string().trim().max(200).default(""),
  metaDescription: z.string().trim().max(320).default(""),
});
export type SiteContentInput = z.infer<typeof siteContentSchema>;

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role: z.string().trim().max(160).optional().or(z.literal("")),
  quote: z.string().trim().min(1, "Quote is required").max(600),
  avatarUrl: optionalUrl,
  rating: z.coerce.number().int().min(1).max(5).default(5),
  approved: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

/** Public review submission (from the /reviews page). Always starts unapproved. */
export const reviewSubmitSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  role: z.string().trim().max(160).optional().or(z.literal("")),
  quote: z.string().trim().min(12, "A little more detail, please").max(600),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional(),
});
export type ReviewSubmitInput = z.infer<typeof reviewSubmitSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell me your name").max(120),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "A little more detail, please").max(4000),
  // Honeypot — must stay empty (bots fill it in).
  company: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;
