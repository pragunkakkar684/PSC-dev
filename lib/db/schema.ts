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
 *        media_files, site_pages, page_sections, page_seo, careers_positions
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
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// ─── AUTH TABLES ────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 320 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 1000 }),
  role: varchar('role', { length: 20 }).notNull().default('editor'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

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

// ─── MEDIA FILES ─────────────────────────────────────────────────────────────

export const mediaFiles = pgTable('media_files', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 500 }).notNull().unique(),
  url: varchar('url', { length: 1000 }).notNull(),
  resourceType: varchar('resource_type', { length: 20 }).notNull().default('image'),
  originalName: varchar('original_name', { length: 500 }),
  mimeType: varchar('mime_type', { length: 100 }),
  sizeBytes: integer('size_bytes'),
  folder: varchar('folder', { length: 200 }),
  uploadedBy: text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
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
  heading: varchar('heading', { length: 300 }),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  imageUrl: varchar('image_url', { length: 1000 }),
  iconName: varchar('icon_name', { length: 100 }),
  styleClass: varchar('style_class', { length: 200 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
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
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // Hero content
  heroEyebrow: varchar('hero_eyebrow', { length: 200 }),
  heroHeading: varchar('hero_heading', { length: 400 }),
  heroDescription: text('hero_description'),
  heroImageUrl: varchar('hero_image_url', { length: 1000 }),
  heroImageAlt: varchar('hero_image_alt', { length: 300 }),
  heroCta1Text: varchar('hero_cta1_text', { length: 100 }),
  heroCta1Href: varchar('hero_cta1_href', { length: 500 }),
  heroCta2Text: varchar('hero_cta2_text', { length: 100 }),
  heroCta2Href: varchar('hero_cta2_href', { length: 500 }),
  // Overview / Understanding section
  overviewHeading: varchar('overview_heading', { length: 400 }),
  overviewQuote: text('overview_quote'),
  overviewBody: text('overview_body'),
  overviewBody2: text('overview_body2'),
  overviewImageUrl: varchar('overview_image_url', { length: 1000 }),
  overviewImageAlt: varchar('overview_image_alt', { length: 300 }),
  // Challenges section
  challengesIntro: text('challenges_intro'),
  // Solutions / How We Help section
  solutionsHeading: varchar('solutions_heading', { length: 400 }),
  solutionsIntro: text('solutions_intro'),
  // Final CTA section
  finalCtaHeading: varchar('final_cta_heading', { length: 400 }),
  finalCtaDescription: text('final_cta_description'),
  finalCta1Text: varchar('final_cta1_text', { length: 100 }),
  finalCta1Href: varchar('final_cta1_href', { length: 500 }),
  finalCta2Text: varchar('final_cta2_text', { length: 100 }),
  finalCta2Href: varchar('final_cta2_href', { length: 500 }),
});

export const industryChallenges = pgTable('industry_challenges', {
  id: serial('id').primaryKey(),
  industryId: integer('industry_id')
    .notNull()
    .references(() => industries.id, { onDelete: 'cascade' }),
  number: varchar('number', { length: 10 }).notNull().default('01.'),
  title: varchar('title', { length: 300 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const industrySolutions = pgTable('industry_solutions', {
  id: serial('id').primaryKey(),
  industryId: integer('industry_id')
    .notNull()
    .references(() => industries.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 200 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const industryPracticeAreas = pgTable('industry_practice_areas', {
  id: serial('id').primaryKey(),
  industryId: integer('industry_id')
    .notNull()
    .references(() => industries.id, { onDelete: 'cascade' }),
  practiceAreaId: integer('practice_area_id')
    .notNull()
    .references(() => practiceAreas.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const industryExperts = pgTable('industry_experts', {
  id: serial('id').primaryKey(),
  industryId: integer('industry_id')
    .notNull()
    .references(() => industries.id, { onDelete: 'cascade' }),
  teamMemberId: integer('team_member_id')
    .notNull()
    .references(() => teamMembers.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const industryInsights = pgTable('industry_insights', {
  id: serial('id').primaryKey(),
  industryId: integer('industry_id')
    .notNull()
    .references(() => industries.id, { onDelete: 'cascade' }),
  articleId: integer('article_id')
    .notNull()
    .references(() => insightsArticles.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ─── INDUSTRIES INDEX PAGE — SHARED CHALLENGES ───────────────────────────────

export const industrySharedChallenges = pgTable('industry_shared_challenges', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── REGULATORY UPDATES ──────────────────────────────────────────────────────

export const regulatoryUpdates = pgTable('regulatory_updates', {
  id: serial('id').primaryKey(),
  authority: varchar('authority', { length: 200 }).notNull(),
  date: varchar('date', { length: 100 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  link: varchar('link', { length: 1000 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── KEY JUDGEMENTS ──────────────────────────────────────────────────────────

export const keyJudgements = pgTable('key_judgements', {
  id: serial('id').primaryKey(),
  court: varchar('court', { length: 300 }).notNull(),
  date: varchar('date', { length: 100 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── RESEARCH RESOURCES ──────────────────────────────────────────────────────

export const researchResources = pgTable('research_resources', {
  id: serial('id').primaryKey(),
  tag: varchar('tag', { length: 100 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  fileUrl: varchar('file_url', { length: 1000 }),
  ctaUrl: varchar('cta_url', { length: 1000 }).notNull().default('/contact'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── TEAM MEMBERS ───────────────────────────────────────────────────────────

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  roleTitle: varchar('role_title', { length: 300 }),
  category: varchar('category', { length: 50 }).notNull().default('partner'),
  specialty: varchar('specialty', { length: 300 }),
  focusArea: varchar('focus_area', { length: 300 }),
  shortBio: text('short_bio'),
  longBioSections: jsonb('long_bio_sections'),
  imageUrl: varchar('image_url', { length: 1000 }),
  email: varchar('email', { length: 320 }),
  location: varchar('location', { length: 200 }),
  yearsExperience: varchar('years_experience', { length: 50 }),
  quote: text('quote'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
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
  isPublished: boolean('is_published').notNull().default(true),
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
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  summary: text('summary'),
  bodyContent: text('body_content'),
  body: text('body'),
  contentType: varchar('content_type', { length: 50 }).notNull().default('article'),
  tag: varchar('tag', { length: 100 }),
  category: varchar('category', { length: 100 }),
  authorName: varchar('author_name', { length: 200 }),
  authorRole: varchar('author_role', { length: 200 }),
  authorId: integer('author_id').references(() => teamMembers.id, { onDelete: 'set null' }),
  imageUrl: varchar('image_url', { length: 1000 }),
  fileUrl: varchar('file_url', { length: 1000 }),
  publishedDate: date('published_date'),
  publishedAt: timestamp('published_at'),
  readTime: varchar('read_time', { length: 50 }),
  readTimeMins: integer('read_time_mins').default(5),
  authorityTag: varchar('authority_tag', { length: 100 }),
  courtName: varchar('court_name', { length: 300 }),
  isFeatured: boolean('is_featured').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // Cross-links to related entities
  relatedIndustryId: integer('related_industry_id').references(() => industries.id, { onDelete: 'set null' }),
  relatedPracticeAreaId: integer('related_practice_area_id').references(() => practiceAreas.id, { onDelete: 'set null' }),
});

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: varchar('client_name', { length: 200 }),
  personName: varchar('person_name', { length: 200 }),
  personTitle: varchar('person_title', { length: 300 }),
  clientTitle: varchar('client_title', { length: 300 }),
  companyName: varchar('company_name', { length: 200 }),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull().default(5),
  imageUrl: varchar('image_url', { length: 1000 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── OFFICE LOCATIONS ────────────────────────────────────────────────────────

export const officeLocations = pgTable('office_locations', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }),
  fullAddress: text('full_address'),
  phone: varchar('phone', { length: 100 }),
  email: varchar('email', { length: 320 }),
  isHeadquarters: boolean('is_headquarters').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── FAQS ────────────────────────────────────────────────────────────────────

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }).notNull().default('general'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── HERO SECTIONS ───────────────────────────────────────────────────────────

export const heroSections = pgTable('hero_sections', {
  id: serial('id').primaryKey(),
  pageSlug: varchar('page_slug', { length: 100 }).notNull().unique(),
  eyebrow: varchar('eyebrow', { length: 200 }),
  heading: varchar('heading', { length: 300 }),
  subheading: text('subheading'),
  imageUrl: varchar('image_url', { length: 1000 }),
  cta1Text: varchar('cta1_text', { length: 100 }),
  cta1Href: varchar('cta1_href', { length: 500 }),
  cta2Text: varchar('cta2_text', { length: 100 }),
  cta2Href: varchar('cta2_href', { length: 500 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── STATS METRICS ───────────────────────────────────────────────────────────

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 200 }).notNull(),
  value: integer('value').notNull().default(0),
  suffix: varchar('suffix', { length: 20 }).notNull().default('+'),
  iconName: varchar('icon_name', { length: 100 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── CONTACT SUBMISSIONS ─────────────────────────────────────────────────────

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 200 }),
  serviceInterest: varchar('service_interest', { length: 200 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── NEWSLETTER SUBSCRIBERS ──────────────────────────────────────────────────

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  subscribedAt: timestamp('subscribed_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
  unsubscribedAt: timestamp('unsubscribed_at'),
});


// ─── CAREERS POSITIONS ───────────────────────────────────────────────────────

export const careersPositions = pgTable('careers_positions', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  department: varchar('department', { length: 200 }).notNull().default('Tax Advisory'),
  location: varchar('location', { length: 200 }).notNull().default('London, UK'),
  type: varchar('type', { length: 50 }).notNull().default('Full-time'),
  description: text('description'),
  requirements: text('requirements'),
  applicationUrl: varchar('application_url', { length: 500 }).default('/contact'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── SITE-WIDE CMS TABLES ───────────────────────────────────────────────────

export const sitePages = pgTable('site_pages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const pageSections = pgTable('page_sections', {
  id: serial('id').primaryKey(),
  pageSlug: varchar('page_slug', { length: 200 })
    .notNull()
    .references(() => sitePages.slug, { onDelete: 'cascade' }),
  sectionKey: varchar('section_key', { length: 100 }).notNull(),
  title: varchar('title', { length: 300 }),
  eyebrow: varchar('eyebrow', { length: 200 }),
  subtitle: text('subtitle'),
  bodyContent: text('body_content'),
  imageUrl: varchar('image_url', { length: 1000 }),
  primaryCtaText: varchar('primary_cta_text', { length: 100 }),
  primaryCtaUrl: varchar('primary_cta_url', { length: 500 }),
  secondaryCtaText: varchar('secondary_cta_text', { length: 100 }),
  secondaryCtaUrl: varchar('secondary_cta_url', { length: 500 }),
  content: jsonb('content'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const pageSeo = pgTable('page_seo', {
  id: serial('id').primaryKey(),
  targetType: varchar('target_type', { length: 50 }).notNull(),
  targetIdentifier: varchar('target_identifier', { length: 200 }).notNull(),
  metaTitle: varchar('meta_title', { length: 300 }),
  metaDescription: text('meta_description'),
  canonicalUrl: varchar('canonical_url', { length: 1000 }),
  robots: varchar('robots', { length: 100 }).default('index, follow'),
  ogTitle: varchar('og_title', { length: 300 }),
  ogDescription: text('og_description'),
  ogImage: varchar('og_image', { length: 1000 }),
  twitterCard: varchar('twitter_card', { length: 50 }).default('summary_large_image'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
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
export type IndustryChallenge = typeof industryChallenges.$inferSelect;
export type IndustrySolution = typeof industrySolutions.$inferSelect;
export type IndustrySharedChallenge = typeof industrySharedChallenges.$inferSelect;
export type RegulatoryUpdate = typeof regulatoryUpdates.$inferSelect;
export type KeyJudgement = typeof keyJudgements.$inferSelect;
export type ResearchResource = typeof researchResources.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type OfficeLocation = typeof officeLocations.$inferSelect;
export type HeroSection = typeof heroSections.$inferSelect;
export type NavItem = typeof navItems.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type CareersPosition = typeof careersPositions.$inferSelect;
export type SitePage = typeof sitePages.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;
export type PageSeo = typeof pageSeo.$inferSelect;
export type Stat = typeof stats.$inferSelect;
