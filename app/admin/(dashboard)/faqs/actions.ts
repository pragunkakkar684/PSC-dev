'use server';

import { db } from '@/lib/db';
import { faqs } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { faqSchema } from '@/lib/validation/cms';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getFaqs(options?: {
  search?: string;
  pageContext?: string;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(faqs.question, `%${options.search}%`));
  }
  if (options?.pageContext && options.pageContext !== 'all') {
    conditions.push(eq(faqs.category, options.pageContext));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(faqs)
    .where(whereClause)
    .orderBy(asc(faqs.sortOrder), asc(faqs.id));
}

export async function getFaqById(id: number) {
  await requireEditor();

  const [faq] = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return faq || null;
}

export async function createFaqAction(data: any) {
  await requireEditor();

  const parsed = faqSchema.parse(data);

  const [created] = await db
    .insert(faqs)
    .values(parsed)
    .returning();

  revalidatePath('/admin/faqs');
  return created;
}

export async function updateFaqAction(id: number, data: any) {
  await requireEditor();

  const parsed = faqSchema.parse(data);

  const [updated] = await db
    .update(faqs)
    .set(parsed)
    .where(eq(faqs.id, id))
    .returning();

  revalidatePath('/admin/faqs');
  return updated;
}

export async function deleteFaqAction(id: number) {
  await requireEditor();

  await db.delete(faqs).where(eq(faqs.id, id));
  revalidatePath('/admin/faqs');
  return { success: true };
}

export async function toggleFaqPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(faqs)
    .set({ isPublished })
    .where(eq(faqs.id, id));

  revalidatePath('/admin/faqs');
  return { success: true };
}
