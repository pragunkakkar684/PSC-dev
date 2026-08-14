/**
 * PSC Global — Drizzle ORM Schema
 *
 * Tables:
 *  Auth: users, accounts, sessions, verification_tokens
 *  CMS:  site_settings, nav_items, practice_areas, practice_area_services,
 *        industries, team_members, team_member_expertise, events,
 *        event_agenda_items, event_speakers, insights_articles,
 *        testimonials, office_locations, faqs, hero_sections, stats,
 *        contact_submissions, newsletter_subscribers, legacy_timeline,
 *        media_files
 */

import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  date,
  time,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// ─── AUTH TABLES ────────────────────────────────────────────────────────────

/**
 * CMS users — admins and editors only.
 * Public visitors are never stored here.
 * role: 'admin' → full access | 'editor' → content only
 */
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 320 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  /** bcrypt hash — NEVER expose to client */
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 1000 }),
  role: varchar('role', { length: 20 }).notNull().default('editor'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/** OAuth accounts (Auth.js adapter requirement) */
export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })],
);

/** Database sessions (Auth.js adapter) */
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

/** Email verification tokens (Auth.js adapter) */
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// ─── SITE SETTINGS (singleton) ──────────────────────────────────────────────

export const siteSettings = pgTable('site_settings', {
  id: integer('id').primaryKey().default(1),
  siteName: varchar('site_name', { length: 100 }).notNull().default('PSC Global'),
  tagline: text('tagline'),
  footerDescription: text('footer_description'),
  copyrightText: varchar('copyright_text', { length: 200 }),
  contactEmailGeneral: varchar('contact_email_general', { length: 320 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

export const navItems = pgTable('nav_items', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 100 }).notNull(),
  href: varchar('href', { length: 500 }).notNull().default('#'),
  menuKey: varchar('menu_key', { length: 50 }),
  menuType: varchar('menu_type', { length: 20 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// ─── PRACTICE AREAS ─────────────────────────────────────────────────────────

export const practiceAreas = pgTable('practice_areas', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  number: varchar('number', { length: 5 }),
  name: varchar('name', { length: 200 }).notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  iconName: varchar('icon_name', { length: 100 }),
  styleClass: varchar('style_class', { length: 200 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const practiceAreaServices = pgTable('practice_area_services', {
  id: serial('id').primaryKey(),
  practiceAreaId: integer('practice_area_id')
    .notNull()
    .references(() => practiceAreas.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ─── INDUSTRIES ─────────────────────────────────────────────────────────────

export const industries = pgTable('industries', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  shortDescription: text('short_description'),
  imageUrl: varchar('image_url', { length: 1000 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── TEAM MEMBERS ───────────────────────────────────────────────────────────

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  roleTitle: varchar('role_title', { length: 300 }),
  /** 'leadership' | 'partner' | 'mentor' | 'advisor' */
  category: varchar('category', { length: 50 }).notNull().default('partner'),
  focusArea: varchar('focus_area', { length: 300 }),
  shortBio: text('short_bio'),
  /** Array of paragraph groups for individual profile pages */
  longBioSections: jsonb('long_bio_sections'),
  imageUrl: varchar('image_url', { length: 1000 }),
  email: varchar('email', { length: 320 }),
  location: varchar('location', { length: 200 }),
  yearsExperience: varchar('years_experience', { length: 50 }),
  quote: text('quote'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teamMemberExpertise = pgTable('team_member_expertise', {
  id: serial('id').primaryKey(),
  teamMemberId: integer('team_member_id')
    .notNull()
    .references(() => teamMembers.id, { onDelete: 'cascade' }),
  iconName: varchar('icon_name', { length: 100 }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ─── EVENTS ─────────────────────────────────────────────────────────────────

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  /** 'WEBINAR' | 'SEMINAR' | 'ROUNDTABLE' | 'CONFERENCE' */
  eventType: varchar('event_type', { length: 50 }),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  date: date('date'),
  timeStart: time('time_start'),
  timeEnd: time('time_end'),
  timezone: varchar('timezone', { length: 100 }),
  location: varchar('location', { length: 300 }),
  platform: varchar('platform', { length: 200 }),
  durationLabel: varchar('duration_label', { length: 50 }),
  registrationUrl: varchar('registration_url', { length: 1000 }),
  agendaFileUrl: varchar('agenda_file_url', { length: 1000 }),
  imageUrl: varchar('image_url', { length: 1000 }),
  isFeatured: boolean('is_featured').notNull().default(false),
  isHighlighted: boolean('is_highlighted').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(false),
  /** 'upcoming' | 'past' | 'cancelled' */
  status: varchar('status', { length: 20 }).notNull().default('upcoming'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const eventAgendaItems = pgTable('event_agenda_items', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  timeLabel: varchar('time_label', { length: 50 }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  isCurrent: boolean('is_current').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const eventSpeakers = pgTable('event_speakers', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  teamMemberId: integer('team_member_id').references(() => teamMembers.id, {
    onDelete: 'set null',
  }),
  externalSpeakerName: varchar('external_speaker_name', { length: 200 }),
  externalSpeakerRole: varchar('external_speaker_role', { length: 300 }),
  externalSpeakerImageUrl: varchar('external_speaker_image_url', { length: 1000 }),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ─── INSIGHTS ARTICLES ──────────────────────────────────────────────────────

export const insightsArticles = pgTable('insights_articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 300 }).notNull().unique(),
  /** 'article' | 'regulatory_update' | 'judgement' | 'research' | 'webinar' */
  contentType: varchar('content_type', { length: 50 }).notNull().default('article'),
  tag: varchar('tag', { length: 100 }),
  title: varchar('title', { length: 500 }).notNull(),
  summary: text('summary'),
  body: text('body'),
  imageUrl: varchar('image_url', { length: 1000 }),
  fileUrl: varchar('file_url', { length: 1000 }),
  readTimeMins: integer('read_time_mins'),
  authorityTag: varchar('authority_tag', { length: 100 }),
  courtName: varchar('court_name', { length: 300 }),
  publishedAt: timestamp('published_at'),
  isFeatured: boolean('is_featured').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(false),
  authorId: integer('author_id').references(() => teamMembers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  quote: text('quote').notNull(),
  personName: varchar('person_name', { length: 200 }),
  personTitle: varchar('person_title', { length: 200 }),
  companyName: varchar('company_name', { length: 200 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── OFFICE LOCATIONS ───────────────────────────────────────────────────────

export const officeLocations = pgTable('office_locations', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
  fullAddress: text('full_address'),
  phone: varchar('phone', { length: 100 }),
  email: varchar('email', { length: 320 }),
  isHeadquarters: boolean('is_headquarters').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
});

// ─── FAQS ───────────────────────────────────────────────────────────────────

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  /** 'contact' | 'gcc' | 'general' */
  pageContext: varchar('page_context', { length: 100 }).notNull().default('general'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
});

// ─── HERO SECTIONS ──────────────────────────────────────────────────────────

export const heroSections = pgTable('hero_sections', {
  id: serial('id').primaryKey(),
  /** 'home' | 'about' | 'contact' | 'team' | 'gcc' | 'events' | 'insights' | 'industries' | 'practice-areas' */
  pageSlug: varchar('page_slug', { length: 100 }).notNull().unique(),
  eyebrow: varchar('eyebrow', { length: 200 }),
  heading: text('heading'),
  subheading: text('subheading'),
  imageUrl: varchar('image_url', { length: 1000 }),
  cta1Text: varchar('cta1_text', { length: 100 }),
  cta1Href: varchar('cta1_href', { length: 500 }),
  cta2Text: varchar('cta2_text', { length: 100 }),
  cta2Href: varchar('cta2_href', { length: 500 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── STATS ──────────────────────────────────────────────────────────────────

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  numberDisplay: varchar('number_display', { length: 50 }).notNull(),
  label: varchar('label', { length: 200 }).notNull(),
  iconName: varchar('icon_name', { length: 100 }),
  /** 'global' | 'gcc' */
  context: varchar('context', { length: 100 }).notNull().default('global'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
});

// ─── CONTACT SUBMISSIONS ────────────────────────────────────────────────────

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 300 }).notNull(),
  company: varchar('company', { length: 300 }),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 100 }),
  practiceArea: varchar('practice_area', { length: 200 }),
  message: text('message').notNull(),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  /** 'new' | 'read' | 'responded' | 'archived' */
  status: varchar('status', { length: 50 }).notNull().default('new'),
  ipAddress: varchar('ip_address', { length: 50 }),
});

// ─── NEWSLETTER SUBSCRIBERS ─────────────────────────────────────────────────

export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 320 }).notNull(),
    subscribedAt: timestamp('subscribed_at').notNull().defaultNow(),
    isActive: boolean('is_active').notNull().default(true),
    unsubscribedAt: timestamp('unsubscribed_at'),
  },
  (table) => [uniqueIndex('newsletter_email_idx').on(table.email)],
);

// ─── LEGACY TIMELINE ────────────────────────────────────────────────────────

export const legacyTimeline = pgTable('legacy_timeline', {
  id: serial('id').primaryKey(),
  year: varchar('year', { length: 10 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
});

// ─── MEDIA FILES ────────────────────────────────────────────────────────────

/**
 * Tracks files uploaded to Cloudinary.
 * The actual binary is in Cloudinary — this table stores metadata + the URL.
 */
export const mediaFiles = pgTable('media_files', {
  id: serial('id').primaryKey(),
  /** Cloudinary public_id — used to reference/delete the file */
  cloudinaryId: varchar('cloudinary_id', { length: 500 }).notNull().unique(),
  /** Full Cloudinary delivery URL */
  url: varchar('url', { length: 1000 }).notNull(),
  /** 'image' | 'document' */
  resourceType: varchar('resource_type', { length: 20 }).notNull().default('image'),
  originalName: varchar('original_name', { length: 500 }),
  mimeType: varchar('mime_type', { length: 100 }),
  sizeBytes: integer('size_bytes'),
  /** Cloudinary folder path e.g. 'psc-global/team' */
  folder: varchar('folder', { length: 200 }),
  uploadedBy: text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});

// ─── TYPE EXPORTS ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Event = typeof events.$inferSelect;
export type InsightsArticle = typeof insightsArticles.$inferSelect;
export type PracticeArea = typeof practiceAreas.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type OfficeLocation = typeof officeLocations.$inferSelect;
export type HeroSection = typeof heroSections.$inferSelect;
export type NavItem = typeof navItems.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
