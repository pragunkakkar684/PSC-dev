import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { db } from '@/lib/db';
import { sitePages, pageSections } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import Link from 'next/link';
import {
  FileText,
  Edit3,
  ExternalLink,
  CheckCircle,
  Eye,
  Sliders,
  Layers,
  Building2,
  BookOpen,
  Calendar,
  Users,
  Quote,
  HelpCircle,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Pages & Website Manager',
};

interface StaticPageDef {
  slug: string;
  name: string;
  route: string;
  typeLabel: string;
  description: string;
}

const STATIC_PAGES_REGISTRY: StaticPageDef[] = [
  { slug: 'home', name: 'Home Page', route: '/', typeLabel: 'Landing Page', description: 'Hero banner, practice highlights, sector cards, key stats, insights, and CTAs.' },
  { slug: 'about', name: 'About Us', route: '/about', typeLabel: 'Company Page', description: 'Firm history, executive mission, core operating principles, timeline, and global footprint.' },
  { slug: 'team', name: 'Leadership & Team', route: '/team', typeLabel: 'Directory Page', description: 'Executive managing partners, senior advisors, and practice leaders presentation.' },
  { slug: 'practice-areas', name: 'Practice Areas Index', route: '/practice-areas', typeLabel: 'Collection Page', description: 'Core practice areas index (Tax Advisory, Risk & Assurance, M&A Due Diligence).' },
  { slug: 'industries', name: 'Industries Index', route: '/industries', typeLabel: 'Collection Page', description: 'Industry verticals directory (Financial Services, Tech, Energy, Healthcare).' },
  { slug: 'insights', name: 'Insights Index', route: '/insights', typeLabel: 'Collection Page', description: 'Tax policy insights, landmark judgements, regulatory updates, and research publications.' },
  { slug: 'events', name: 'Events Overview', route: '/events', typeLabel: 'Collection Page', description: 'Upcoming webinars, tax briefings, agenda highlights, and registration links.' },
  { slug: 'gcc', name: 'CC Capital Advisory', route: '/gcc', typeLabel: 'Landing Page', description: 'Global Capability Center establishment, transfer pricing, and SEBI compliance.' },
  { slug: 'partner', name: 'Partner Network', route: '/partner', typeLabel: 'Directory Page', description: 'Global strategic partners, affiliate firms, and institutional relationships.' },
  { slug: 'career', name: 'Careers', route: '/career', typeLabel: 'Careers Page', description: 'Working at PSC Global, workplace culture, benefits, and open job positions.' },
  { slug: 'contact', name: 'Contact Us', route: '/contact', typeLabel: 'Contact Page', description: 'Office addresses, contact inquiry form configuration, and map embeds.' },
  { slug: 'book-consultation', name: 'Book Consultation', route: '/book-consultation', typeLabel: 'Form Page', description: 'Consultation scheduling form, booking parameters, and confirmation CTAs.' },
];

const DYNAMIC_ENTITIES_REGISTRY = [
  { name: 'Practice Areas', href: '/admin/practice-areas', icon: <Layers size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage individual practice areas & service offerings' },
  { name: 'Industries', href: '/admin/industries', icon: <Building2 size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage sector verticals & industry expertise' },
  { name: 'Insights Articles', href: '/admin/insights', icon: <BookOpen size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage publications, research & regulatory updates' },
  { name: 'Events & Briefings', href: '/admin/events', icon: <Calendar size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage executive webinars, roundtables & agendas' },
  { name: 'Team Members', href: '/admin/team', icon: <Users size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage managing partner & leadership bios' },
  { name: 'Client Testimonials', href: '/admin/testimonials', icon: <Quote size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage client recommendations & feedback' },
  { name: 'Office Locations', href: '/admin/office-locations', icon: <MapPin size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage global offices & coordinates' },
  { name: 'FAQs', href: '/admin/faqs', icon: <HelpCircle size={18} style={{ color: 'var(--accent)' }} />, description: 'Manage frequently asked questions & categories' },
];

export default async function PagesCMSPage() {
  const user = await requireEditor();

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

  const pageStatusMap = new Map<string, { isPublished: boolean; updatedAt: Date }>();
  for (const p of dbPages) {
    pageStatusMap.set(p.slug, { isPublished: p.isPublished, updatedAt: p.updatedAt });
  }

  const sectionCountMap = new Map<string, number>();
  for (const s of dbSections) {
    const current = sectionCountMap.get(s.pageSlug) || 0;
    sectionCountMap.set(s.pageSlug, current + 1);
  }

  return (
    <>
      <AdminHeader title="Website Pages Manager" user={user} />

      <div className="admin-content">
        <PageHeader
          title="Website Pages & CMS Manager"
          description="Manage page heroes, section content, section ordering, visibility, and page-specific SEO for all 12 main public website routes."
        />

        {/* SECTION 1: MAIN PAGES TABLE */}
        <div style={{ marginBottom: '40px' }}>
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
            Public Website Pages (12 Main Routes)
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr
                  style={{
                    background: '#020617',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--text-muted, #64748b)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <th style={{ padding: '16px 20px' }}>Page Name</th>
                  <th style={{ padding: '16px 20px' }}>Route Slug</th>
                  <th style={{ padding: '16px 20px' }}>Page Type</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Sections</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {STATIC_PAGES_REGISTRY.map((page) => {
                  const statusInfo = pageStatusMap.get(page.slug);
                  const isPublished = statusInfo ? statusInfo.isPublished : true;
                  const sectionCount = sectionCountMap.get(page.slug) || 0;

                  return (
                    <tr
                      key={page.slug}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 0.15s',
                      }}
                      className="hover:bg-slate-900/50"
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary, #f8fafc)', fontSize: '15px' }}>
                          {page.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', marginTop: '2px' }}>
                          {page.description}
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#38bdf8',
                            background: 'rgba(56, 189, 248, 0.1)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {page.route}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#cbd5e1',
                            background: '#1e293b',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontWeight: 500,
                          }}
                        >
                          {page.typeLabel}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isPublished ? '#10b981' : '#f59e0b',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckCircle size={12} />
                          {isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <Sliders size={14} className="text-sky-400" />
                          <strong>{sectionCount}</strong> sections
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link
                            href={page.route}
                            target="_blank"
                            className="admin-button secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Preview Live Website Page"
                          >
                            <Eye size={14} /> Preview
                          </Link>

                          <Link
                            href={`/admin/pages/${page.slug}`}
                            className="admin-button primary"
                            style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Edit3 size={14} /> Edit Page
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: DYNAMIC CONTENT ENTITIES */}
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
            <Layers size={20} className="text-amber-400" />
            Dynamic Content Entities & Directory Managers
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Manage individual database item records (e.g. specific Practice Areas, Industry Verticals, Articles, Events, Team Bios, FAQs). Page presentation and layout are controlled via the page editors above.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {DYNAMIC_ENTITIES_REGISTRY.map((entity) => (
              <Link
                key={entity.name}
                href={entity.href}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '18px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s',
                }}
                className="hover:border-sky-500"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {entity.icon}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                      {entity.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {entity.description}
                    </div>
                  </div>
                </div>

                <ArrowRight size={16} className="text-slate-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
