'use server';

import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { auth } from '@/auth';
import { eq, and, or, ilike, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function checkPortalAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  const role = (session.user as any).role;
  const portalRole = (session.user as any).portalRole;
  const isPortalAdmin = portalRole === 'PORTAL_ADMIN' || role === 'admin' || role === 'editor' || role === 'superadmin';
  if (!isPortalAdmin) {
    throw new Error('Forbidden: Client Portal Admin access required');
  }
  return session.user;
}

export async function getPortalConsultations(options?: {
  search?: string;
  status?: string;
  practiceArea?: string;
}) {
  await checkPortalAdmin();

  const conditions = [];

  if (options?.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    conditions.push(
      or(
        ilike(contactSubmissions.fullName, term),
        ilike(contactSubmissions.company, term),
        ilike(contactSubmissions.email, term)
      )
    );
  }

  if (options?.status && options.status !== 'all') {
    conditions.push(eq(contactSubmissions.status, options.status));
  }

  if (options?.practiceArea && options.practiceArea !== 'all') {
    conditions.push(eq(contactSubmissions.practiceArea, options.practiceArea));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(contactSubmissions)
    .where(whereClause)
    .orderBy(desc(contactSubmissions.createdAt));
}

export async function updatePortalConsultationStatusAction(id: number, status: string) {
  await checkPortalAdmin();

  const allowedStatuses = ['new', 'read', 'responded', 'archived'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid submission status');
  }

  const [updated] = await db
    .update(contactSubmissions)
    .set({ status })
    .where(eq(contactSubmissions.id, id))
    .returning();

  revalidatePath('/client-portal/admin/consultations');
  return updated;
}

export async function deletePortalConsultationAction(id: number) {
  await checkPortalAdmin();

  await db
    .delete(contactSubmissions)
    .where(eq(contactSubmissions.id, id));

  revalidatePath('/client-portal/admin/consultations');
  return { success: true };
}
