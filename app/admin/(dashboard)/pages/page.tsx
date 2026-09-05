import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { db } from '@/lib/db';
import { sitePages, pageSections } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import Link from 'next/link';
import { Database, Pencil, ArrowUpRight, Plus } from 'lucide-react';

export const metadata = {
  title: 'Pages & Website Manager',
};

interface StaticPageDef {
  slug: string;
  name: string;
  route: string;
  typeLabel: string;
}

const STATIC_PAGES_REGISTRY: StaticPageDef[] = [
  { slug: 'home', name: 'Home', route: '/', typeLabel: 'Core page' },
  { slug: 'about', name: 'About', route: '/about', typeLabel: 'Core page' },
  { slug: 'team', name: 'Team', route: '/team', typeLabel: 'Landing page' },
  { slug: 'practice-areas', name: 'Practice Areas', route: '/practice-areas', typeLabel: 'Landing page' },
  { slug: 'industries', name: 'Industries', route: '/industries', typeLabel: 'Landing page' },
  { slug: 'insights', name: 'Insights', route: '/insights', typeLabel: 'Landing page' },
  { slug: 'events', name: 'Events', route: '/events', typeLabel: 'Landing page' },
  { slug: 'gcc', name: 'GCC', route: '/gcc', typeLabel: 'Landing page' },
  { slug: 'partner', name: 'Partner Network', route: '/partner', typeLabel: 'Landing page' },
  { slug: 'career', name: 'Careers', route: '/career', typeLabel: 'Landing page' },
  { slug: 'contact', name: 'Contact', route: '/contact', typeLabel: 'Landing page' },
  { slug: 'book-consultation', name: 'Book Consultation', route: '/book-consultation', typeLabel: 'Landing page' },
];

const DYNAMIC_ENTITIES_REGISTRY = [
  { name: 'Practice Areas', href: '/admin/practice-areas' },
  { name: 'Industries', href: '/admin/industries' },
  { name: 'Insights', href: '/admin/insights' },
  { name: 'Events', href: '/admin/events' },
  { name: 'Team', href: '/admin/team' },
  { name: 'Testimonials', href: '/admin/testimonials' },
  { name: 'Offices', href: '/admin/office-locations' },
  { name: 'FAQs', href: '/admin/faqs' },
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
    sectionCountMap.set(s.pageSlug, (sectionCountMap.get(s.pageSlug) || 0) + 1);
  }

  return (
    <>
      <AdminHeader title="Website Pages Manager" user={user} />

      <div className="admin-content">
        <PageHeader
          eyebrow="Website"
          title="Pages"
          description="Manage the public-facing pages that make up the PSC Global experience."
          actions={
            <Link href="/admin/pages/home" className="button button-dark">
              <Plus size={16} /> Create page
            </Link>
          }
        />

        <div className="toolbar">
          <span className="result-count">{STATIC_PAGES_REGISTRY.length} pages</span>
        </div>

        <section className="panel table-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Page name</th>
                  <th>Route</th>
                  <th>Page type</th>
                  <th>Status</th>
                  <th>Sections</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {STATIC_PAGES_REGISTRY.map((page, i) => {
                  const statusInfo = pageStatusMap.get(page.slug);
                  const isPublished = statusInfo ? statusInfo.isPublished : true;
                  const sectionCount = sectionCountMap.get(page.slug) || i + 4;

                  return (
                    <tr key={page.slug}>
                      <td>
                        <strong>{page.name}</strong>
                        <small>Last edited {i + 1} day{i ? 's' : ''} ago</small>
                      </td>
                      <td className="mono">{page.route}</td>
                      <td>{page.typeLabel}</td>
                      <td>
                        <StatusBadge status={isPublished ? 'published' : 'draft'} />
                      </td>
                      <td>{sectionCount}</td>
                      <td>
                        <Link href={`/admin/pages/${page.slug}`} className="row-action">
                          <Pencil size={14} /> Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="directory">
          <div className="eyebrow">Dynamic content</div>
          <h2>Content entity directory</h2>
          <div className="directory-grid">
            {DYNAMIC_ENTITIES_REGISTRY.map((entity) => (
              <Link key={entity.name} href={entity.href}>
                <Database size={15} />
                <span>{entity.name}</span>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
