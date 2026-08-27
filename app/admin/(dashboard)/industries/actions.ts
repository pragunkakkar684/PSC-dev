'use server';

import { db } from '@/lib/db';
import { industries } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { industrySchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getIndustries(options?: {
  search?: string;
  publishedOnly?: boolean;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(industries.name, `%${options.search}%`));
  }
  if (options?.publishedOnly) {
    conditions.push(eq(industries.isPublished, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(industries)
    .where(whereClause)
    .orderBy(asc(industries.sortOrder), asc(industries.name));
}

export async function getIndustryById(id: number) {
  await requireEditor();

  const [industry] = await db
    .select()
    .from(industries)
    .where(eq(industries.id, id))
    .limit(1);

  return industry || null;
}

export async function createIndustryAction(data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.name);

  const parsed = industrySchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [created] = await db
    .insert(industries)
    .values({
      ...parsed,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath('/admin/industries');
  revalidatePath('/');
  return created;
}

export async function updateIndustryAction(id: number, data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.name);

  const parsed = industrySchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [updated] = await db
    .update(industries)
    .set({
      ...parsed,
      updatedAt: new Date(),
    })
    .where(eq(industries.id, id))
    .returning();

  revalidatePath('/admin/industries');
  revalidatePath(`/admin/industries/${id}`);
  revalidatePath('/');
  return updated;
}

export async function deleteIndustryAction(id: number) {
  await requireEditor();

  await db.delete(industries).where(eq(industries.id, id));
  revalidatePath('/admin/industries');
  revalidatePath('/');
  return { success: true };
}

export async function toggleIndustryPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(industries)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(industries.id, id));

  revalidatePath('/admin/industries');
  revalidatePath('/');
  return { success: true };
}
