'use server';

import { db } from '@/lib/db';
import { heroSections } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { heroSectionSchema } from '@/lib/validation/cms';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const PAGE_SLUGS = [
  'home',
  'about',
  'contact',
  'events',
  'gcc',
  'industries',
  'insights',
  'partner',
  'practice-areas',
  'team',
];

export async function getHeroSections() {
  await requireEditor();

  const existing = await db.select().from(heroSections).orderBy(asc(heroSections.pageSlug));

  // Ensure all 10 page slugs exist in database
  const existingMap = new Map(existing.map((item) => [item.pageSlug, item]));

  const result = [];
  for (const slug of PAGE_SLUGS) {
    if (existingMap.has(slug)) {
      result.push(existingMap.get(slug)!);
    } else {
      // Seed missing page hero record
      const [inserted] = await db
        .insert(heroSections)
        .values({
          pageSlug: slug,
          eyebrow: slug.toUpperCase(),
          heading: `Global Excellence in ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
          subheading: 'Architecting resilient operating models and cross-border solutions.',
          updatedAt: new Date(),
        })
        .returning();
      result.push(inserted);
    }
  }

  return result;
}

export async function getHeroSectionBySlug(pageSlug: string) {
  await requireEditor();

  const [hero] = await db.select().from(heroSections).where(eq(heroSections.pageSlug, pageSlug)).limit(1);
  return hero || null;
}

export async function updateHeroSectionAction(pageSlug: string, data: any) {
  await requireEditor();

  const parsed = heroSectionSchema.parse({
    ...data,
    pageSlug,
  });

  const [existing] = await db.select().from(heroSections).where(eq(heroSections.pageSlug, pageSlug)).limit(1);

  let updated;
  if (existing) {
    [updated] = await db
      .update(heroSections)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(eq(heroSections.pageSlug, pageSlug))
      .returning();
  } else {
    [updated] = await db
      .insert(heroSections)
      .values({
        ...parsed,
        updatedAt: new Date(),
      })
      .returning();
  }

  revalidatePath('/admin/pages');
  revalidatePath('/');
  if (pageSlug === 'home') {
    revalidatePath('/', 'layout');
  } else {
    revalidatePath(`/${pageSlug}`);
  }
  return updated;
}
