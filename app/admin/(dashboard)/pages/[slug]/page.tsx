import { AdminHeader } from '../../components/AdminHeader';
import { PageEditorClient } from './PageEditorClient';
import { requireAuth } from '@/lib/auth/permissions';
import { db } from '@/lib/db';
import {
  sitePages,
  pageSections,
  heroSections,
  pageSeo,
  careersPositions,
} from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Edit ${slug.toUpperCase()} Page CMS`,
  };
}

const PAGE_TITLE_MAP: Record<string, string> = {
  home: 'Home Page',
  about: 'About Us',
  contact: 'Contact Us',
  career: 'Careers',
  events: 'Events Overview',
  gcc: 'GCC Advisory',
  industries: 'Industries Overview',
  insights: 'Insights Overview',
  partner: 'Partner Network',
  'practice-areas': 'Practice Areas Overview',
  team: 'Leadership & Team',
  'book-consultation': 'Book Consultation',
};

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const pageTitle = PAGE_TITLE_MAP[slug] || slug.replace(/-/g, ' ').toUpperCase();

  // Fetch page entity, sections, hero, seo, and careers positions safely
  let pageRes: (typeof sitePages.$inferSelect)[] = [];
  let sections: (typeof pageSections.$inferSelect)[] = [];
  let heroList: (typeof heroSections.$inferSelect)[] = [];
  let seoList: (typeof pageSeo.$inferSelect)[] = [];
  let careers: (typeof careersPositions.$inferSelect)[] = [];

  try {
    [pageRes, sections, heroList, seoList, careers] = await Promise.all([
      db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1),
      db.select().from(pageSections).where(eq(pageSections.pageSlug, slug)).orderBy(asc(pageSections.sortOrder)),
      db.select().from(heroSections).where(eq(heroSections.pageSlug, slug)).limit(1),
      db.select().from(pageSeo).where(and(eq(pageSeo.targetType, 'page'), eq(pageSeo.targetIdentifier, slug))).limit(1),
      slug === 'career'
        ? db.select().from(careersPositions).orderBy(asc(careersPositions.sortOrder))
        : Promise.resolve([]),
    ]);
  } catch (err) {
    console.error(`Error fetching page data for ${slug}:`, err);
  }

  const page = pageRes[0] || null;
  const hero = heroList[0] || null;
  const seo = seoList[0] || null;
  const isPublished = page ? page.isPublished : true;

  return (
    <>
      <AdminHeader title={`Edit Page: ${pageTitle}`} user={user} />

      <div className="admin-content">
        <PageEditorClient
          slug={slug}
          pageTitle={pageTitle}
          isPublished={isPublished}
          hero={hero || null}
          sections={sections}
          seo={seo || null}
          careers={careers}
        />
      </div>
    </>
  );
}
