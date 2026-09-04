'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import {
  portalMeetings,
  portalSupportTickets,
  portalTicketReplies,
  portalDocuments,
  portalTasks,
} from '@/lib/db/schema';
import { requirePortalClient } from '@/lib/auth/portalAuth';
import {
  createMeetingSchema,
  createSupportTicketSchema,
  ticketReplySchema,
  createDocumentSchema,
} from '@/lib/validation/portalValidation';
import { eq, and } from 'drizzle-orm';

export async function clientBookMeetingAction(formData: FormData): Promise<void> {
  const clientCtx = await requirePortalClient();
  if (!clientCtx.clientId) return;

  const rawData = {
    title: formData.get('title') as string,
    requestedDate: formData.get('requestedDate') as string,
    timeSlot: formData.get('timeSlot') as string,
    notes: (formData.get('notes') as string) || undefined,
  };

  const parsed = createMeetingSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalMeetings).values({
    clientId: clientCtx.clientId,
    title: parsed.data.title,
    requestedDate: parsed.data.requestedDate,
    timeSlot: parsed.data.timeSlot,
    notes: parsed.data.notes,
    status: 'REQUESTED',
  });

  revalidatePath('/client-portal/meeting');
  revalidatePath('/client-portal');
}

export async function clientRaiseSupportTicketAction(formData: FormData): Promise<void> {
  const clientCtx = await requirePortalClient();
  if (!clientCtx.clientId) return;

  const rawData = {
    subject: formData.get('subject') as string,
    category: (formData.get('category') as string) || 'General Inquiry',
    priority: (formData.get('priority') as any) || 'MEDIUM',
    message: formData.get('message') as string,
  };

  const parsed = createSupportTicketSchema.safeParse(rawData);
  if (!parsed.success) return;

  const ticketNumber = `TICK-${Date.now().toString().slice(-6)}`;

  const [ticket] = await db
    .insert(portalSupportTickets)
    .values({
      ticketNumber,
      clientId: clientCtx.clientId,
      subject: parsed.data.subject,
      category: parsed.data.category,
      priority: parsed.data.priority,
      status: 'OPEN',
    })
    .returning();

  await db.insert(portalTicketReplies).values({
    ticketId: ticket.id,
    senderId: clientCtx.userId,
    senderType: 'CLIENT',
    message: parsed.data.message,
  });

  revalidatePath('/client-portal/support');
  revalidatePath('/client-portal');
}

export async function clientReplySupportTicketAction(formData: FormData): Promise<void> {
  const clientCtx = await requirePortalClient();
  if (!clientCtx.clientId) return;

  const rawData = {
    ticketId: Number(formData.get('ticketId')),
    message: formData.get('message') as string,
  };

  const parsed = ticketReplySchema.safeParse(rawData);
  if (!parsed.success) return;

  // Strict ownership check (IDOR prevention)
  const [ticket] = await db
    .select()
    .from(portalSupportTickets)
    .where(
      and(
        eq(portalSupportTickets.id, parsed.data.ticketId),
        eq(portalSupportTickets.clientId, clientCtx.clientId)
      )
    )
    .limit(1);

  if (!ticket) return;

  await db.insert(portalTicketReplies).values({
    ticketId: ticket.id,
    senderId: clientCtx.userId,
    senderType: 'CLIENT',
    message: parsed.data.message,
  });

  await db
    .update(portalSupportTickets)
    .set({ status: 'OPEN', updatedAt: new Date() })
    .where(eq(portalSupportTickets.id, ticket.id));

  revalidatePath('/client-portal/support');
}

export async function clientUploadDocumentAction(formData: FormData): Promise<void> {
  const clientCtx = await requirePortalClient();
  if (!clientCtx.clientId) return;

  const rawData = {
    clientId: clientCtx.clientId,
    engagementId: formData.get('engagementId') ? Number(formData.get('engagementId')) : null,
    title: formData.get('title') as string,
    fileUrl: formData.get('fileUrl') as string,
    fileType: (formData.get('fileType') as string) || 'pdf',
    fileSize: (formData.get('fileSize') as string) || undefined,
    category: (formData.get('category') as string) || 'Client Upload',
    status: 'PENDING_REVIEW' as const,
  };

  const parsed = createDocumentSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalDocuments).values({
    ...parsed.data,
    uploadedBy: clientCtx.userId,
  });

  revalidatePath('/client-portal/documents');
  revalidatePath('/client-portal');
}

export async function clientToggleTaskStatusAction(taskId: number, newStatus: 'COMPLETED' | 'UPCOMING'): Promise<void> {
  const clientCtx = await requirePortalClient();
  if (!clientCtx.clientId) return;

  // Strict ownership check (IDOR prevention)
  const [task] = await db
    .select()
    .from(portalTasks)
    .where(and(eq(portalTasks.id, taskId), eq(portalTasks.clientId, clientCtx.clientId)))
    .limit(1);

  if (!task) return;

  await db
    .update(portalTasks)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(portalTasks.id, taskId));

  revalidatePath('/client-portal/tasks');
  revalidatePath('/client-portal');
}
