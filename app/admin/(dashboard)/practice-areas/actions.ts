'use server';

import { db } from '@/lib/db';
import { practiceAreas, practiceAreaServices } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { practiceAreaSchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getPracticeAreas(options?: {
  search?: string;
  publishedOnly?: boolean;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(practiceAreas.name, `%${options.search}%`));
  }
  if (options?.publishedOnly) {
    conditions.push(eq(practiceAreas.isPublished, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(practiceAreas)
    .where(whereClause)
    .orderBy(asc(practiceAreas.sortOrder), asc(practiceAreas.name));
}

export async function getPracticeAreaById(id: number) {
  await requireEditor();

  const [area] = await db
    .select()
    .from(practiceAreas)
    .where(eq(practiceAreas.id, id))
    .limit(1);

  if (!area) return null;

  const services = await db
    .select()
    .from(practiceAreaServices)
    .where(eq(practiceAreaServices.practiceAreaId, id))
    .orderBy(asc(practiceAreaServices.sortOrder));

  return { ...area, services };
}

export async function createPracticeAreaAction(data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.name);

  const parsed = practiceAreaSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [created] = await db
    .insert(practiceAreas)
    .values({
      ...parsed,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath('/admin/practice-areas');
  revalidatePath('/');
  return created;
}

export async function updatePracticeAreaAction(id: number, data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.name);

  const parsed = practiceAreaSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [updated] = await db
    .update(practiceAreas)
    .set({
      ...parsed,
      updatedAt: new Date(),
    })
    .where(eq(practiceAreas.id, id))
    .returning();

  revalidatePath('/admin/practice-areas');
  revalidatePath(`/admin/practice-areas/${id}`);
  revalidatePath('/');
  return updated;
}

export async function deletePracticeAreaAction(id: number) {
  await requireEditor();

  await db.delete(practiceAreas).where(eq(practiceAreas.id, id));
  revalidatePath('/admin/practice-areas');
  revalidatePath('/');
  return { success: true };
}

export async function togglePracticeAreaPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(practiceAreas)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(practiceAreas.id, id));

  revalidatePath('/admin/practice-areas');
  revalidatePath('/');
  return { success: true };
}

export async function savePracticeAreaServicesAction(
  practiceAreaId: number,
  services: Array<{ id?: number; name: string; sortOrder?: number }>
) {
  await requireEditor();

  await db.delete(practiceAreaServices).where(eq(practiceAreaServices.practiceAreaId, practiceAreaId));

  if (services.length > 0) {
    const valuesToInsert = services.map((s, idx) => ({
      practiceAreaId,
      name: s.name,
      sortOrder: s.sortOrder ?? idx,
    }));
    await db.insert(practiceAreaServices).values(valuesToInsert);
  }

  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/');
  return { success: true };
}
