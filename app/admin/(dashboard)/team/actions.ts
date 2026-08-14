'use server';

import { db } from '@/lib/db';
import { teamMembers, teamMemberExpertise } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { teamMemberSchema, teamMemberExpertiseSchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTeamMembers(options?: {
  search?: string;
  category?: string;
  publishedOnly?: boolean;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(teamMembers.name, `%${options.search}%`));
  }
  if (options?.category && options.category !== 'all') {
    conditions.push(eq(teamMembers.category, options.category));
  }
  if (options?.publishedOnly) {
    conditions.push(eq(teamMembers.isPublished, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(teamMembers)
    .where(whereClause)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name));
}

export async function getTeamMemberById(id: number) {
  await requireEditor();

  const [member] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);

  if (!member) return null;

  const expertise = await db
    .select()
    .from(teamMemberExpertise)
    .where(eq(teamMemberExpertise.teamMemberId, id))
    .orderBy(asc(teamMemberExpertise.sortOrder));

  return { ...member, expertise };
}

export async function createTeamMemberAction(data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.name);

  const parsed = teamMemberSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [created] = await db
    .insert(teamMembers)
    .values({
      ...parsed,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath('/admin/team');
  return created;
}

export async function updateTeamMemberAction(id: number, data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.name);

  const parsed = teamMemberSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [updated] = await db
    .update(teamMembers)
    .set({
      ...parsed,
      updatedAt: new Date(),
    })
    .where(eq(teamMembers.id, id))
    .returning();

  revalidatePath('/admin/team');
  revalidatePath(`/admin/team/${id}`);
  return updated;
}

export async function deleteTeamMemberAction(id: number) {
  await requireEditor();

  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidatePath('/admin/team');
  return { success: true };
}

export async function toggleTeamMemberPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(teamMembers)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(teamMembers.id, id));

  revalidatePath('/admin/team');
  return { success: true };
}

export async function saveExpertiseAction(
  teamMemberId: number,
  items: Array<{ id?: number; iconName?: string; title: string; description?: string; sortOrder?: number }>
) {
  await requireEditor();

  // Simple sync: delete existing expertise for this team member and re-insert
  await db.delete(teamMemberExpertise).where(eq(teamMemberExpertise.teamMemberId, teamMemberId));

  if (items.length > 0) {
    const valuesToInsert = items.map((item, idx) => ({
      teamMemberId,
      iconName: item.iconName || 'CheckCircle2',
      title: item.title,
      description: item.description || '',
      sortOrder: item.sortOrder ?? idx,
    }));
    await db.insert(teamMemberExpertise).values(valuesToInsert);
  }

  revalidatePath(`/admin/team/${teamMemberId}`);
  return { success: true };
}
