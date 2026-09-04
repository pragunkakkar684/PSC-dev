import { z } from 'zod';

/**
 * Utility function to convert text into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

// ─── TEAM SCHEMAS ────────────────────────────────────────────────────────────

export const teamMemberCategoryEnum = z.enum(['leadership', 'partner', 'mentor', 'advisor']);

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100),
  roleTitle: z.string().max(300).optional().nullable(),
  category: teamMemberCategoryEnum.default('partner'),
  focusArea: z.string().max(300).optional().nullable(),
  shortBio: z.string().optional().nullable(),
  longBioSections: z.array(z.array(z.string())).optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  email: z.string().email('Invalid email address').or(z.literal('')).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  yearsExperience: z.string().max(50).optional().nullable(),
  quote: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const teamMemberExpertiseSchema = z.object({
  teamMemberId: z.number().int(),
  iconName: z.string().max(100).optional().nullable(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

// ─── EVENT SCHEMAS ───────────────────────────────────────────────────────────

export const eventTypeEnum = z.enum(['WEBINAR', 'SEMINAR', 'ROUNDTABLE', 'CONFERENCE']);
export const eventStatusEnum = z.enum(['upcoming', 'past', 'cancelled']);

export const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(500),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(200),
  eventType: eventTypeEnum.optional().nullable(),
  description: z.string().optional().nullable(),
  date: z.string().optional().nullable(), // YYYY-MM-DD
  timeStart: z.string().optional().nullable(),
  timeEnd: z.string().optional().nullable(),
  timezone: z.string().max(100).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  platform: z.string().max(200).optional().nullable(),
  durationLabel: z.string().max(50).optional().nullable(),
  registrationUrl: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  agendaFileUrl: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isHighlighted: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  status: eventStatusEnum.default('upcoming'),
});

export const eventAgendaItemSchema = z.object({
  eventId: z.number().int(),
  timeLabel: z.string().max(50).optional().nullable(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const eventSpeakerSchema = z.object({
  eventId: z.number().int(),
  teamMemberId: z.number().int().optional().nullable(),
  externalSpeakerName: z.string().max(200).optional().nullable(),
  externalSpeakerRole: z.string().max(300).optional().nullable(),
  externalSpeakerImageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  sortOrder: z.number().int().default(0),
});

// ─── INSIGHTS SCHEMAS ────────────────────────────────────────────────────────

export const contentTypeEnum = z.enum(['article', 'regulatory_update', 'judgement', 'research', 'webinar']);

export const insightArticleSchema = z.object({
  title: z.string().min(2, 'Title is required').max(500),
  slug: z.string().min(2, 'Slug is required').max(300),
  contentType: contentTypeEnum.default('article'),
  tag: z.string().max(100).optional().nullable(),
  summary: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  fileUrl: z.string().url('Invalid file URL').or(z.literal('')).optional().nullable(),
  readTimeMins: z.number().int().min(0).optional().nullable(),
  authorityTag: z.string().max(100).optional().nullable(),
  courtName: z.string().max(300).optional().nullable(),
  publishedAt: z.string().optional().nullable(), // ISO string or date string
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  authorId: z.number().int().optional().nullable(),
});

// ─── PRACTICE AREA SCHEMAS ───────────────────────────────────────────────────

export const practiceAreaSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  slug: z.string().min(2, 'Slug is required').max(100),
  number: z.string().max(5).optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  iconName: z.string().max(100).optional().nullable(),
  styleClass: z.string().max(200).optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const practiceAreaServiceSchema = z.object({
  practiceAreaId: z.number().int(),
  name: z.string().min(1, 'Service name is required').max(200),
  sortOrder: z.number().int().default(0),
});

// ─── INDUSTRY SCHEMAS ────────────────────────────────────────────────────────

export const industrySchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  slug: z.string().min(2, 'Slug is required').max(100),
  shortDescription: z.string().optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
  // Hero fields
  heroEyebrow: z.string().max(200).optional().nullable(),
  heroHeading: z.string().max(400).optional().nullable(),
  heroDescription: z.string().optional().nullable(),
  heroImageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  heroImageAlt: z.string().max(300).optional().nullable(),
  heroCta1Text: z.string().max(100).optional().nullable(),
  heroCta1Href: z.string().max(500).optional().nullable(),
  heroCta2Text: z.string().max(100).optional().nullable(),
  heroCta2Href: z.string().max(500).optional().nullable(),
  // Overview fields
  overviewHeading: z.string().max(400).optional().nullable(),
  overviewQuote: z.string().optional().nullable(),
  overviewBody: z.string().optional().nullable(),
  overviewBody2: z.string().optional().nullable(),
  overviewImageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  overviewImageAlt: z.string().max(300).optional().nullable(),
  // Challenges intro
  challengesIntro: z.string().optional().nullable(),
  // Solutions / How We Help fields
  solutionsHeading: z.string().max(400).optional().nullable(),
  solutionsIntro: z.string().optional().nullable(),
  // Final CTA fields
  finalCtaHeading: z.string().max(400).optional().nullable(),
  finalCtaDescription: z.string().optional().nullable(),
  finalCta1Text: z.string().max(100).optional().nullable(),
  finalCta1Href: z.string().max(500).optional().nullable(),
  finalCta2Text: z.string().max(100).optional().nullable(),
  finalCta2Href: z.string().max(500).optional().nullable(),
});

// ─── FAQ SCHEMA ──────────────────────────────────────────────────────────────

export const faqSchema = z.object({
  question: z.string().min(3, 'Question is required'),
  answer: z.string().min(3, 'Answer is required'),
  pageContext: z.string().max(100).default('general'),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

// ─── TESTIMONIAL SCHEMA ──────────────────────────────────────────────────────

export const testimonialSchema = z.object({
  quote: z.string().min(3, 'Quote is required'),
  personName: z.string().max(200).optional().nullable(),
  personTitle: z.string().max(200).optional().nullable(),
  companyName: z.string().max(200).optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

// ─── OFFICE LOCATION SCHEMA ──────────────────────────────────────────────────

export const officeLocationSchema = z.object({
  city: z.string().min(2, 'City is required').max(100),
  fullAddress: z.string().optional().nullable(),
  phone: z.string().max(100).optional().nullable(),
  email: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
  isHeadquarters: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

// ─── HERO SECTION SCHEMA ─────────────────────────────────────────────────────

export const heroSectionSchema = z.object({
  pageSlug: z.string().min(1, 'Page slug is required').max(100),
  eyebrow: z.string().max(200).optional().nullable(),
  heading: z.string().optional().nullable(),
  subheading: z.string().optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional().nullable(),
  cta1Text: z.string().max(100).optional().nullable(),
  cta1Href: z.string().max(500).optional().nullable().refine((val) => !val || !val.trim().toLowerCase().startsWith('javascript:'), 'Invalid URL protocol'),
  cta2Text: z.string().max(100).optional().nullable(),
  cta2Href: z.string().max(500).optional().nullable().refine((val) => !val || !val.trim().toLowerCase().startsWith('javascript:'), 'Invalid URL protocol'),
});

// ─── NAVIGATION SCHEMA ───────────────────────────────────────────────────────

export const navItemSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  href: z.string().min(1, 'Link href is required').max(500).refine((val) => !val.trim().toLowerCase().startsWith('javascript:'), 'JavaScript protocol is not allowed'),
  menuKey: z.string().max(50).optional().nullable(),
  menuType: z.string().max(20).optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// ─── SITE SETTINGS SCHEMA ────────────────────────────────────────────────────

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100),
  tagline: z.string().optional().nullable(),
  footerDescription: z.string().optional().nullable(),
  copyrightText: z.string().max(200).optional().nullable(),
  contactEmailGeneral: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
});

