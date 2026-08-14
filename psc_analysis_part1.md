# PSC Global — Frontend Analysis Report (Part 1/2)
**For CMS/Backend Design (Next.js + PostgreSQL)**
*Analysis Date: 2026-08-14*

---

# 1. Executive Summary

PSC Global is a multi-page Next.js 16 website for a professional advisory firm. The entire codebase is a **pure frontend with zero backend connectivity** — no API calls, no authentication, no database queries, no environment variables. Every piece of content is hardcoded directly in TSX files as local constant arrays.

The site has **10 distinct routes**: Home, About, Contact, Events, GCC, Industries, Insights, Partner Profile, Practice Areas, and Team. All pages share a common `SiteHeader` and `Footer`.

**Key findings:**
- ~200+ individual content strings are hardcoded across 10 pages
- 4 distinct types of people data (Leadership, Partners, Mentors, Speakers) exist with inconsistent field shapes across pages
- The `contact/page.tsx` has a fully-built HTML form with NO submit handler or API connection
- The `Footer.tsx` has a newsletter email form explicitly blocked: `onSubmit={e => e.preventDefault()}`
- All nav links use `href="#"` — no real routing between pages exists yet
- All images come from Unsplash external URLs — no local media or CMS
- No environment variables, no `.env` file, no auth logic whatsoever

---

# 2. Technology & Project Structure

| Technology | Version |
|---|---|
| Next.js | 16.2.12 (App Router) |
| React | 19.2.4 |
| TypeScript | ^5 |
| Tailwind CSS | ^4.3.3 (via @tailwindcss/postcss) |
| lucide-react | ^1.28.0 |

**Routing:** Next.js App Router (app/ directory). No dynamic routes [slug], no API routes, no Server Actions, no middleware yet.

## File Structure

```
PSC-dev/
├── app/
│   ├── layout.tsx              # Root layout — single global metadata (title: 'Advisory Global')
│   ├── page.tsx                # Home page — assembles all homepage sections
│   ├── globals.css             # Google Fonts (Manrope, Playfair Display, DM Mono), Tailwind @theme tokens
│   ├── components/
│   │   ├── SiteHeader.tsx      # 'use client' — sticky nav + mega menus; all href="#"; 270+ lines inline CSS
│   │   ├── Hero.tsx            # Homepage hero — hardcoded h1, subtitle, 2 CTAs, Unsplash bg
│   │   ├── Stats.tsx           # 4 hardcoded stat tiles (22+ years, 1000+ professionals, etc.)
│   │   ├── PracticeAreas.tsx   # 5-card grid — hardcoded areas array
│   │   ├── Sectors.tsx         # 4-card image grid — hardcoded sectors with Unsplash URLs
│   │   ├── Insights.tsx        # 1 featured + 2 sidebar articles + inline testimonial quote
│   │   ├── Team.tsx            # 3 hardcoded leaders; carousel prev/next buttons non-functional
│   │   ├── About.tsx           # "Why PSC" advantages + 4 stat tiles
│   │   ├── Testimonial.tsx     # Single hardcoded quote; 2-dot indicator non-functional
│   │   ├── Contact.tsx         # CTA banner (link only, no form)
│   │   ├── Footer.tsx          # 'use client' — nav links + newsletter form (submit blocked)
│   │   └── LegacyScroll.tsx    # 'use client' — scroll-driven horizontal timeline animation
│   ├── about/page.tsx          # /about
│   ├── contact/page.tsx        # /contact — has real HTML form (no handler)
│   ├── event/page.tsx          # /event (note: singular)
│   ├── gcc/page.tsx            # /gcc — Global Capability Center
│   ├── industries/page.tsx     # /industries
│   ├── insights/page.tsx       # /insights
│   ├── partner/page.tsx        # /partner — SINGLE hardcoded profile (Dr. Julian Vance)
│   ├── practice-areas/page.tsx # /practice-areas
│   └── team/page.tsx           # /team
├── public/                     # Only default Next.js SVGs — no real assets
├── next.config.ts              # Empty config (no remotePatterns, no custom domains)
└── tsconfig.json               # strict: true
```

**No custom hooks, no utility functions, no lib/ directory, no types/ directory, no data/ directory.**
**No TypeScript interfaces defined** — all data typed implicitly via tuple destructuring.

---

# 3. Complete Route Inventory

## Route 1: `/` — Home Page
- **Components:** SiteHeader, Hero, Stats, PracticeAreas, Sectors, Insights, Team, About, Testimonial, Contact, Footer
- **All data hardcoded.** Hero text, 4 stats, 5 practice areas, 4 sectors, 3 insight articles, 3 team members, 1 testimonial
- **No user inputs.** Contact banner is a link, not a form.
- **CMS-managed:** Yes — all sections

## Route 2: `/about`
- **Components:** SiteHeader, Footer, LegacyScroll
- **All data hardcoded:** hero image, "Who We Are" copy, 8-item timeline, 5 values, 3 "Why PSC" cards, 4 awards, 4 certifications, 4 offices (name only), 4 leaders
- **Images:** 3 Unsplash page images + 4 headshots

## Route 3: `/contact`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** 4 contact routes, 4 office listings (city/address/phone/email), 3 trust points, 4 process steps, 3 leader cards, 4 FAQs
- **USER INPUT: Contact form** — Full Name, Company, Business Email, Phone (optional), Practice Area (select), Message
  - **NO `onSubmit` handler. NO `action` attribute. Form does nothing.**
  - No HTML `required` attributes on any field.

## Route 4: `/event`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** Featured event (type/date/time/platform/description), 5 agenda items, 4 speakers, 3 upcoming events, 2 archived events
- Events are the most time-sensitive content — must move to CMS first

## Route 5: `/gcc`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** hero, 3 complexity cards, 2 India stats, 2 GCC services (Finance&Accounting; Tax/Legal), 3 FAQs

## Route 6: `/industries`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** 12 industries with descriptions, 3 expert people, 8 challenge tags, 3 approach steps, 2 synergy cards, 3 perspectives articles, 3 business advice points

## Route 7: `/insights`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** 5 filter tabs (non-functional), 3 articles, 4 regulatory updates, 3 key judgements, 4 research publications, 4 support services
- **"DOWNLOAD PDF" buttons** link to `#contact` — no actual PDFs

## Route 8: `/partner` — ⚠️ SINGLE HARDCODED PROFILE
- **Components:** SiteHeader, Footer
- Entire page is hardcoded to Dr. Julian Vance. No dynamic routing.
- **Must become `/partner/[slug]` for CMS**

## Route 9: `/practice-areas`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** 5 practice areas (header only), detailed sections for Risk&Assurance and Tax&Fiscal, 3 connected model cards, 3 GCC features, 3 case scenarios, 4 stats

## Route 10: `/team`
- **Components:** SiteHeader, Footer
- **All data hardcoded:** 4 philosophy points, 4 leadership, 3 partners, 2 mentors, 3 disciplines, 3 closing points
- Full-bleed hero image (Unsplash)

---

# 4. Frontend Component/Data Architecture

## Data Pattern (universal across all files)
```typescript
// ALL data follows this pattern:
const leaders = [
  ['Name', 'ROLE', 'bio text', 'image_url'],
  ...
] as const;
{leaders.map(([name, role, bio, image]) => ( ... ))}
```
**No TypeScript interfaces, types, or Zod schemas anywhere.**

## People Data Inconsistency (CRITICAL)
Same people appear across 6+ files with different array field orders and different role titles:

| File | Array shape |
|---|---|
| `Team.tsx` (home) | `[image, name, role, bio]` |
| `about/page.tsx` | `[name, role, bio, image]` |
| `contact/page.tsx` | `[name, role, focus_area, image]` |
| `event/page.tsx` | `[name, role, image]` |
| `industries/page.tsx` | `[name, role, bio, image]` |
| `team/page.tsx` leadership | `[name, role, image]` (no bio) |
| `team/page.tsx` partners | `[name, role, focus, image]` |
| `team/page.tsx` mentors | `[name, role, bio, image]` |
| `partner/page.tsx` | Custom inline (no array) |

Dr. Julian Vance title: "MANAGING PARTNER" (home Team.tsx) vs "Founder & CEO / Senior Partner" (partner page) vs "FOUNDER & CEO" (team page).

## Icon-in-Array Problem
Several data arrays embed React component references:
```typescript
const stats = [
  [Clock, '22+', 'YEARS OF EXPERIENCE'],  // Clock is an imported component
  [Users, '1,000+', 'GLOBAL PROFESSIONALS'],
]
```
When data moves to DB, icons become strings — a frontend icon mapping utility is required.

---

# 5. CMS-Managed Content Inventory (Summary)

All content across ALL 10 pages is hardcoded. Key items by category:

**Navigation:** NAV (8 items), ABOUT_LINKS (8), TEAM_LINKS (3), PRACTICE_COLUMNS (5 cols×4 items), INDUSTRY_COLUMNS (3 cols×4 items), INSIGHTS_COLUMNS (2 cols×3 items), footerLinks, legalLinks, spotlight event in mega menu

**Homepage:** Hero (eyebrow, h1, subtitle, bg_image, 2 CTAs), Stats (4 items), Practice Areas (5 cards), Sectors (4 cards+images), Insights (1 featured + 2 sidebar articles + 1 inline quote), Team (3 members), About (3 advantages + 4 stat tiles), Testimonial (1 quote, 2-dot carousel non-functional), Contact CTA banner

**About page:** Hero, "Who We Are" copy, Timeline (8 milestones), Values (5), Why Choose (3), Awards (4), Certifications (4), Offices (4 name-only), Leaders (4 with headshots)

**Contact page:** Contact routes (4), Offices (4 with full address/phone/email), Trust points (3), Process steps (4), Leader cards (3), FAQs (4), Map placeholder

**Events page:** Featured event + agenda (5 items) + speakers (4) + upcoming (3) + archive (2) + related readings (3) + related practices (4)

**GCC page:** Complexity cards (3), India stats (2), Services (2 with images), FAQs (3)

**Industries page:** Industries (12), Experts (3), Challenges (8), Approach (3), Synergies (2), Perspectives (3), Business advice (3)

**Insights page:** Filter tabs (5, non-functional), Articles (3), Regulatory updates (4), Judgements (3), Research (4), Support services (4)

**Partner page:** Full profile (Dr. Julian Vance only) — name, title, location, years, bio (4 paragraphs), expertise (6 areas)

**Practice areas page:** Areas overview (5), Risk&Assurance detail, Tax detail, Connected model (3), GCC features (3), Scenarios (3), Stats (4)

**Team page:** Philosophy (4), Leadership (4), Partners (3), Mentors (2), Disciplines (3), Closing (3)

---

# 6. Proposed PostgreSQL Entities

## 1. `site_settings` (singleton)
| Field | Type |
|---|---|
| id | integer PK (always 1) |
| site_name | varchar(100) |
| tagline | text |
| footer_description | text |
| copyright_text | varchar(200) |
| contact_email_general | varchar(200) |
| updated_at | timestamp |

## 2. `nav_items`
| Field | Type |
|---|---|
| id | serial PK |
| label | varchar(100) |
| href | varchar(500) |
| menu_key | varchar(50) — null/"about"/"team"/"practice"/"industries"/"insights" |
| menu_type | varchar(20) — "narrow"/"full"/null |
| sort_order | integer |
| is_active | boolean |

## 3. `practice_areas` + `practice_area_services`
| Field | Type |
|---|---|
| id | serial PK |
| slug | varchar(100) UNIQUE |
| number | varchar(5) — "01"–"05" |
| name | varchar(200) |
| short_description | text |
| long_description | text |
| icon_name | varchar(100) |
| style_class | varchar(200) — Tailwind classes |
| sort_order | integer |
| is_published | boolean |
| created_at, updated_at | timestamp |

`practice_area_services`: id, practice_area_id FK, name, sort_order

## 4. `industries`
| Field | Type |
|---|---|
| id | serial PK |
| slug | varchar(100) UNIQUE |
| name | varchar(200) |
| short_description | text |
| image_url | varchar(1000) |
| sort_order | integer |
| is_published | boolean |
| created_at, updated_at | timestamp |

## 5. `team_members` + `team_member_expertise`
| Field | Type |
|---|---|
| id | serial PK |
| slug | varchar(100) UNIQUE — for /partner/[slug] |
| name | varchar(200) |
| role_title | varchar(300) |
| category | varchar(50) — "leadership"/"partner"/"mentor"/"advisor" |
| focus_area | varchar(300) |
| short_bio | text |
| long_bio_sections | jsonb — array of paragraph groups |
| image_url | varchar(1000) |
| email | varchar(300) |
| location | varchar(200) |
| years_experience | varchar(50) |
| quote | text |
| sort_order | integer |
| is_published | boolean |
| created_at, updated_at | timestamp |

`team_member_expertise`: id, team_member_id FK, icon_name, title, description, sort_order

## 6. `events` + `event_agenda_items` + `event_speakers`
`events`:
| Field | Type |
|---|---|
| id | serial PK |
| slug | varchar(200) UNIQUE |
| event_type | varchar(50) — WEBINAR/SEMINAR/ROUNDTABLE/CONFERENCE |
| title | varchar(500) |
| description | text |
| date | date |
| time_start, time_end | time |
| timezone | varchar(100) |
| location | varchar(300) |
| platform | varchar(200) |
| duration_label | varchar(50) |
| registration_url | varchar(1000) |
| agenda_file_url | varchar(1000) |
| image_url | varchar(1000) |
| is_featured | boolean |
| is_highlighted | boolean |
| is_published | boolean |
| status | varchar(20) — "upcoming"/"past"/"cancelled" |
| created_at, updated_at | timestamp |

`event_agenda_items`: id, event_id FK, time_label, title, description, is_current, sort_order
`event_speakers`: id, event_id FK, team_member_id FK (nullable), external_speaker_name, external_speaker_role, external_speaker_image_url, sort_order

## 7. `insights_articles`
| Field | Type |
|---|---|
| id | serial PK |
| slug | varchar(300) UNIQUE |
| content_type | varchar(50) — "article"/"regulatory_update"/"judgement"/"research"/"webinar" |
| tag | varchar(100) — "TAX POLICY", "SEBI", etc. |
| title | varchar(500) |
| summary | text |
| body | text — markdown or rich text |
| image_url | varchar(1000) |
| file_url | varchar(1000) — for PDF downloads |
| read_time_mins | integer |
| authority_tag | varchar(100) — for regulatory updates (SEBI/GST/FEMA) |
| court_name | varchar(300) — for judgements |
| published_at | timestamp |
| is_featured | boolean |
| is_published | boolean |
| author_id | integer FK → team_members (nullable) |
| created_at, updated_at | timestamp |

## 8. `testimonials`
id, quote, person_name, person_title, company_name, sort_order, is_published, created_at

## 9. `office_locations`
id, city, full_address, phone, email, is_headquarters, sort_order, is_published

## 10. `faqs`
id, question, answer, page_context (varchar 100 — "contact"/"gcc"/"general"), sort_order, is_published

## 11. `hero_sections`
id, page_slug (varchar 100 — "home"/"about"/"contact"/etc.), eyebrow, heading, subheading, image_url, cta1_text, cta1_href, cta2_text, cta2_href, updated_at

## 12. `stats`
id, number_display, label, icon_name, context (varchar 100 — "global"/"gcc"), sort_order, is_published

## 13. `contact_submissions`
id, full_name, company, email, phone (nullable), practice_area, message, submitted_at, status (varchar 50 — "new"/"read"/"responded"/"archived"), ip_address

## 14. `newsletter_subscribers`
id, email (UNIQUE), subscribed_at, is_active, unsubscribed_at (nullable)

## 15. `legacy_timeline`
id, year, title, description, sort_order, is_published

---

# 7. Entity Relationships

```
practice_areas 1──< practice_area_services
practice_areas >──< insights_articles   (many-to-many via junction)
practice_areas >──< events              (many-to-many via junction)

team_members 1──< team_member_expertise
team_members >──< events                (many-to-many via event_speakers)
team_members 1──< insights_articles     (author FK)

events 1──< event_agenda_items
events >──< team_members               (via event_speakers)

insights_articles >──< practice_areas  (optional tagging)
insights_articles >──< industries      (optional tagging)

Standalone: nav_items, hero_sections, faqs, office_locations,
            testimonials, stats, legacy_timeline, site_settings,
            contact_submissions, newsletter_subscribers
```

