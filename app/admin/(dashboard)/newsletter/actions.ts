'use server';

import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getNewsletterSubscribers(options?: {
  search?: string;
  activeOnly?: boolean;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(newsletterSubscribers.email, `%${options.search}%`));
  }
  if (options?.activeOnly) {
    conditions.push(eq(newsletterSubscribers.isActive, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(newsletterSubscribers)
    .where(whereClause)
    .orderBy(desc(newsletterSubscribers.subscribedAt));
}

export async function toggleSubscriberActiveAction(id: number, isActive: boolean) {
  await requireEditor();

  await db
    .update(newsletterSubscribers)
    .set({
      isActive,
      unsubscribedAt: isActive ? null : new Date(),
    })
    .where(eq(newsletterSubscribers.id, id));

  revalidatePath('/admin/newsletter');
  return { success: true };
}

export async function deleteSubscriberAction(id: number) {
  await requireEditor();

  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  revalidatePath('/admin/newsletter');
  return { success: true };
}
