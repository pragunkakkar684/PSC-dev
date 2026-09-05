/**
 * PSC Global — Site-Wide CMS Server Actions
 */
'use server';

import { db } from '@/lib/db';
import {
  sitePages,
  pageSections,
  pageSeo,
  careersPositions,
  heroSections,
  stats,
  practiceAreas,
  practiceAreaServices,
} from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireEditor } from '@/lib/auth/permissions';

export async function updateSitePageStatus(slug: string, isPublished: boolean) {
  await requireEditor();

  const [existing] = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);

  if (!existing) {
    await db.insert(sitePages).values({
      slug,
      title: slug.replace(/-/g, ' ').toUpperCase(),
      isPublished,
    });
  } else {
    await db
      .update(sitePages)
      .set({ isPublished, updatedAt: new Date() })
      .where(eq(sitePages.slug, slug));
  }

  revalidatePath('/admin/pages');
  revalidatePath(`/${slug === 'home' ? '' : slug}`);
  return { success: true };
}

export async function updatePageSection(id: number, data: Partial<typeof pageSections.$inferInsert>) {
  await requireEditor();

  const [updated] = await db
    .update(pageSections)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(pageSections.id, id))
    .returning();

  if (updated?.pageSlug) {
    revalidatePath(`/${updated.pageSlug === 'home' ? '' : updated.pageSlug}`);
  }
  revalidatePath('/admin/pages');
  return updated;
}

export async function reorderPageSections(pageSlug: string, sectionIds: number[]) {
  await requireEditor();

  for (let i = 0; i < sectionIds.length; i++) {
    await db
      .update(pageSections)
      .set({ sortOrder: i, updatedAt: new Date() })
      .where(and(eq(pageSections.id, sectionIds[i]), eq(pageSections.pageSlug, pageSlug)));
  }

  revalidatePath(`/${pageSlug === 'home' ? '' : pageSlug}`);
  return { success: true };
}

export async function createPageSection(data: typeof pageSections.$inferInsert) {
  await requireEditor();

  const [created] = await db.insert(pageSections).values(data).returning();

  revalidatePath(`/${created.pageSlug === 'home' ? '' : created.pageSlug}`);
  return created;
}

export async function deletePageSection(id: number) {
  await requireEditor();

  const [deleted] = await db.delete(pageSections).where(eq(pageSections.id, id)).returning();

  if (deleted?.pageSlug) {
    revalidatePath(`/${deleted.pageSlug === 'home' ? '' : deleted.pageSlug}`);
  }
  return { success: true };
}

export async function updatePageSEO(
  targetType: string,
  targetIdentifier: string,
  data: Partial<typeof pageSeo.$inferInsert>
) {
  await requireEditor();

  const [existing] = await db
    .select()
    .from(pageSeo)
    .where(and(eq(pageSeo.targetType, targetType), eq(pageSeo.targetIdentifier, targetIdentifier)))
    .limit(1);

  let result;
  if (existing) {
    [result] = await db
      .update(pageSeo)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(pageSeo.id, existing.id))
      .returning();
  } else {
    [result] = await db
      .insert(pageSeo)
      .values({
        targetType,
        targetIdentifier,
        ...data,
      })
      .returning();
  }

  revalidatePath('/admin/pages');
  if (targetType === 'page') {
    revalidatePath(`/${targetIdentifier === 'home' ? '' : targetIdentifier}`);
  }
  return result;
}

export async function saveCareersPosition(data: Partial<typeof careersPositions.$inferInsert>) {
  await requireEditor();

  let result;
  if (data.id) {
    [result] = await db
      .update(careersPositions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(careersPositions.id, data.id))
      .returning();
  } else {
    [result] = await db
      .insert(careersPositions)
      .values({
        title: data.title || 'Untitled Position',
        department: data.department || 'General Advisory',
        location: data.location || 'London, UK',
        type: data.type || 'Full-time',
        description: data.description || '',
        requirements: data.requirements || '',
        applicationUrl: data.applicationUrl || '/contact',
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
  }

  revalidatePath('/career');
  return result;
}

export async function deleteCareersPosition(id: number) {
  await requireEditor();

  await db.delete(careersPositions).where(eq(careersPositions.id, id));
  revalidatePath('/career');
  return { success: true };
}

export async function updatePageHero(pageSlug: string, data: Partial<typeof heroSections.$inferInsert>) {
  await requireEditor();

  const [existing] = await db
    .select()
    .from(heroSections)
    .where(eq(heroSections.pageSlug, pageSlug))
    .limit(1);

  let result;
  if (existing) {
    [result] = await db
      .update(heroSections)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(heroSections.id, existing.id))
      .returning();
  } else {
    [result] = await db
      .insert(heroSections)
      .values({
        pageSlug,
        eyebrow: data.eyebrow || '',
        heading: data.heading || '',
        subheading: data.subheading || '',
        imageUrl: data.imageUrl || '',
        cta1Text: data.cta1Text || '',
        cta1Href: data.cta1Href || '',
        cta2Text: data.cta2Text || '',
        cta2Href: data.cta2Href || '',
      })
      .returning();
  }

  revalidatePath(`/${pageSlug === 'home' ? '' : pageSlug}`);
  return result;
}

export async function updateStatMetric(id: number, data: Partial<typeof stats.$inferInsert>) {
  await requireEditor();

  const [updated] = await db
    .update(stats)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(stats.id, id))
    .returning();

  revalidatePath('/practice-areas');
  revalidatePath('/about');
  revalidatePath('/');
  return updated;
}

export async function updatePracticeAreaInline(id: number, data: Partial<typeof practiceAreas.$inferInsert>) {
  await requireEditor();

  const [updated] = await db
    .update(practiceAreas)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(practiceAreas.id, id))
    .returning();

  revalidatePath('/practice-areas');
  revalidatePath(`/practice-areas/${updated.slug}`);
  return updated;
}
