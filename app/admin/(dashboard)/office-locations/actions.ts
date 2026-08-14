'use server';

import { db } from '@/lib/db';
import { officeLocations } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { officeLocationSchema } from '@/lib/validation/cms';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getOfficeLocations(search?: string) {
  await requireEditor();

  const conditions = [];

  if (search) {
    conditions.push(ilike(officeLocations.city, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(officeLocations)
    .where(whereClause)
    .orderBy(asc(officeLocations.sortOrder), asc(officeLocations.city));
}

export async function getOfficeLocationById(id: number) {
  await requireEditor();

  const [office] = await db.select().from(officeLocations).where(eq(officeLocations.id, id)).limit(1);
  return office || null;
}

export async function createOfficeLocationAction(data: any) {
  await requireEditor();

  const parsed = officeLocationSchema.parse(data);

  const [created] = await db
    .insert(officeLocations)
    .values(parsed)
    .returning();

  revalidatePath('/admin/office-locations');
  return created;
}

export async function updateOfficeLocationAction(id: number, data: any) {
  await requireEditor();

  const parsed = officeLocationSchema.parse(data);

  const [updated] = await db
    .update(officeLocations)
    .set(parsed)
    .where(eq(officeLocations.id, id))
    .returning();

  revalidatePath('/admin/office-locations');
  return updated;
}

export async function deleteOfficeLocationAction(id: number) {
  await requireEditor();

  await db.delete(officeLocations).where(eq(officeLocations.id, id));
  revalidatePath('/admin/office-locations');
  return { success: true };
}

export async function toggleOfficePublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(officeLocations)
    .set({ isPublished })
    .where(eq(officeLocations.id, id));

  revalidatePath('/admin/office-locations');
  return { success: true };
}
