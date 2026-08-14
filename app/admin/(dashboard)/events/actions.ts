'use server';

import { db } from '@/lib/db';
import { events, eventAgendaItems, eventSpeakers, teamMembers } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { eventSchema, slugify } from '@/lib/validation/cms';
import { eq, and, ilike, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getEvents(options?: {
  search?: string;
  eventType?: string;
  status?: string;
  featuredOnly?: boolean;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(events.title, `%${options.search}%`));
  }
  if (options?.eventType && options.eventType !== 'all') {
    conditions.push(eq(events.eventType, options.eventType as any));
  }
  if (options?.status && options.status !== 'all') {
    conditions.push(eq(events.status, options.status as any));
  }
  if (options?.featuredOnly) {
    conditions.push(eq(events.isFeatured, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(events)
    .where(whereClause)
    .orderBy(desc(events.date), desc(events.createdAt));
}

export async function getEventById(id: number) {
  await requireEditor();

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (!event) return null;

  const agenda = await db
    .select()
    .from(eventAgendaItems)
    .where(eq(eventAgendaItems.eventId, id))
    .orderBy(asc(eventAgendaItems.sortOrder));

  const rawSpeakers = await db
    .select({
      id: eventSpeakers.id,
      eventId: eventSpeakers.eventId,
      teamMemberId: eventSpeakers.teamMemberId,
      externalSpeakerName: eventSpeakers.externalSpeakerName,
      externalSpeakerRole: eventSpeakers.externalSpeakerRole,
      externalSpeakerImageUrl: eventSpeakers.externalSpeakerImageUrl,
      sortOrder: eventSpeakers.sortOrder,
      teamMemberName: teamMembers.name,
      teamMemberRole: teamMembers.roleTitle,
      teamMemberImage: teamMembers.imageUrl,
    })
    .from(eventSpeakers)
    .leftJoin(teamMembers, eq(eventSpeakers.teamMemberId, teamMembers.id))
    .where(eq(eventSpeakers.eventId, id))
    .orderBy(asc(eventSpeakers.sortOrder));

  return { ...event, agenda, speakers: rawSpeakers };
}

export async function createEventAction(data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.title);

  const parsed = eventSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [created] = await db
    .insert(events)
    .values({
      ...parsed,
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath('/admin/events');
  return created;
}

export async function updateEventAction(id: number, data: any) {
  await requireEditor();

  const autoSlug = data.slug ? slugify(data.slug) : slugify(data.title);

  const parsed = eventSchema.parse({
    ...data,
    slug: autoSlug,
  });

  const [updated] = await db
    .update(events)
    .set({
      ...parsed,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))
    .returning();

  revalidatePath('/admin/events');
  revalidatePath(`/admin/events/${id}`);
  return updated;
}

export async function deleteEventAction(id: number) {
  await requireEditor();

  await db.delete(events).where(eq(events.id, id));
  revalidatePath('/admin/events');
  return { success: true };
}

export async function toggleEventPublishAction(id: number, isPublished: boolean) {
  await requireEditor();

  await db
    .update(events)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(events.id, id));

  revalidatePath('/admin/events');
  return { success: true };
}

export async function toggleEventFeaturedAction(id: number, isFeatured: boolean) {
  await requireEditor();

  await db
    .update(events)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(events.id, id));

  revalidatePath('/admin/events');
  return { success: true };
}

export async function saveEventAgendaAction(
  eventId: number,
  items: Array<{ timeLabel?: string; title: string; description?: string; isCurrent?: boolean; sortOrder?: number }>
) {
  await requireEditor();

  await db.delete(eventAgendaItems).where(eq(eventAgendaItems.eventId, eventId));

  if (items.length > 0) {
    const valuesToInsert = items.map((item, idx) => ({
      eventId,
      timeLabel: item.timeLabel || '',
      title: item.title,
      description: item.description || '',
      isCurrent: item.isCurrent ?? false,
      sortOrder: item.sortOrder ?? idx,
    }));
    await db.insert(eventAgendaItems).values(valuesToInsert);
  }

  revalidatePath(`/admin/events/${eventId}`);
  return { success: true };
}

export async function saveEventSpeakersAction(
  eventId: number,
  speakers: Array<{
    teamMemberId?: number | null;
    externalSpeakerName?: string | null;
    externalSpeakerRole?: string | null;
    externalSpeakerImageUrl?: string | null;
    sortOrder?: number;
  }>
) {
  await requireEditor();

  await db.delete(eventSpeakers).where(eq(eventSpeakers.eventId, eventId));

  if (speakers.length > 0) {
    const valuesToInsert = speakers.map((s, idx) => ({
      eventId,
      teamMemberId: s.teamMemberId || null,
      externalSpeakerName: s.externalSpeakerName || null,
      externalSpeakerRole: s.externalSpeakerRole || null,
      externalSpeakerImageUrl: s.externalSpeakerImageUrl || null,
      sortOrder: s.sortOrder ?? idx,
    }));
    await db.insert(eventSpeakers).values(valuesToInsert);
  }

  revalidatePath(`/admin/events/${eventId}`);
  return { success: true };
}
