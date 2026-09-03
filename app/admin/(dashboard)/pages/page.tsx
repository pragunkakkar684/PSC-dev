import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { db } from '@/lib/db';
import { sitePages, pageSections } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/permissions';
import Link from 'next/link';
import {
  FileText,
  Edit3,
  ExternalLink,
  CheckCircle,
  Eye,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Site-Wide Pages CMS',
};

interface PageDef {
  slug: string;
  name: string;
  route: string;
  category: 'main' | 'template';
  description: string;
}

const PUBLIC_PAGES_REGISTRY: PageDef[] = [
  // MAIN PAGES
  { slug: 'home', name: 'Home Page', route: '/', category: 'main', description: 'Hero banner, practice highlights, sector cards, stats, insights, and CTAs.' },
  { slug: 'about', name: 'About Us', route: '/about', category: 'main', description: 'Firm history, executive mission, core values, timeline, and global footprint.' },
  { slug: 'contact', name: 'Contact Us', route: '/contact', category: 'main', description: 'Office addresses, contact inquiry form configuration, and map embeds.' },
  { slug: 'career', name: 'Careers', route: '/career', category: 'main', description: 'Working at PSC Global, workplace culture, benefits, and job openings listings.' },
  { slug: 'events', name: 'Events Overview', route: '/events', category: 'main', description: 'Upcoming webinars, tax briefings, agenda highlights, and registration links.' },
  { slug: 'gcc', name: 'GCC Advisory', route: '/gcc', category: 'main', description: 'Global Capability Center establishment, transfer pricing, and SEBI compliance.' },
  { slug: 'industries', name: 'Industries Index', route: '/industries', category: 'main', description: 'Industry verticals directory (Financial Services, Tech, Energy, Healthcare).' },
  { slug: 'insights', name: 'Insights Index', route: '/insights', category: 'main', description: 'Tax policy insights, landmark judgements, regulatory updates, and publications.' },
  { slug: 'partner', name: 'Partner Network', route: '/partner', category: 'main', description: 'Global strategic partners, affiliate firms, and institutional relationships.' },
  { slug: 'practice-areas', name: 'Practice Areas Index', route: '/practice-areas', category: 'main', description: 'Core practice areas (Tax Advisory, Risk & Assurance, M&A Due Diligence).' },
  { slug: 'team', name: 'Leadership & Team', route: '/team', category: 'main', description: 'Executive managing partners, senior advisors, and practice leaders.' },
  { slug: 'book-consultation', name: 'Book Consultation', route: '/book-consultation', category: 'main', description: 'Consultation scheduling form, booking parameters, and confirmation CTAs.' },

  // DYNAMIC DETAIL TEMPLATES
  { slug: 'events-detail', name: 'Event Detail Template', route: '/events/[slug]', category: 'template', description: 'Template & SEO configuration for individual webinar and seminar pages.' },
  { slug: 'industries-detail', name: 'Industry Detail Template', route: '/industries/[slug]', category: 'template', description: 'Template & SEO configuration for individual sector detail pages.' },
  { slug: 'insights-detail', name: 'Insight Detail Template', route: '/insights/[slug]', category: 'template', description: 'Template & SEO configuration for individual research article pages.' },
  { slug: 'partner-detail', name: 'Partner Detail Template', route: '/partner/[slug]', category: 'template', description: 'Template & SEO configuration for individual partner profile pages.' },
  { slug: 'practice-areas-detail', name: 'Practice Area Detail Template', route: '/practice-areas/[slug]', category: 'template', description: 'Template & SEO configuration for individual practice area pages.' },
];

export default async function PagesCMSPage() {
  const user = await requireAuth();

  // Query site_pages and page_sections counts safely
  let dbPages: (typeof sitePages.$inferSelect)[] = [];
  let dbSections: (typeof pageSections.$inferSelect)[] = [];

  try {
    [dbPages, dbSections] = await Promise.all([
      db.select().from(sitePages),
      db.select().from(pageSections),
    ]);
  } catch (err) {
    console.error('Error querying sitePages or pageSections in /admin/pages:', err);
  }

  const pageStatusMap = new Map<string, boolean>();
  for (const p of dbPages) {
    pageStatusMap.set(p.slug, p.isPublished);
  }

  const sectionCountMap = new Map<string, number>();
  for (const s of dbSections) {
    const current = sectionCountMap.get(s.pageSlug) || 0;
    sectionCountMap.set(s.pageSlug, current + 1);
  }

  const mainPages = PUBLIC_PAGES_REGISTRY.filter((p) => p.category === 'main');
  const templatePages = PUBLIC_PAGES_REGISTRY.filter((p) => p.category === 'template');

  return (
    <>
      <AdminHeader title="Site-Wide Pages Manager" user={user} />

      <div className="admin-content">
        <PageHeader
          title="Website Pages & CMS Grid"
          description="Select any of the 17 public routes to manage hero content, page sections, content composition, careers job listings, and page-specific SEO metadata."
        />

        {/* SECTION 1: MAIN WEBSITE PAGES */}
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FileText size={20} className="text-sky-400" />
            Main Website Pages (12 Routes)
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {mainPages.map((page) => {
              const isPublished = pageStatusMap.get(page.slug) ?? true;
              const sectionCount = sectionCountMap.get(page.slug) || 0;

              return (
                <div
                  key={page.slug}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {page.route}
                      </span>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isPublished ? '#10b981' : '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle size={10} />
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 8px 0' }}>
                      {page.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {page.description}
                    </p>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sliders size={14} />
                      <strong>{sectionCount}</strong> dynamic sections
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href={page.route}
                        target="_blank"
                        className="admin-button secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Preview Live Page"
                      >
                        <Eye size={14} />
                      </Link>

                      <Link
                        href={`/admin/pages/${page.slug}`}
                        className="admin-button primary"
                        style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Edit3 size={14} /> Edit Page
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: DYNAMIC DETAIL PAGE TEMPLATES */}
        <div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Sparkles size={20} className="text-amber-400" />
            Dynamic Detail Page Templates (5 Dynamic Routes)
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {templatePages.map((page) => {
              const isPublished = pageStatusMap.get(page.slug) ?? true;
              const sectionCount = sectionCountMap.get(page.slug) || 0;

              return (
                <div
                  key={page.slug}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          color: '#fbbf24',
                          background: 'rgba(251, 191, 36, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {page.route}
                      </span>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                        }}
                      >
                        Dynamic Entity Template
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 8px 0' }}>
                      {page.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {page.description}
                    </p>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Uses database entity table
                    </div>

                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="admin-button primary"
                      style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit3 size={14} /> Edit Template & SEO
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
