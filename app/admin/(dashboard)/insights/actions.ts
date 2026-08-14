'use server';

import { db } from '@/lib/db';
import { insightsArticles, teamMembers } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { insightArticleSchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getInsights(options?: {
  search?: string;
  contentType?: string;
  publishedOnly?: boolean;
  featuredOnly?: boolean;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(insightsArticles.title, `%${options.search}%`));
  }
  if (options?.contentType && options.contentType !== 'all') {
    conditions.push(eq(insightsArticles.contentType, options.contentType as any));
  }
  if (options?.publishedOnly) {
    conditions.push(eq(insightsArticles.isPublished, true));
  }
  if (options?.featuredOnly) {
    conditions.push(eq(insightsArticles.isFeatured, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select({
      id: insightsArticles.id,
      slug: insightsArticles.slug,
      contentType: insightsArticles.contentType,
      tag: insightsArticles.tag,
      title: insightsArticles.title,
      summary: insightsArticles.summary,
      imageUrl: insightsArticles.imageUrl,
      fileUrl: insightsArticles.fileUrl,
      readTimeMins: insightsArticles.readTimeMins,
      authorityTag: insightsArticles.authorityTag,
      courtName: insightsArticles.courtName,
      publishedAt: insightsArticles.publishedAt,
      isFeatured: insightsArticles.isFeatured,
      isPublished: insightsArticles.isPublished,
      authorId: insightsArticles.authorId,
      createdAt: insightsArticles.createdAt,
      authorName: teamMembers.name,
    })
    .from(insightsArticles)
    .leftJoin(teamMembers, eq(insightsArticles.authorId, teamMembers.id))
    .where(whereClause)
    .orderBy(desc(insightsArticles.publishedAt), desc(insightsArticles.createdAt));
}

export async function getInsightById(id: number) {
  await requireEditor();

  const [insight] = await db
    .select()
    .from(insightsArticles)
    .where(eq(insightsArticles.id, id))
    .limit(1);

  return insight || null;
}

export async function createInsightAction(data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.title);

  const parsed = insightArticleSchema.parse({
    ...data,
    slug: autoSlug,
    publishedAt: data.publishedAt || new Date().toISOString(),
  });

  const [created] = await db
    .insert(insightsArticles)
    .values({
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath('/admin/insights');
  return created;
}

export async function updateInsightAction(id: number, data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.title);

  const parsed = insightArticleSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [updated] = await db
    .update(insightsArticles)
    .set({
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(insightsArticles.id, id))
    .returning();

  revalidatePath('/admin/insights');
  revalidatePath(`/admin/insights/${id}`);
  return updated;
}

export async function deleteInsightAction(id: number) {
  await requireEditor();

  await db.delete(insightsArticles).where(eq(insightsArticles.id, id));
  revalidatePath('/admin/insights');
  return { success: true };
}

export async function toggleInsightPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(insightsArticles)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(insightsArticles.id, id));

  revalidatePath('/admin/insights');
  return { success: true };
}

export async function toggleInsightFeaturedAction(id: number, isFeatured: boolean) {
  await requireEditor();

  await db
    .update(insightsArticles)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(insightsArticles.id, id));

  revalidatePath('/admin/insights');
  return { success: true };
}
