'use server';

import { db } from '@/lib/db';
import { industries } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { industrySchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, asc, desc } from 'drizzle-orm';
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

// ─── RELATIONAL ACTIONS ──────────────────────────────────────────────────────

import {
  industryChallenges,
  industrySolutions,
  industryPracticeAreas,
  industryExperts,
  industryInsights,
  practiceAreas,
  teamMembers,
  insightsArticles,
} from '@/lib/db/schema';

export async function getIndustryWithRelations(id: number) {
  await requireEditor();

  const [industry] = await db.select().from(industries).where(eq(industries.id, id)).limit(1);
  if (!industry) return null;

  const challenges = await db
    .select()
    .from(industryChallenges)
    .where(eq(industryChallenges.industryId, id))
    .orderBy(asc(industryChallenges.sortOrder));

  const solutions = await db
    .select()
    .from(industrySolutions)
    .where(eq(industrySolutions.industryId, id))
    .orderBy(asc(industrySolutions.sortOrder));

  const paLinks = await db
    .select({ id: industryPracticeAreas.id, pa: practiceAreas })
    .from(industryPracticeAreas)
    .innerJoin(practiceAreas, eq(industryPracticeAreas.practiceAreaId, practiceAreas.id))
    .where(eq(industryPracticeAreas.industryId, id))
    .orderBy(asc(industryPracticeAreas.sortOrder));

  const expertLinks = await db
    .select({ id: industryExperts.id, tm: teamMembers })
    .from(industryExperts)
    .innerJoin(teamMembers, eq(industryExperts.teamMemberId, teamMembers.id))
    .where(eq(industryExperts.industryId, id))
    .orderBy(asc(industryExperts.sortOrder));

  const insightLinks = await db
    .select({ id: industryInsights.id, art: insightsArticles })
    .from(industryInsights)
    .innerJoin(insightsArticles, eq(industryInsights.articleId, insightsArticles.id))
    .where(eq(industryInsights.industryId, id))
    .orderBy(asc(industryInsights.sortOrder));

  return {
    ...industry,
    challenges,
    solutions,
    practiceAreas: paLinks,
    experts: expertLinks,
    insights: insightLinks,
  };
}

export async function createIndustryChallengeAction(data: {
  industryId: number;
  number?: string;
  title: string;
  description?: string;
  sortOrder?: number;
}) {
  await requireEditor();
  const [c] = await db
    .insert(industryChallenges)
    .values({
      industryId: data.industryId,
      number: data.number || '01.',
      title: data.title,
      description: data.description || null,
      sortOrder: data.sortOrder || 0,
      isVisible: true,
    })
    .returning();
  revalidatePath(`/admin/industries/${data.industryId}`);
  revalidatePath('/industries');
  return c;
}

export async function updateIndustryChallengeAction(
  id: number,
  data: { number?: string; title?: string; description?: string; sortOrder?: number; isVisible?: boolean }
) {
  await requireEditor();
  const [c] = await db
    .update(industryChallenges)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(industryChallenges.id, id))
    .returning();
  revalidatePath('/admin/industries');
  revalidatePath('/industries');
  return c;
}

export async function deleteIndustryChallengeAction(id: number, industryId: number) {
  await requireEditor();
  await db.delete(industryChallenges).where(eq(industryChallenges.id, id));
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function createIndustrySolutionAction(data: {
  industryId: number;
  label: string;
  description?: string;
  sortOrder?: number;
}) {
  await requireEditor();
  const [s] = await db
    .insert(industrySolutions)
    .values({
      industryId: data.industryId,
      label: data.label,
      description: data.description || null,
      sortOrder: data.sortOrder || 0,
      isVisible: true,
    })
    .returning();
  revalidatePath(`/admin/industries/${data.industryId}`);
  revalidatePath('/industries');
  return s;
}

export async function updateIndustrySolutionAction(
  id: number,
  data: { label?: string; description?: string; sortOrder?: number; isVisible?: boolean }
) {
  await requireEditor();
  const [s] = await db
    .update(industrySolutions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(industrySolutions.id, id))
    .returning();
  revalidatePath('/admin/industries');
  revalidatePath('/industries');
  return s;
}

export async function deleteIndustrySolutionAction(id: number, industryId: number) {
  await requireEditor();
  await db.delete(industrySolutions).where(eq(industrySolutions.id, id));
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function addIndustryPracticeAreaAction(industryId: number, practiceAreaId: number) {
  await requireEditor();
  await db
    .insert(industryPracticeAreas)
    .values({ industryId, practiceAreaId, sortOrder: 0 })
    .onConflictDoNothing();
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function removeIndustryPracticeAreaAction(linkId: number, industryId: number) {
  await requireEditor();
  await db.delete(industryPracticeAreas).where(eq(industryPracticeAreas.id, linkId));
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function addIndustryExpertAction(industryId: number, teamMemberId: number) {
  await requireEditor();
  await db
    .insert(industryExperts)
    .values({ industryId, teamMemberId, sortOrder: 0 })
    .onConflictDoNothing();
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function removeIndustryExpertAction(linkId: number, industryId: number) {
  await requireEditor();
  await db.delete(industryExperts).where(eq(industryExperts.id, linkId));
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function addIndustryInsightAction(industryId: number, articleId: number) {
  await requireEditor();
  await db
    .insert(industryInsights)
    .values({ industryId, articleId, sortOrder: 0 })
    .onConflictDoNothing();
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function removeIndustryInsightAction(linkId: number, industryId: number) {
  await requireEditor();
  await db.delete(industryInsights).where(eq(industryInsights.id, linkId));
  revalidatePath(`/admin/industries/${industryId}`);
  revalidatePath('/industries');
  return { success: true };
}

export async function getIndustryPickerOptions() {
  await requireEditor();
  const [pas, tms, arts] = await Promise.all([
    db.select().from(practiceAreas).where(eq(practiceAreas.isPublished, true)).orderBy(asc(practiceAreas.name)),
    db.select().from(teamMembers).where(eq(teamMembers.isPublished, true)).orderBy(asc(teamMembers.name)),
    db.select().from(insightsArticles).where(eq(insightsArticles.isPublished, true)).orderBy(desc(insightsArticles.id)),
  ]);
  return { allPracticeAreas: pas, allTeamMembers: tms, allInsightsArticles: arts };
}

