import { db } from '../lib/db/client';
import {
  sitePages,
  pageSections,
  pageSeo,
  careersPositions,
  practiceAreas,
  practiceAreaServices,
  stats,
} from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function seedSiteCMS() {
  console.log('🌱 Starting Site-Wide CMS Database Seeding...');

  // 1. DDL Schema Verification & Alterations
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(200) NOT NULL UNIQUE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        is_published BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`ALTER TABLE site_pages ADD COLUMN IF NOT EXISTS description TEXT;`;

    await sql`
      CREATE TABLE IF NOT EXISTS page_sections (
        id SERIAL PRIMARY KEY,
        page_slug VARCHAR(200) NOT NULL REFERENCES site_pages(slug) ON DELETE CASCADE,
        section_key VARCHAR(100) NOT NULL,
        title VARCHAR(300),
        eyebrow VARCHAR(200),
        subtitle TEXT,
        body_content TEXT,
        image_url VARCHAR(1000),
        primary_cta_text VARCHAR(100),
        primary_cta_url VARCHAR(500),
        secondary_cta_text VARCHAR(100),
        secondary_cta_url VARCHAR(500),
        content JSONB,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_visible BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS eyebrow VARCHAR(200);`;
    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS body_content TEXT;`;
    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000);`;
    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS primary_cta_text VARCHAR(100);`;
    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS primary_cta_url VARCHAR(500);`;
    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS secondary_cta_text VARCHAR(100);`;
    await sql`ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS secondary_cta_url VARCHAR(500);`;

    await sql`
      CREATE TABLE IF NOT EXISTS page_seo (
        id SERIAL PRIMARY KEY,
        target_type VARCHAR(50) NOT NULL,
        target_identifier VARCHAR(200) NOT NULL,
        meta_title VARCHAR(300),
        meta_description TEXT,
        canonical_url VARCHAR(1000),
        robots VARCHAR(100) DEFAULT 'index, follow',
        og_title VARCHAR(300),
        og_description TEXT,
        og_image VARCHAR(1000),
        twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`ALTER TABLE page_seo ADD COLUMN IF NOT EXISTS robots VARCHAR(100) DEFAULT 'index, follow';`;
    await sql`ALTER TABLE hero_sections ALTER COLUMN heading DROP NOT NULL;`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS body_content TEXT;`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS body TEXT;`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'article';`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS tag VARCHAR(100);`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS file_url VARCHAR(1000);`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS read_time_mins INTEGER DEFAULT 5;`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS authority_tag VARCHAR(100);`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS court_name VARCHAR(300);`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;`;
    await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS person_name VARCHAR(200);`;
    await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS person_title VARCHAR(300);`;
    await sql`ALTER TABLE faqs ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general';`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS category VARCHAR(100);`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS author_name VARCHAR(200);`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS author_role VARCHAR(200);`;
    await sql`ALTER TABLE faqs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();`;
    await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0 NOT NULL;`;
    await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true NOT NULL;`;
    await sql`ALTER TABLE office_locations ADD COLUMN IF NOT EXISTS country VARCHAR(100);`;
    await sql`ALTER TABLE office_locations ADD COLUMN IF NOT EXISTS is_headquarters BOOLEAN DEFAULT false NOT NULL;`;
    await sql`ALTER TABLE office_locations ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0 NOT NULL;`;
    await sql`ALTER TABLE office_locations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();`;
    await sql`ALTER TABLE office_locations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;
    await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS read_time VARCHAR(50);`;
    await sql`ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;`;
    await sql`ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP;`;

    await sql`
      CREATE TABLE IF NOT EXISTS careers_positions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        department VARCHAR(200) DEFAULT 'Tax Advisory' NOT NULL,
        location VARCHAR(200) DEFAULT 'London, UK' NOT NULL,
        type VARCHAR(50) DEFAULT 'Full-time' NOT NULL,
        description TEXT,
        requirements TEXT,
        application_url VARCHAR(500) DEFAULT '/contact',
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_published BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS heading VARCHAR(300);`;
    await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000);`;

    await sql`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        label VARCHAR(200) NOT NULL,
        value INTEGER DEFAULT 0 NOT NULL,
        suffix VARCHAR(20) DEFAULT '+' NOT NULL,
        icon_name VARCHAR(100),
        sort_order INTEGER DEFAULT 0 NOT NULL,
        is_published BOOLEAN DEFAULT true NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS value INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS label VARCHAR(200);`;
    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS suffix VARCHAR(20) DEFAULT '+';`;
    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);`;
    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE stats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();`;
    await sql`ALTER TABLE stats ALTER COLUMN number_display DROP NOT NULL;`;

    console.log('✅ Verified & migrated CMS table schemas in PostgreSQL.');
  } catch (err) {
    console.error('Error verifying/migrating tables:', err);
  }

  // 2. Seed site_pages (12 main routes)
  const pagesData = [
    { slug: 'home', title: 'Home Page', description: 'Hero banner, practice highlights, sector cards, key stats, insights, and CTAs.' },
    { slug: 'about', title: 'About Us', description: 'Firm history, executive mission, core operating principles, timeline, and global footprint.' },
    { slug: 'team', title: 'Leadership & Team', description: 'Executive managing partners, senior advisors, and practice leaders presentation.' },
    { slug: 'practice-areas', title: 'Practice Areas Index', description: 'Core practice areas index (Tax Advisory, Risk & Assurance, M&A Due Diligence).' },
    { slug: 'industries', title: 'Industries Index', description: 'Industry verticals directory (Financial Services, Tech, Energy, Healthcare).' },
    { slug: 'insights', title: 'Insights Index', description: 'Tax policy insights, landmark judgements, regulatory updates, and research publications.' },
    { slug: 'events', title: 'Events Overview', description: 'Upcoming webinars, tax briefings, agenda highlights, and registration links.' },
    { slug: 'gcc', title: 'GCC Advisory', description: 'Global Capability Center establishment, transfer pricing, and SEBI compliance.' },
    { slug: 'partner', title: 'Partner Network', description: 'Global strategic partners, affiliate firms, and institutional relationships.' },
    { slug: 'career', title: 'Careers', description: 'Working at PSC Global, workplace culture, benefits, and open job positions.' },
    { slug: 'contact', title: 'Contact Us', description: 'Office addresses, contact inquiry form configuration, and map embeds.' },
    { slug: 'book-consultation', title: 'Book Consultation', description: 'Consultation scheduling form, booking parameters, and confirmation CTAs.' },
  ];

  for (const page of pagesData) {
    const existing = await db.select().from(sitePages).where(eq(sitePages.slug, page.slug));
    if (existing.length === 0) {
      await db.insert(sitePages).values(page);
    }
  }
  console.log(`✅ Seeded ${pagesData.length} site pages.`);

  // 3. Seed structured page_sections for /practice-areas and other routes
  const sectionsData = [
    // Practice Areas structured sections
    { pageSlug: 'practice-areas', sectionKey: 'quote', title: 'Operating Resilience', bodyContent: 'Architecture in business is not just about structure; it is about the resilience to withstand global shifts.', isVisible: true, sortOrder: 0 },
    { pageSlug: 'practice-areas', sectionKey: 'multidisciplinary_intro', title: 'One Firm. Multiple Disciplines. One Integrated Perspective.', eyebrow: 'MULTIDISCIPLINARY EXPERTISE', bodyContent: 'In an increasingly interconnected global economy, business challenges rarely exist in isolation. A tax implication in one region often triggers a regulatory requirement in another, which in turn impacts operational efficiency.\n\nAt Advisory Global, we have structured our practice areas to operate as a single, fluid ecosystem. Our partners collaborate across borders and disciplines to ensure our clients receive not just a service, but a holistic architectural solution for their most complex challenges.', isVisible: true, sortOrder: 1 },
    { pageSlug: 'practice-areas', sectionKey: 'capabilities_header', title: 'Our Practice Areas', eyebrow: 'CORE CAPABILITIES', subtitle: 'EST. 2002 | Global Standards', isVisible: true, sortOrder: 2 },
    { pageSlug: 'practice-areas', sectionKey: 'final_cta', title: 'Complex Business Challenges Require Connected Thinking.', subtitle: 'Let us discuss how our multidisciplinary team can provide the architectural clarity your organization needs to thrive on a global scale.', primaryCtaText: 'BOOK A CONSULTATION', primaryCtaUrl: '/book-consultation', secondaryCtaText: 'CONTACT US', secondaryCtaUrl: '/contact', isVisible: true, sortOrder: 3 },
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

  // 4. Seed practice_areas & practice_area_services (All 5 complete practice areas)
  const defaultPracticeAreas = [
    {
      number: '01',
      slug: 'risk-assurance',
      name: 'Risk & Assurance',
      heading: 'Rigorous Oversight for Uncompromising Integrity.',
      shortDescription: 'Our assurance practice goes beyond standard compliance. We provide deep-dive forensic insights that reveal operational vulnerabilities and strengthen governance frameworks.',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=85',
      services: ['Statutory Audit', 'Internal Audit & Controls', 'Forensic Audit', 'Risk Assessment'],
      sortOrder: 0,
    },
    {
      number: '02',
      slug: 'tax-fiscal-advisory',
      name: 'Tax & Fiscal Advisory',
      heading: 'Strategic Tax Architecture for Global Growth.',
      shortDescription: 'We navigate the complexities of direct and indirect taxation, ensuring efficiency while maintaining absolute regulatory compliance across multiple jurisdictions.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
      services: ['Direct Taxation', 'Indirect Tax (GST/VAT)', 'International Taxation', 'Transfer Pricing'],
      sortOrder: 1,
    },
    {
      number: '03',
      slug: 'corporate-law',
      name: 'Corporate Law',
      heading: 'Legal Frameworks Built for Certainty.',
      shortDescription: 'From incorporation to cross-border contracts, our legal practice provides the structural clarity businesses need to operate with confidence.',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85',
      services: ['Corporate Structuring', 'Contract Advisory', 'Dispute Resolution', 'Regulatory Filings'],
      sortOrder: 2,
    },
    {
      number: '04',
      slug: 'business-advisory',
      name: 'Business Advisory',
      heading: 'Growth Strategy Grounded in Data.',
      shortDescription: 'We combine market intelligence with operational rigor to help leadership teams make confident, defensible strategic decisions.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85',
      services: ['Market Entry Strategy', 'Feasibility Studies', 'Valuation Advisory', 'Performance Improvement'],
      sortOrder: 3,
    },
    {
      number: '05',
      slug: 'business-process-advisory',
      name: 'Business Process Advisory',
      heading: 'Operational Excellence at Every Layer.',
      shortDescription: 'We re-engineer core processes — from ERP rollouts to shared services — so operations scale smoothly without operational friction.',
      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
      services: ['ERP Implementation', 'Process Outsourcing', 'Shared Services Design', 'Automation & RPA'],
      sortOrder: 4,
    },
  ];

  for (const paData of defaultPracticeAreas) {
    const [existing] = await db.select().from(practiceAreas).where(eq(practiceAreas.slug, paData.slug)).limit(1);
    let paId: number;

    if (!existing) {
      const [inserted] = await db.insert(practiceAreas).values({
        number: paData.number,
        slug: paData.slug,
        name: paData.name,
        heading: paData.heading,
        shortDescription: paData.shortDescription,
        imageUrl: paData.imageUrl,
        sortOrder: paData.sortOrder,
        isPublished: true,
      }).returning();
      paId = inserted.id;
    } else {
      paId = existing.id;
      await db.update(practiceAreas).set({
        number: paData.number,
        heading: existing.heading || paData.heading,
        shortDescription: existing.shortDescription || paData.shortDescription,
        imageUrl: existing.imageUrl || paData.imageUrl,
        isPublished: true,
      }).where(eq(practiceAreas.id, paId));
    }

    // Seed services for this practice area
    const existingServices = await db.select().from(practiceAreaServices).where(eq(practiceAreaServices.practiceAreaId, paId));
    if (existingServices.length === 0) {
      for (let sIdx = 0; sIdx < paData.services.length; sIdx++) {
        await db.insert(practiceAreaServices).values({
          practiceAreaId: paId,
          name: paData.services[sIdx],
          sortOrder: sIdx,
        });
      }
    }
  }
  console.log(`✅ Seeded complete Practice Areas & Services records.`);

  // 5. Seed stats metrics table
  const defaultStats = [
    { label: 'YEARS OF EXPERIENCE', value: 22, suffix: '+', sortOrder: 0 },
    { label: 'CLIENTS WORLDWIDE', value: 1000, suffix: '+', sortOrder: 1 },
    { label: 'COUNTRIES PRESENT', value: 15, suffix: '+', sortOrder: 2 },
    { label: 'EXPERTS & CONSULTANTS', value: 250, suffix: '+', sortOrder: 3 },
  ];

  for (const statItem of defaultStats) {
    const existing = await db.select().from(stats).where(eq(stats.label, statItem.label));
    if (existing.length === 0) {
      await db.insert(stats).values(statItem);
    }
  }
  console.log(`✅ Seeded stats metrics rows.`);

  console.log('🎉 Site-Wide CMS Seeding Completed Successfully!');
}

seedSiteCMS()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error during seeding:', err);
    process.exit(1);
  });