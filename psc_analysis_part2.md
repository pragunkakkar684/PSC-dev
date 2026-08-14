# PSC Global — Frontend Analysis Report (Part 2/2)
**Sections 8–19 + Critical Findings**

---

# 8. Admin CMS Requirements

## Must-Have (based on actual frontend)
1. **CRUD for Team Members** — Create/edit/delete all people. Upload headshots. Publish control.
2. **CRUD for Events** — Full event lifecycle: create, set date/time/type/location, add agenda items, assign speakers, publish, archive.
3. **CRUD for Insights Articles** — All 4 content types (articles, regulatory updates, judgements, research). Rich text body. PDF upload. Featured flag. Publish workflow.
4. **Edit Office Locations** — Update address/phone/email per office.
5. **Edit FAQs** — Add/edit/delete/reorder. Tagged by page context.
6. **View Contact Form Submissions** — List view, status tracking (new/read/responded/archived), export.
7. **View Newsletter Subscribers** — List, export, deactivate.
8. **Edit Hero Sections** — Per-page heading, subheading, image, CTAs.
9. **Edit Stats Bar** — Update numbers and labels without code deploy.
10. **Media Upload** — Upload images (headshots, heroes, article covers) and PDFs (research, agendas).

## Probably-Needed
11. **Edit Navigation** — Nav labels, links, ordering, sub-links.
12. **Edit Testimonials** — Add/edit/remove/reorder client quotes.
13. **Edit Practice Areas** — Descriptions and sub-service lists.
14. **Edit Industries** — Add/remove industries, descriptions.
15. **Edit Company Timeline** — Add/edit/delete LegacyScroll milestones.
16. **Edit Footer Content** — Tagline, copyright, link groups.
17. **Draft/Publish Workflow** — For articles and events.
18. **SEO Fields Per Page/Article** — Title tag, meta description, OG image.
19. **Partner Profile Management** — Dynamic pages for each team member.

## Not Currently Required
- Multi-role user management beyond admin/editor
- Multilingual content
- Scheduled publishing
- Page builder / visual editor
- Analytics dashboard
- E-commerce / payments

---

# 9. Frontend → CMS Mapping

| Frontend Section | File | CMS Entity | API Endpoint |
|---|---|---|---|
| Hero section | `Hero.tsx` | `hero_sections` | `GET /api/hero` |
| Stats bar | `Stats.tsx` | `stats` | `GET /api/stats` |
| Practice Areas grid | `PracticeAreas.tsx` | `practice_areas` | `GET /api/practice-areas` |
| Sectors grid | `Sectors.tsx` | `industries` | `GET /api/industries?sectors=true` |
| Featured insights | `Insights.tsx` | `insights_articles` | `GET /api/insights?featured=true&limit=3` |
| Testimonials | `Testimonial.tsx` | `testimonials` | `GET /api/testimonials` |
| Home team | `Team.tsx` | `team_members` | `GET /api/team?category=leadership&limit=3` |
| Contact CTA | `Contact.tsx` | `hero_sections` | `GET /api/cta/home` |
| Navigation | `SiteHeader.tsx` | `nav_items` + `practice_areas` + `industries` | `GET /api/navigation` |
| Footer | `Footer.tsx` | `nav_items` + `site_settings` | `GET /api/footer` |
| Legacy timeline | `LegacyScroll.tsx` | `legacy_timeline` | `GET /api/timeline` |
| About page (all) | `about/page.tsx` | `hero_sections` + `legacy_timeline` + `team_members` + `stats` + `faqs` | `GET /api/pages/about` |
| Contact page + form | `contact/page.tsx` | `contact_submissions` + `office_locations` + `faqs` | `GET /api/pages/contact`, `POST /api/contact` |
| Events page | `event/page.tsx` | `events` + `event_agenda_items` + `team_members` | `GET /api/events?status=upcoming`, `GET /api/events?featured=true` |
| GCC page | `gcc/page.tsx` | `faqs?context=gcc` + `stats?context=gcc` | `GET /api/pages/gcc` |
| Industries page | `industries/page.tsx` | `industries` + `team_members` + `insights_articles` | `GET /api/industries`, `GET /api/team` |
| Insights page | `insights/page.tsx` | `insights_articles` (all types) | `GET /api/insights?type=article`, `GET /api/insights?type=regulatory_update`, etc. |
| Partner profile | `partner/page.tsx` | `team_members` + `team_member_expertise` | `GET /api/team/[slug]` |
| Practice areas page | `practice-areas/page.tsx` | `practice_areas` + `practice_area_services` + `stats` | `GET /api/practice-areas?include=services` |
| Team page | `team/page.tsx` | `team_members` (all categories) | `GET /api/team` |
| Newsletter signup | `Footer.tsx` | `newsletter_subscribers` | `POST /api/newsletter/subscribe` |

---

# 10. Forms & User Data

## Form 1: Contact / Consultation Form
- **Page:** `/contact` (contact/page.tsx L161–199)
- **Fields:** Full Name, Company, Business Email, Phone (optional), Practice Area (select), Message
- **Validation:** NONE — no `required` attrs, no JS validation, no `onSubmit` handler
- **Form element** has NO `action`, NO `onSubmit` — **form does absolutely nothing**
- **Store in DB:** Yes → `contact_submissions`
- **Admin visibility:** Yes — must view/track/export submissions

## Form 2: Newsletter Subscription
- **Page:** All pages (Footer.tsx)
- **Fields:** Email address only
- **Validation:** None
- **Submission:** `onSubmit={e => e.preventDefault()}` — **explicitly blocked**
- **Store in DB:** Yes → `newsletter_subscribers`
- **Admin visibility:** Yes

---

# 11. Media/File Requirements

## Current State: 100% External Unsplash URLs
All ~60+ images are Unsplash external URLs. No local assets in `/public` beyond default Next.js SVGs. No actual PDFs anywhere (download buttons go to `#contact`).

**No Next.js `<Image>` component used anywhere** — only HTML `<img>` tags. No `next.config.ts` image domain configuration.

## What CMS Must Manage
1. **Team headshots** — Per-person, ~15–25 images
2. **Hero/banner images** — Per-page backgrounds, ≥1600px wide
3. **Article cover images** — Per insight article
4. **Event listing images** — Archive and featured events
5. **Page section images** — About, Industries, Team, GCC editorial images
6. **PDF documents** — Research publications (4 on insights page), Event agendas (1 on events page)

## Storage Requirements (decision not made)
- Option A: Vercel Blob (easiest for Next.js/Vercel deployment)
- Option B: Cloudflare R2, AWS S3, Cloudinary
- Option C: Supabase Storage (if using Supabase Postgres)
- Local `/public` not viable at scale
- Must configure `next.config.ts` `images.remotePatterns` for whichever provider is chosen

## Map Placeholder
`contact/page.tsx` L115: `[PREMIUM ILLUSTRATED MAP PLACEHOLDER]` — vendor decision needed (Google Maps, Mapbox, custom SVG).

---

# 12. Authentication & Roles

## Existing: NONE
- No login pages, no session handling, no JWT, no cookies
- No `middleware.ts`, no `process.env` references anywhere
- "Client Portal" nav item exists with `href="#"` — entirely unimplemented

## What Must Be Added for CMS
- **Admin login:** `/admin/login` page
- **Session management:** NextAuth.js v5 (Auth.js) recommended for App Router compatibility
- **Route protection:** `middleware.ts` protecting all `/admin/*` routes
- **Roles:** `admin` (full access) and `editor` (content CRUD only, no user management)

## Client Portal
Nav item implies future client-facing protected area. **No content or spec exists.** Treat as out-of-scope for this CMS project.

---

# 13. SEO Requirements

## Current State
From `app/layout.tsx` (L5):
```typescript
export const metadata: Metadata = { title: 'Advisory Global', description: 'Strategic business advisory' }
```
**Single global metadata applied to all 10 pages.** No per-page metadata exports. No Open Graph. No Twitter cards. No canonical URLs. No structured data. No sitemap. No robots.txt. No `generateMetadata` functions anywhere.

## Per-Page Status
All 10 routes have `h1` elements (except home, which has no `h1` at all in the assembler). None have individual `metadata` exports.

## Should Become CMS-Controlled
| SEO Field | CMS? | Notes |
|---|---|---|
| Page title | Yes | Per-page/per-article |
| Meta description | Yes | Per-page unique |
| Open Graph title/description | Yes | For social sharing |
| Open Graph image | Yes | Article/hero image |
| Article slug | Yes | Unique URL identifier |
| Sitemap | Auto-generated | From DB published records |
| Canonical URL | Auto-derived | From route slug |
| Robots.txt | Static file | No CMS needed |
| Twitter card type | Hardcoded | In layout.tsx |
| JSON-LD (Organization/Event/Person) | Optional | Future enhancement |

---

# 14. Required API Operations

## Public APIs (no auth)
```
GET  /api/navigation
GET  /api/hero
GET  /api/stats
GET  /api/practice-areas
GET  /api/practice-areas/[slug]
GET  /api/industries
GET  /api/insights
GET  /api/insights/[slug]
GET  /api/insights?type=article|regulatory_update|judgement|research
GET  /api/insights?featured=true
GET  /api/team
GET  /api/team/[slug]
GET  /api/team?category=leadership|partner|mentor
GET  /api/events
GET  /api/events/[slug]
GET  /api/events?status=upcoming|past
GET  /api/events?featured=true
GET  /api/timeline
GET  /api/testimonials
GET  /api/offices
GET  /api/faqs?context=contact|gcc
GET  /api/footer
POST /api/contact           — submit consultation form
POST /api/newsletter/subscribe
POST /api/newsletter/unsubscribe
```

## Admin-Only APIs (auth required)
```
# Team Members
GET/POST        /api/admin/team
GET/PUT/DELETE  /api/admin/team/[id]

# Events + nested resources
GET/POST        /api/admin/events
GET/PUT/DELETE  /api/admin/events/[id]
GET/POST/DELETE /api/admin/events/[id]/agenda
GET/POST/DELETE /api/admin/events/[id]/speakers

# Insights
GET/POST        /api/admin/insights
GET/PUT/DELETE  /api/admin/insights/[id]

# Contact submissions (read-only)
GET             /api/admin/submissions
GET/PATCH       /api/admin/submissions/[id]    # update status

# Newsletter
GET             /api/admin/newsletter
DELETE          /api/admin/newsletter/[id]

# Site settings & content
GET/PUT         /api/admin/settings
GET/PUT         /api/admin/heroes/[page_slug]
GET/POST/PUT/DELETE /api/admin/offices
GET/POST/PUT/DELETE /api/admin/faqs
GET/POST/PUT/DELETE /api/admin/testimonials
GET/POST/PUT/DELETE /api/admin/timeline
GET/POST/PUT/DELETE /api/admin/practice-areas
GET/POST/PUT/DELETE /api/admin/industries
PUT             /api/admin/navigation

# Media
POST            /api/admin/media/upload
DELETE          /api/admin/media/[id]
```

---

# 15. Hardcoded Content That Should Move to CMS

## Definitely Move to Database
| Content | Location |
|---|---|
| All team member data | 6 files, inconsistent schemas |
| All event data | event/page.tsx — time-sensitive |
| All insights/articles | insights/page.tsx, Insights.tsx |
| Office details (address/phone/email) | contact/page.tsx, about/page.tsx |
| All FAQs | contact/page.tsx, gcc/page.tsx |
| Hero content for all pages | 10 hardcoded locations |
| All statistics | Stats.tsx, PracticeAreas.tsx, practice-areas/page.tsx, gcc/page.tsx |
| Legacy timeline | LegacyScroll.tsx |
| Practice area descriptions and sub-services | SiteHeader + 2 pages |
| Industry descriptions | SiteHeader + 2 pages |
| Testimonials | Testimonial.tsx + Insights.tsx (2 separate quotes) |
| All Unsplash image URLs | Everywhere — must be replaced with real photography |
| Partner profile content | partner/page.tsx — single hardcoded person |
| Footer links and copy | Footer.tsx |
| Certifications and awards | about/page.tsx |

## Could Remain Hardcoded
- CSS color palette tokens (`--color-ink`, `--color-navy`, `--color-pale`)
- Font imports in globals.css
- Animation keyframes
- Tailwind utility class strings on layout elements
- LegacyScroll animation/scroll logic
- SiteHeader mega menu layout logic (not content)

## Should Be Environment Variables
| Content | Reason |
|---|---|
| Company email addresses | PII — must not be in source code |
| Company phone numbers | Operational data |
| Database connection string | Security |

## Should Be Derived/Computed
| Content | Reason |
|---|---|
| Copyright year ("2026") | Should be `new Date().getFullYear()` |
| Event status (past/upcoming) | Computed from `events.date` vs now |
| Insights filter tabs | Dynamic from `insights_articles.content_type` distinct values |
| Published date display | Formatted from stored timestamp |

## Unsure — Needs Clarification
| Content | Why Unsure |
|---|---|
| `PRACTICE_COLUMNS` in SiteHeader | Derive from practice_areas table or separate nav entity? |
| Insights mega menu "Spotlight Event" | Should auto-link to `events WHERE is_featured=true` — currently disconnected |
| GCC stats (1,500+ global centers; 1.3M STEM graduates) | Industry statistics, not PSC's own — admin-managed or editorial fact? |
| Map placeholder | Vendor decision needed |

---

# 16. Risks & Technical Issues

## RISK 1 — Tightly Coupled Content & Presentation (HIGH)
All data lives inside JSX render functions as module-level constants. Zero abstraction. Converting to API-driven requires rewriting every component's data flow. Icon imports in arrays (e.g., `[Clock, '22+', 'YEARS']`) cannot come from a database without an icon mapping utility.

## RISK 2 — Inconsistent People Data (HIGH)
Same people across 6 files with different array field positions and different role titles. No single canonical definition. Full manual reconciliation required when building `team_members` DB.

## RISK 3 — No Dynamic Routing for Profiles (HIGH)
`/partner` is one static page hardcoded to one person. No `/partner/[slug]`. All "VIEW PROFILE" links on the team page go to `#contact`, not actual profiles. Implementing dynamic partner profiles is a new feature, not just a data migration.

## RISK 4 — No Next.js `<Image>` Component (MEDIUM)
All 60+ images use HTML `<img>`. No lazy loading, no optimization, no `sizes`. Some have `alt=""` (accessibility violation). Switching to `<Image>` requires configuring `next.config.ts` `images.remotePatterns` for the storage provider.

## RISK 5 — All Navigation Links Are `href="#"` (MEDIUM)
Every single nav link in `SiteHeader.tsx` uses `href="#"` with `onClick={e => e.preventDefault()}`. Pages are not linked to each other via the nav. This must be fixed (replace with actual routes) before CMS integration.

## RISK 6 — SiteHeader Has 270+ Lines Embedded CSS (LOW-MEDIUM)
A separate `<style>` block in `SiteHeader.tsx` imports Fraunces/Inter fonts (separate from globals.css Manrope/Playfair Display). Two competing design systems. Performance concern; this is a `'use client'` component.

## RISK 7 — Founding Year Inconsistency (LOW)
- LegacyScroll + practice-areas page: "2002" / "EST. 2002"
- contact/page.tsx L111: "since 1988"
Brand integrity issue — must be resolved before content entry.

## RISK 8 — Contact Form Completely Non-Functional (MEDIUM)
No `onSubmit`, no `action`, no `required` attrs, no validation. Must add all client-side validation and server-side endpoint simultaneously.

## RISK 9 — Fictional Data Throughout (LOW)
All team members, testimonials, company dates are fictional placeholders. Full content entry exercise required pre-launch.

## RISK 10 — Insights Mega Menu Spotlight Disconnected (LOW)
Hardcoded "October 24, 2026 — London" spotlight event in SiteHeader has zero connection to the events database. Must auto-populate from `events WHERE is_featured=true`.

## RISK 11 — No Error Pages (LOW)
No `not-found.tsx`, `error.tsx`, `loading.tsx`. Once dynamic routes and API calls exist, uncaught errors will produce blank/broken pages.

## RISK 12 — Client Components Must Receive Data as Props (LOW)
`SiteHeader`, `Footer`, and `LegacyScroll` are `'use client'` components. They cannot be async Server Components. Their data must be fetched by parent Server Components and passed as props — they must NOT use `useEffect` + `fetch` for CMS data.

---

# 17. Recommended Architecture

## Stack
- **Frontend pages:** Next.js 16 App Router — async Server Components fetch from DB
- **API:** Next.js API Routes (`/api/*`) for public endpoints + Server Actions for admin mutations
- **Database:** PostgreSQL via Neon (serverless, Vercel-compatible) or Supabase
- **ORM:** Drizzle ORM (lightweight, type-safe, excellent App Router support)
- **Auth:** NextAuth.js v5 (Auth.js) for admin authentication
- **Validation:** Zod + react-hook-form on all forms
- **Media storage:** Vercel Blob (simplest) or Cloudflare R2

## Architecture Pattern
```
app/
├── (public)/           # Public routes — async Server Components
│   ├── page.tsx        # fetch hero, stats, team, insights, testimonials, timeline
│   ├── about/page.tsx  # fetch about hero, timeline, team, offices, awards
│   ├── contact/page.tsx # fetch offices, faqs, leaders
│   └── ...
├── admin/              # Protected CMS routes
│   ├── login/page.tsx
│   ├── team/page.tsx
│   ├── events/page.tsx
│   ├── insights/page.tsx
│   └── ...
├── api/                # Route Handlers
│   ├── navigation/route.ts
│   ├── hero/route.ts
│   ├── team/route.ts
│   ├── events/route.ts
│   ├── insights/route.ts
│   ├── contact/route.ts    # POST — save to contact_submissions
│   ├── newsletter/route.ts # POST — save subscriber
│   └── admin/             # Auth-protected admin API routes
└── middleware.ts       # Protect /admin/* routes
```

## Key Integration Patterns

### Server Components fetch data, pass as props to client components
```tsx
// app/page.tsx (Server Component — async)
import { db } from '@/lib/db'
import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'

export default async function Home() {
  const [navData, heroData, statsData, teamData] = await Promise.all([
    db.query.navItems.findMany({ where: eq(navItems.isActive, true), orderBy: asc(navItems.sortOrder) }),
    db.query.heroSections.findFirst({ where: eq(heroSections.pageSlug, 'home') }),
    db.query.stats.findMany({ where: and(eq(stats.context, 'global'), eq(stats.isPublished, true)), orderBy: asc(stats.sortOrder) }),
    db.query.teamMembers.findMany({ where: and(eq(teamMembers.category, 'leadership'), eq(teamMembers.isPublished, true)), limit: 3 }),
  ])
  return <main>
    <SiteHeader data={navData} />   {/* passes nav data as prop */}
    <Hero data={heroData} />
    <Stats data={statsData} />
    <Team data={teamData} />
  </main>
}
```

### Icon mapping utility (replaces icon components in arrays)
```typescript
// lib/iconMap.ts
import { Clock, Users, Globe2, CheckCircle2, Shield, Landmark, Scale, TrendingUp, Share2 } from 'lucide-react'
export const iconMap = { Clock, Users, Globe2, CheckCircle2, Shield, Landmark, Scale, TrendingUp, Share2 }
export type IconName = keyof typeof iconMap
```

### Preserving existing design
- All Tailwind classes and layout structures stay identical
- Only the data source changes (const arrays → DB queries)
- SiteHeader's inline CSS stays until refactored separately
- No visual changes required

## Publishing Model
- `is_published: boolean` on all content entities
- Public API routes always filter `WHERE is_published = true`
- Admin API routes return all records
- Optional future enhancement: `published_at` timestamp for scheduling

---

# 18. Open Questions / Clarification Needed

1. **Founding year:** 2002 (timeline, practice-areas page) vs "since 1988" (contact page) — which is correct?
2. **Company name:** "PSC Global" (header/most pages) vs "Advisory Global" (layout title) vs "Advisory Global Firm" (footer copyright) — what is the correct legal/brand name?
3. **Client Portal:** What is the scope? Document portal? Meeting scheduler? Out of scope for CMS?
4. **Real team members:** Will actual staff data be provided? Timeline?
5. **Events registration:** Through contact form, external tool (Eventbrite/Zoom), or custom form?
6. **Real photography:** Will actual photography be provided? Who is responsible?
7. **Map integration:** Google Maps? Mapbox? Custom SVG for the contact page placeholder?
8. **Article body content:** Rich text editor (Tiptap/Lexical) or link to external PDFs?
9. **Regulatory updates targeting:** SEBI, GST, FEMA, RBI suggest India-specific — global scope?
10. **Partner profile routing:** `/partner/[slug]` or `/team/[slug]`? How many members get full profiles?
11. **Navigation links:** Should all nav items link to their corresponding actual pages?
12. **Newsletter service:** Mailchimp? Resend? Sendgrid? Internal only?
13. **Image alt text enforcement:** Should be a required CMS field for accessibility.
14. **Insights filter tabs:** Client-side JS filtering or server-side URL params (`?type=articles`)?
15. **Social media links:** No social links anywhere — will LinkedIn/Twitter be added?

---

# 19. Suggested Implementation Order

## Phase 0: Prerequisites (before CMS work)
1. Fix all `href="#"` in SiteHeader — wire to actual routes
2. Create `app/partner/[slug]/page.tsx` dynamic route
3. Add per-page `metadata` exports (static values to start)
4. Resolve company name and founding year inconsistency
5. Configure `next.config.ts` image remotePatterns

## Phase 1: Foundation
6. Set up PostgreSQL (Neon/Supabase)
7. Install Drizzle ORM, define schemas, run migrations
8. Set up NextAuth.js v5 admin authentication
9. Create `/admin/login` + middleware protecting `/admin/*`

## Phase 2: Core Content (highest business value)
10. Team Members CRUD admin + `GET /api/team` + `GET /api/team/[slug]`
11. Events CRUD admin + `GET /api/events` + agenda/speakers sub-resources
12. Insights CRUD admin + `GET /api/insights` (all types)
13. Media upload system (storage provider + `/api/admin/media/upload`)

## Phase 3: Connect Frontend
14. Home page → async Server Component (hero, stats, team, insights, testimonials, timeline)
15. About page → async Server Component
16. Team page → async Server Component + working `/partner/[slug]`
17. Events page → async Server Component
18. Insights page → async Server Component + working filter tabs
19. Contact page → connect form to `POST /api/contact`

## Phase 4: Remaining Pages + Admin
20. Industries, Practice Areas, GCC, Partner pages
21. Newsletter form → `POST /api/newsletter/subscribe`
22. Office Locations CRUD, FAQs CRUD, Hero Sections CRUD
23. Testimonials CRUD, Navigation management
24. Contact Submissions viewer, Newsletter Subscribers viewer

## Phase 5: SEO & Performance
25. `generateMetadata` per page/article
26. `app/sitemap.ts` (auto-generated from DB)
27. `app/robots.ts`
28. Replace `<img>` with Next.js `<Image>` site-wide
29. Open Graph / Twitter card metadata
30. JSON-LD structured data (Organization, Event schemas)

---

## Critical Findings (Top 20)

1. **Zero backend exists.** No API, no DB, no auth, no env vars. True greenfield backend in an existing frontend shell.

2. **ALL content is hardcoded** as raw arrays inside component/page files. Every single piece of displayed text and every image URL must be extracted and migrated.

3. **People data is the most critical inconsistency.** Same fictional people appear across 6+ files with different field orders and different role titles. The `team_members` table must be a single canonical source; ALL 6 files must be refactored to consume from it.

4. **Icon components are embedded in data arrays** (e.g., `[Clock, '22+', 'YEARS']`). Moving to DB requires an icon mapping utility layer on the frontend.

5. **Events are the most time-sensitive content.** Featured event, agenda items, speakers, upcoming, and archive all need DB backing. Should be CMS-managed before any other content.

6. **The contact form is completely non-functional.** No `onSubmit` handler, no `action`, no validation, no `required` attributes. Building this endpoint is Day 1 for lead capture.

7. **The newsletter form is explicitly disabled** (`onSubmit={e => e.preventDefault()}`). Same priority as contact form.

8. **Only ONE partner profile page exists** (`/partner`) hardcoded to Dr. Julian Vance. Dynamic routing (`/partner/[slug]`) is a new feature that must be designed and built.

9. **All 60+ images are external Unsplash URLs.** Real photography must be sourced, uploaded, and linked from CMS before launch. No image optimization pipeline exists.

10. **Company name and founding year are inconsistent** across the codebase. Must be resolved before content entry begins.

11. **Navigation links all point to `href="#"`** — the 10 existing pages are not linked to each other. The nav is purely visual/non-functional.

12. **No TypeScript types or interfaces defined** for any content. Type safety must be introduced as part of DB integration to prevent runtime shape errors.

13. **`SiteHeader.tsx` has 270+ lines of embedded CSS** with its own separate Google Fonts import (Fraunces/Inter), separate from the globals.css design system (Manrope/Playfair Display). Two competing font stacks.

14. **Testimonials has a 2-dot carousel indicator** suggesting multiple quotes were planned. Only 1 is hardcoded. DB should support multiple with ordering. Note: there are also TWO separate testimonial quotes — one in `Testimonial.tsx`, one inline in `Insights.tsx`.

15. **Insights filter tabs are non-functional** — no JavaScript filtering exists. Need to implement either client-side or URL-param server-side filtering.

16. **No SEO metadata beyond a single global title/description.** Every page needs its own `generateMetadata` before launch. Home page has no `h1` at all.

17. **The `[PREMIUM ILLUSTRATED MAP PLACEHOLDER]`** on the contact page signals an unresolved vendor decision (Google Maps, Mapbox, static SVG).

18. **The Insights mega menu Spotlight Event** is hardcoded completely separately from the events system. After CMS integration, it must auto-pull from `events WHERE is_featured = true`.

19. **The GCC page is India-market-specific** (references SEBI, GST, FEMA, RBI, CBDT — all Indian regulators). The overall brand presents as global advisory but has India-specific regulatory content. Scope clarification needed.

20. **`LegacyScroll` is `'use client'` and uses scroll events.** It cannot fetch its own data with async/await. Its parent Server Component must fetch `legacy_timeline` records and pass them as props. This is the integration pattern required for ALL three client components (SiteHeader, Footer, LegacyScroll).
