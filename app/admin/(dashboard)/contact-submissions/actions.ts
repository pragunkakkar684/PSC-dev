'use server';

import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getContactSubmissions(options?: {
  search?: string;
  status?: string;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(contactSubmissions.name, `%${options.search}%`));
  }
  if (options?.status && options.status !== 'all') {
    conditions.push(eq(contactSubmissions.status, options.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(contactSubmissions)
    .where(whereClause)
    .orderBy(desc(contactSubmissions.createdAt));
}

export async function getContactSubmissionById(id: number) {
  await requireEditor();

  const [sub] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
  return sub || null;
}

export async function updateContactStatusAction(id: number, status: string) {
  await requireEditor();

  const allowedStatuses = ['new', 'read', 'responded', 'archived'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid submission status');
  }

  const [updated] = await db
    .update(contactSubmissions)
    .set({ status })
    .where(eq(contactSubmissions.id, id))
    .returning();

  revalidatePath('/admin/contact-submissions');
  return updated;
}
