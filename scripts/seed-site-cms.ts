/**
 * PSC Global — Site-Wide CMS Seeding Script
 * Run with: npx tsx scripts/seed-site-cms.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sitePages, pageSections, pageSeo, careersPositions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedSiteCMS() {
  console.log('🌱 Starting Site-Wide CMS Database Seeding...');

  // 1. Ensure tables exist (using raw SQL IF NOT EXISTS)
  await sql`
    CREATE TABLE IF NOT EXISTS site_pages (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(200) NOT NULL,
      path VARCHAR(300) NOT NULL,
      category VARCHAR(50) DEFAULT 'main' NOT NULL,
      is_published BOOLEAN DEFAULT true NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS page_sections (
      id SERIAL PRIMARY KEY,
      page_slug VARCHAR(100) NOT NULL,
      section_key VARCHAR(100) NOT NULL,
      title VARCHAR(300),
      subtitle TEXT,
      content JSONB,
      sort_order INTEGER DEFAULT 0 NOT NULL,
      is_published BOOLEAN DEFAULT true NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS page_seo (
      id SERIAL PRIMARY KEY,
      target_key VARCHAR(200) NOT NULL UNIQUE,
      meta_title VARCHAR(300),
      meta_description TEXT,
      keywords TEXT,
      canonical_url VARCHAR(1000),
      robots_no_index BOOLEAN DEFAULT false NOT NULL,
      robots_no_follow BOOLEAN DEFAULT false NOT NULL,
      og_title VARCHAR(300),
      og_description TEXT,
      og_image VARCHAR(1000),
      twitter_card VARCHAR(50) DEFAULT 'summary_large_image' NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS careers_positions (
      id SERIAL PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      department VARCHAR(200) NOT NULL,
      location VARCHAR(200) NOT NULL,
      type VARCHAR(100) DEFAULT 'Full-time' NOT NULL,
      description TEXT,
      requirements JSONB,
      sort_order INTEGER DEFAULT 0 NOT NULL,
      is_published BOOLEAN DEFAULT true NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  console.log('✅ Verified CMS table schemas in PostgreSQL.');

  // 2. Seed site_pages
  const pagesData = [
    { slug: 'home', title: 'Home Page', path: '/', category: 'main' },
    { slug: 'about', title: 'About Us', path: '/about', category: 'main' },
    { slug: 'book-consultation', title: 'Book Consultation', path: '/book-consultation', category: 'main' },
    { slug: 'career', title: 'Careers', path: '/career', category: 'main' },
    { slug: 'contact', title: 'Contact Us', path: '/contact', category: 'main' },
    { slug: 'events', title: 'Events Catalog', path: '/events', category: 'main' },
    { slug: 'events-detail', title: 'Event Detail Template', path: '/events/[slug]', category: 'dynamic' },
    { slug: 'gcc', title: 'GCC Advisory', path: '/gcc', category: 'main' },
    { slug: 'industries', title: 'Industries Catalog', path: '/industries', category: 'main' },
    { slug: 'industries-detail', title: 'Industry Detail Template', path: '/industries/[slug]', category: 'dynamic' },
    { slug: 'insights', title: 'Insights Catalog', path: '/insights', category: 'main' },
    { slug: 'insights-detail', title: 'Insight Detail Template', path: '/insights/[slug]', category: 'dynamic' },
    { slug: 'partner', title: 'Partner Directory', path: '/partner', category: 'main' },
    { slug: 'partner-detail', title: 'Partner Detail Template', path: '/partner/[slug]', category: 'dynamic' },
    { slug: 'practice-areas', title: 'Practice Areas Catalog', path: '/practice-areas', category: 'main' },
    { slug: 'practice-areas-detail', title: 'Practice Area Detail Template', path: '/practice-areas/[slug]', category: 'dynamic' },
    { slug: 'team', title: 'Team Directory', path: '/team', category: 'main' },
  ];

  for (const page of pagesData) {
    const existing = await db.select().from(sitePages).where(eq(sitePages.slug, page.slug));
    if (existing.length === 0) {
      await db.insert(sitePages).values(page);
    }
  }
  console.log(`✅ Seeded ${pagesData.length} site pages.`);

  // 3. Seed page_sections
  const sectionsData = [
    // Home
    { pageSlug: 'home', sectionKey: 'hero', title: 'Global Perspective. Local Mastery.', subtitle: 'Navigating cross-border legal, fiscal, and regulatory frameworks with precision.', content: { eyebrow: 'STRATEGIC ADVISORY & GLOBAL EXECUTION', cta1Text: 'Explore Practices', cta1Href: '/practice-areas', cta2Text: 'Book Consultation', cta2Href: '/book-consultation' }, sortOrder: 0 },
    { pageSlug: 'home', sectionKey: 'stats', title: 'Firm Track Record', subtitle: 'Global scale and proven advisory impact', sortOrder: 1 },
    { pageSlug: 'home', sectionKey: 'practice_areas', title: 'Core Advisory Practices', subtitle: 'Comprehensive strategic legal and tax solutions', sortOrder: 2 },
    { pageSlug: 'home', sectionKey: 'industries', title: 'Sectors & Industry Verticals', subtitle: 'Tailored domain expertise across key global sectors', sortOrder: 3 },
    { pageSlug: 'home', sectionKey: 'insights', title: 'Insights & Perspectives', subtitle: 'Analysis on regulatory shifts, tax policy, and research', sortOrder: 4 },
    { pageSlug: 'home', sectionKey: 'team', title: 'Leadership Showcase', subtitle: 'Senior partners and international practice leaders', sortOrder: 5 },
    { pageSlug: 'home', sectionKey: 'testimonials', title: 'Client Feedback', subtitle: 'What corporate leaders say about PSC Global', sortOrder: 6 },
    { pageSlug: 'home', sectionKey: 'contact_cta', title: 'Ready to Elevate Your Business Operations?', subtitle: 'Connect with our senior advisory partners today.', content: { ctaText: 'Schedule Consultation', ctaHref: '/contact' }, sortOrder: 7 },

    // About
    { pageSlug: 'about', sectionKey: 'hero', title: 'Two Decades of Advisory Excellence', subtitle: 'Building enduring trust through strategic rigor and global capability.', content: { eyebrow: 'ABOUT PSC GLOBAL', cta1Text: 'View Leadership', cta1Href: '/team' }, sortOrder: 0 },
    { pageSlug: 'about', sectionKey: 'who_we_are', title: 'Global Vision, Localized Execution', subtitle: 'Empowering multinational corporations to expand seamlessly.', sortOrder: 1 },
    { pageSlug: 'about', sectionKey: 'timeline', title: 'Our Growth Milestones', subtitle: 'Two decades of advisory evolution across financial hubs', sortOrder: 2 },
    { pageSlug: 'about', sectionKey: 'values', title: 'Our Core Operating Principles', subtitle: 'Precision, integrity, confidentiality, and partnership', sortOrder: 3 },
    { pageSlug: 'about', sectionKey: 'offices', title: 'Global Financial Hubs', subtitle: 'London, Dubai, Singapore, New York', sortOrder: 4 },

    // Careers
    { pageSlug: 'career', sectionKey: 'hero', title: 'Shape the Future of Global Advisory', subtitle: 'Join an elite team of cross-border strategists, attorneys, and tax specialists.', content: { eyebrow: 'CAREERS AT PSC GLOBAL', cta1Text: 'View Openings', cta1Href: '#positions' }, sortOrder: 0 },
    { pageSlug: 'career', sectionKey: 'culture', title: 'Our Work Culture & Philosophy', subtitle: 'Fostering intellectual rigor, diversity, and strategic impact.', sortOrder: 1 },
    { pageSlug: 'career', sectionKey: 'positions', title: 'Current Open Opportunities', subtitle: 'Explore positions across our global offices', sortOrder: 2 },

    // Contact
    { pageSlug: 'contact', sectionKey: 'hero', title: 'Connect With Our Advisory Partners', subtitle: 'Direct access to senior partner counsel across our international offices.', content: { eyebrow: 'CONTACT PSC GLOBAL' }, sortOrder: 0 },
    { pageSlug: 'contact', sectionKey: 'offices', title: 'Our International Offices', subtitle: 'Full contact details for London, Dubai, Singapore, and New York', sortOrder: 1 },
    { pageSlug: 'contact', sectionKey: 'faqs', title: 'Frequently Asked Questions', subtitle: 'Common queries regarding advisory engagements', sortOrder: 2 },

    // GCC
    { pageSlug: 'gcc', sectionKey: 'hero', title: 'Architecting High-Yield GCC Operations', subtitle: 'End-to-end establishment, tax structuring, and compliance for Global Capability Centers in India.', content: { eyebrow: 'GLOBAL CAPABILITY CENTERS' }, sortOrder: 0 },
    { pageSlug: 'gcc', sectionKey: 'stats', title: 'India GCC Market Landscape', subtitle: 'Statistical backdrop of India as a global innovation powerhouse', sortOrder: 1 },
    { pageSlug: 'gcc', sectionKey: 'services', title: 'GCC Advisory Capabilities', subtitle: 'Tax structuring, legal compliance, entity setup & talent advisory', sortOrder: 2 },
    { pageSlug: 'gcc', sectionKey: 'faqs', title: 'GCC Setup FAQs', subtitle: 'Key regulatory, FEMA, and transfer pricing considerations', sortOrder: 3 },

    // Events
    { pageSlug: 'events', sectionKey: 'hero', title: 'Executive Knowledge Exchange', subtitle: 'Industry briefings, international tax summits, and regulatory roundtables.', content: { eyebrow: 'EVENTS & WEBINARS' }, sortOrder: 0 },
    { pageSlug: 'events', sectionKey: 'listings', title: 'Upcoming & Archived Events', subtitle: 'Browse webinars and conferences', sortOrder: 1 },

    // Industries
    { pageSlug: 'industries', sectionKey: 'hero', title: 'Deep Sector Specialization', subtitle: 'Tailored strategic advisory across complex global industries.', content: { eyebrow: 'INDUSTRY VERTICALS' }, sortOrder: 0 },
    { pageSlug: 'industries', sectionKey: 'listings', title: 'Industry Verticals Catalog', subtitle: 'Browse our domain expertise', sortOrder: 1 },

    // Insights
    { pageSlug: 'insights', sectionKey: 'hero', title: 'Perspectives, Updates & Research', subtitle: 'Authoritative analysis on corporate tax policy, regulatory shifts, and landmark judgements.', content: { eyebrow: 'THOUGHT LEADERSHIP' }, sortOrder: 0 },
    { pageSlug: 'insights', sectionKey: 'listings', title: 'Articles & Regulatory Updates', subtitle: 'Search publications and research papers', sortOrder: 1 },

    // Practice Areas
    { pageSlug: 'practice-areas', sectionKey: 'hero', title: 'Comprehensive Legal & Tax Solutions', subtitle: 'Strategic corporate counsel engineered for global enterprise risk management.', content: { eyebrow: 'PRACTICE AREAS' }, sortOrder: 0 },
    { pageSlug: 'practice-areas', sectionKey: 'listings', title: 'Core Practice Areas Catalog', subtitle: 'Explore our corporate solutions', sortOrder: 1 },

    // Team
    { pageSlug: 'team', sectionKey: 'hero', title: 'Leadership & Senior Partners', subtitle: 'Decades of combined international practice across tax, risk, legal, and compliance.', content: { eyebrow: 'OUR PEOPLE' }, sortOrder: 0 },
    { pageSlug: 'team', sectionKey: 'directory', title: 'Team Directory', subtitle: 'Explore partner and leader profiles', sortOrder: 1 },

    // Book Consultation
    { pageSlug: 'book-consultation', sectionKey: 'hero', title: 'Schedule an Advisory Consultation', subtitle: 'Book a direct meeting with a senior partner to discuss your strategic needs.', content: { eyebrow: 'CLIENT ENGAGEMENT' }, sortOrder: 0 },

    // Partner
    { pageSlug: 'partner', sectionKey: 'hero', title: 'Partner Directory', subtitle: 'Meet our global managing partners and senior advisors.', content: { eyebrow: 'EXECUTIVE ADVISORS' }, sortOrder: 0 },
  ];

  for (const sec of sectionsData) {
    const existing = await db
      .select()
      .from(pageSections)
      .where(and(eq(pageSections.pageSlug, sec.pageSlug), eq(pageSections.sectionKey, sec.sectionKey)));

    if (existing.length === 0) {
      await db.insert(pageSections).values(sec);
    }
  }
  console.log(`✅ Seeded default page sections.`);

  // 4. Seed page_seo
  const seoData = [
    { targetType: 'page', targetIdentifier: 'home', metaTitle: 'PSC Global — Strategic Business & Tax Advisory Firm', metaDescription: 'PSC Global provides cross-border corporate tax advisory, risk & assurance, M&A due diligence, and GCC setup services.', canonicalUrl: 'https://pscglobal.com/' },
    { targetType: 'page', targetIdentifier: 'about', metaTitle: 'About Us — PSC Global Advisory', metaDescription: 'Learn about PSC Global history, core leadership, operating principles, and global office footprint in London, Dubai, Singapore, and New York.', canonicalUrl: 'https://pscglobal.com/about' },
    { targetType: 'page', targetIdentifier: 'book-consultation', metaTitle: 'Book Consultation — PSC Global', metaDescription: 'Schedule a confidential advisory consultation with senior partners at PSC Global.', canonicalUrl: 'https://pscglobal.com/book-consultation' },
    { targetType: 'page', targetIdentifier: 'career', metaTitle: 'Careers at PSC Global — Opportunities in Global Advisory', metaDescription: 'Join our team of strategists, international tax experts, and corporate attorneys across global offices.', canonicalUrl: 'https://pscglobal.com/career' },
    { targetType: 'page', targetIdentifier: 'contact', metaTitle: 'Contact Us — PSC Global Office Locations', metaDescription: 'Get in touch with PSC Global advisory partners in London, Dubai, Singapore, and New York.', canonicalUrl: 'https://pscglobal.com/contact' },
    { targetType: 'page', targetIdentifier: 'events', metaTitle: 'Events & Webinars — PSC Global Executive Briefings', metaDescription: 'Attend international tax policy briefings, regulatory roundtables, and executive webinars.', canonicalUrl: 'https://pscglobal.com/events' },
    { targetType: 'page', targetIdentifier: 'gcc', metaTitle: 'Global Capability Center (GCC) Advisory — PSC Global', metaDescription: 'Architecting high-yield GCC operations, tax structuring, and compliance in India.', canonicalUrl: 'https://pscglobal.com/gcc' },
    { targetType: 'page', targetIdentifier: 'industries', metaTitle: 'Industry Verticals — PSC Global Domain Specialization', metaDescription: 'Deep domain expertise in Financial Services, Technology, Energy, Healthcare, Manufacturing, and Real Estate.', canonicalUrl: 'https://pscglobal.com/industries' },
    { targetType: 'page', targetIdentifier: 'insights', metaTitle: 'Insights & Perspectives — Regulatory Updates & Tax Policy', metaDescription: 'Authoritative analysis on international tax policy, SEBI updates, GST landmark judgements, and research.', canonicalUrl: 'https://pscglobal.com/insights' },
    { targetType: 'page', targetIdentifier: 'partner', metaTitle: 'Partner Profiles — PSC Global Executive Advisors', metaDescription: 'Meet our global managing partners, legal leads, and international tax advisors.', canonicalUrl: 'https://pscglobal.com/partner' },
    { targetType: 'page', targetIdentifier: 'practice-areas', metaTitle: 'Advisory Practice Areas — PSC Global Solutions', metaDescription: 'Corporate Tax Advisory, Risk & Assurance, M&A Due Diligence, Transfer Pricing, and Legal Compliance.', canonicalUrl: 'https://pscglobal.com/practice-areas' },
    { targetType: 'page', targetIdentifier: 'team', metaTitle: 'Our Team — Leadership & Advisors | PSC Global', metaDescription: 'Explore our full team of international practice leaders, partners, and strategic advisors.', canonicalUrl: 'https://pscglobal.com/team' },
  ];

  for (const seo of seoData) {
    const existing = await db
      .select()
      .from(pageSeo)
      .where(and(eq(pageSeo.targetType, seo.targetType), eq(pageSeo.targetIdentifier, seo.targetIdentifier)));
    if (existing.length === 0) {
      await db.insert(pageSeo).values(seo);
    }
  }
  console.log(`✅ Seeded default page SEO entries.`);

  // 5. Seed careers_positions
  const jobsData = [
    { title: 'Senior Corporate Tax Manager', department: 'Tax Advisory', location: 'London, UK', type: 'Full-time', description: 'Lead cross-border corporate tax advisory and transfer pricing strategies for multinational enterprise clients.', requirements: '10+ years corporate tax experience\nCTA or ACA certification\nExpertise in OECD pillar 2 and international tax treaties', sortOrder: 0 },
    { title: 'M&A Legal Associate', department: 'Legal & Corporate', location: 'Dubai, UAE', type: 'Full-time', description: 'Advise multinational clients on cross-border joint ventures, transaction structuring, and regulatory due diligence.', requirements: 'LL.B or LL.M in Corporate Law\n5+ years M&A advisory experience in GCC region\nFluent in English; Arabic is a plus', sortOrder: 1 },
    { title: 'GCC Establishment Director', department: 'GCC Advisory', location: 'Bangalore, India', type: 'Full-time', description: 'Architect end-to-end Global Capability Center setup, regulatory approvals, tax incentives, and transfer pricing models.', requirements: '12+ years experience in GCC advisory\nStrong network with Indian regulatory authorities (SEBI, RBI, IT Dept)\nProven track record of setting up 5+ tech/finance GCCs', sortOrder: 2 },
    { title: 'Transfer Pricing Specialist', department: 'International Tax', location: 'Singapore', type: 'Full-time', description: 'Design APA strategies, BEPS compliance documentation, and intercompany pricing frameworks.', requirements: 'Chartered Accountant / CPA\n6+ years transfer pricing advisory in APAC region', sortOrder: 3 },
  ];

  for (const job of jobsData) {
    const existing = await db.select().from(careersPositions).where(eq(careersPositions.title, job.title));
    if (existing.length === 0) {
      await db.insert(careersPositions).values(job);
    }
  }
  console.log(`✅ Seeded careers job openings.`);

  console.log('🎉 Site-Wide CMS Seeding Completed Successfully!');
}

seedSiteCMS()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });

//test