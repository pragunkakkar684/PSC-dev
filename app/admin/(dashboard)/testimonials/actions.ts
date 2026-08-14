'use server';

import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { testimonialSchema } from '@/lib/validation/cms';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTestimonials(search?: string) {
  await requireEditor();

  const conditions = [];

  if (search) {
    conditions.push(ilike(testimonials.quote, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(testimonials)
    .where(whereClause)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
}

export async function getTestimonialById(id: number) {
  await requireEditor();

  const [test] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return test || null;
}

export async function createTestimonialAction(data: any) {
  await requireEditor();

  const parsed = testimonialSchema.parse(data);

  const [created] = await db
    .insert(testimonials)
    .values(parsed)
    .returning();

  revalidatePath('/admin/testimonials');
  return created;
}

export async function updateTestimonialAction(id: number, data: any) {
  await requireEditor();

  const parsed = testimonialSchema.parse(data);

  const [updated] = await db
    .update(testimonials)
    .set(parsed)
    .where(eq(testimonials.id, id))
    .returning();

  revalidatePath('/admin/testimonials');
  return updated;
}

export async function deleteTestimonialAction(id: number) {
  await requireEditor();

  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath('/admin/testimonials');
  return { success: true };
}

export async function toggleTestimonialPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(testimonials)
    .set({ isPublished })
    .where(eq(testimonials.id, id));

  revalidatePath('/admin/testimonials');
  return { success: true };
}
