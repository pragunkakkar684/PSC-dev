'use server';

import { db } from '@/lib/db';
import {
  practiceAreas,
  practiceAreaServices,
  practiceAreaCapabilities,
  practiceAreaExperts,
  practiceAreaInsights,
  industryPracticeAreas,
  industries,
  teamMembers,
  insightsArticles,
} from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { practiceAreaSchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, asc, desc } from 'drizzle-orm';
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

export async function getPracticeAreaWithRelations(id: number) {
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

  const capabilities = await db
    .select()
    .from(practiceAreaCapabilities)
    .where(eq(practiceAreaCapabilities.practiceAreaId, id))
    .orderBy(asc(practiceAreaCapabilities.sortOrder));

  const indLinks = await db
    .select({ id: industryPracticeAreas.id, ind: industries })
    .from(industryPracticeAreas)
    .innerJoin(industries, eq(industryPracticeAreas.industryId, industries.id))
    .where(eq(industryPracticeAreas.practiceAreaId, id))
    .orderBy(asc(industryPracticeAreas.sortOrder));

  const expertLinks = await db
    .select({ id: practiceAreaExperts.id, tm: teamMembers })
    .from(practiceAreaExperts)
    .innerJoin(teamMembers, eq(practiceAreaExperts.teamMemberId, teamMembers.id))
    .where(eq(practiceAreaExperts.practiceAreaId, id))
    .orderBy(asc(practiceAreaExperts.sortOrder));

  const insightLinks = await db
    .select({ id: practiceAreaInsights.id, art: insightsArticles })
    .from(practiceAreaInsights)
    .innerJoin(insightsArticles, eq(practiceAreaInsights.articleId, insightsArticles.id))
    .where(eq(practiceAreaInsights.practiceAreaId, id))
    .orderBy(asc(practiceAreaInsights.sortOrder));

  return {
    ...area,
    services,
    capabilities,
    industries: indLinks,
    experts: expertLinks,
    insights: insightLinks,
  };
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
  revalidatePath('/practice-areas');
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
  revalidatePath('/practice-areas');
  revalidatePath(`/practice-areas/${updated.slug}`);
  revalidatePath('/');
  return updated;
}

export async function deletePracticeAreaAction(id: number) {
  await requireEditor();

  await db.delete(practiceAreas).where(eq(practiceAreas.id, id));
  revalidatePath('/admin/practice-areas');
  revalidatePath('/practice-areas');
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
  revalidatePath('/practice-areas');
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
  revalidatePath('/practice-areas');
  return { success: true };
}

// ─── CAPABILITIES ACTIONS ──────────────────────────────────────────────────
export async function createPracticeAreaCapabilityAction(data: {
  practiceAreaId: number;
  title: string;
  description?: string;
  sortOrder?: number;
}) {
  await requireEditor();
  const [c] = await db
    .insert(practiceAreaCapabilities)
    .values({
      practiceAreaId: data.practiceAreaId,
      title: data.title,
      description: data.description || null,
      sortOrder: data.sortOrder || 0,
      isVisible: true,
    })
    .returning();
  revalidatePath(`/admin/practice-areas/${data.practiceAreaId}`);
  revalidatePath('/practice-areas');
  return c;
}

export async function updatePracticeAreaCapabilityAction(
  id: number,
  data: { title?: string; description?: string; sortOrder?: number; isVisible?: boolean }
) {
  await requireEditor();
  const [c] = await db
    .update(practiceAreaCapabilities)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(practiceAreaCapabilities.id, id))
    .returning();
  revalidatePath('/admin/practice-areas');
  revalidatePath('/practice-areas');
  return c;
}

export async function deletePracticeAreaCapabilityAction(id: number, practiceAreaId: number) {
  await requireEditor();
  await db.delete(practiceAreaCapabilities).where(eq(practiceAreaCapabilities.id, id));
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

// ─── RELATIONAL ACTIONS ────────────────────────────────────────────────────
export async function addPracticeAreaIndustryAction(practiceAreaId: number, industryId: number) {
  await requireEditor();
  await db
    .insert(industryPracticeAreas)
    .values({ practiceAreaId, industryId, sortOrder: 0 })
    .onConflictDoNothing();
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

export async function removePracticeAreaIndustryAction(linkId: number, practiceAreaId: number) {
  await requireEditor();
  await db.delete(industryPracticeAreas).where(eq(industryPracticeAreas.id, linkId));
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

export async function addPracticeAreaExpertAction(practiceAreaId: number, teamMemberId: number) {
  await requireEditor();
  await db
    .insert(practiceAreaExperts)
    .values({ practiceAreaId, teamMemberId, sortOrder: 0 })
    .onConflictDoNothing();
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

export async function removePracticeAreaExpertAction(linkId: number, practiceAreaId: number) {
  await requireEditor();
  await db.delete(practiceAreaExperts).where(eq(practiceAreaExperts.id, linkId));
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

export async function addPracticeAreaInsightAction(practiceAreaId: number, articleId: number) {
  await requireEditor();
  await db
    .insert(practiceAreaInsights)
    .values({ practiceAreaId, articleId, sortOrder: 0 })
    .onConflictDoNothing();
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

export async function removePracticeAreaInsightAction(linkId: number, practiceAreaId: number) {
  await requireEditor();
  await db.delete(practiceAreaInsights).where(eq(practiceAreaInsights.id, linkId));
  revalidatePath(`/admin/practice-areas/${practiceAreaId}`);
  revalidatePath('/practice-areas');
  return { success: true };
}

export async function getPracticeAreaPickerOptions() {
  await requireEditor();
  const [inds, tms, arts] = await Promise.all([
    db.select().from(industries).where(eq(industries.isPublished, true)).orderBy(asc(industries.name)),
    db.select().from(teamMembers).where(eq(teamMembers.isPublished, true)).orderBy(asc(teamMembers.name)),
    db.select().from(insightsArticles).where(eq(insightsArticles.isPublished, true)).orderBy(desc(insightsArticles.id)),
  ]);
  return { allIndustries: inds, allTeamMembers: tms, allInsightsArticles: arts };
}
