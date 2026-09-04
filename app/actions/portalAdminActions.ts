'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import {
  users,
  portalClients,
  portalUsers,
  portalEngagements,
  portalTasks,
  portalComplianceItems,
  portalInvoices,
  portalPayments,
  portalDocuments,
  portalReports,
  portalMeetings,
  portalSupportTickets,
  portalTicketReplies,
} from '@/lib/db/schema';
import { requirePortalAdmin } from '@/lib/auth/portalAuth';
import {
  createClientSchema,
  createEngagementSchema,
  createTaskSchema,
  createComplianceItemSchema,
  createInvoiceSchema,
  recordPaymentSchema,
  createDocumentSchema,
  createReportSchema,
  ticketReplySchema,
} from '@/lib/validation/portalValidation';
import { eq } from 'drizzle-orm';

// ─── CLIENT ACCOUNT MANAGEMENT ──────────────────────────────────────────────

export async function createClientAccountAction(prevState: any, formData: FormData) {
  const adminCtx = await requirePortalAdmin();

  const rawData = {
    companyName: formData.get('companyName') as string,
    contactName: formData.get('contactName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    phone: (formData.get('phone') as string) || undefined,
    address: (formData.get('address') as string) || undefined,
  };

  const parsed = createClientSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Validation error' };
  }

  const { companyName, contactName, email, password, phone, address } = parsed.data;

  // Check existing user or client
  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser) {
    return { error: 'A user with this email address already exists.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create User
  const [newUser] = await db
    .insert(users)
    .values({
      name: `${contactName} (${companyName})`,
      email,
      password: hashedPassword,
      role: 'client',
    })
    .returning();

  // 2. Create Client Record
  const [newClient] = await db
    .insert(portalClients)
    .values({
      companyName,
      contactName,
      email,
      phone,
      address,
      status: 'ACTIVE',
      createdBy: adminCtx.userId,
    })
    .returning();

  // 3. Link User & Client in portalUsers
  await db.insert(portalUsers).values({
    userId: newUser.id,
    clientId: newClient.id,
    portalRole: 'CLIENT',
  });

  revalidatePath('/client-portal/admin');
  revalidatePath('/client-portal/admin/clients');
  return { success: true, clientId: newClient.id };
}

export async function updateClientStatusAction(clientId: number, status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
  await requirePortalAdmin();

  await db
    .update(portalClients)
    .set({ status, updatedAt: new Date() })
    .where(eq(portalClients.id, clientId));

  revalidatePath(`/client-portal/admin/clients/${clientId}`);
  revalidatePath('/client-portal/admin/clients');
}

// ─── ENGAGEMENTS ─────────────────────────────────────────────────────────────

export async function createEngagementAction(formData: FormData): Promise<void> {
  await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    title: formData.get('title') as string,
    serviceCategory: (formData.get('serviceCategory') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    status: (formData.get('status') as any) || 'ACTIVE',
    startDate: (formData.get('startDate') as string) || undefined,
    endDate: (formData.get('endDate') as string) || undefined,
  };

  const parsed = createEngagementSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalEngagements).values(parsed.data);

  revalidatePath('/client-portal/admin/engagements');
  revalidatePath(`/client-portal/admin/clients/${parsed.data.clientId}`);
}

// ─── TASKS ───────────────────────────────────────────────────────────────────

export async function createTaskAction(formData: FormData): Promise<void> {
  await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    engagementId: formData.get('engagementId') ? Number(formData.get('engagementId')) : null,
    name: formData.get('name') as string,
    dueDate: (formData.get('dueDate') as string) || undefined,
    status: (formData.get('status') as any) || 'UPCOMING',
    priority: (formData.get('priority') as any) || 'NORMAL',
  };

  const parsed = createTaskSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalTasks).values(parsed.data);

  revalidatePath('/client-portal/admin/tasks');
  revalidatePath(`/client-portal/admin/clients/${parsed.data.clientId}`);
}

// ─── COMPLIANCE ITEMS ────────────────────────────────────────────────────────

export async function createComplianceItemAction(formData: FormData): Promise<void> {
  await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    engagementId: formData.get('engagementId') ? Number(formData.get('engagementId')) : null,
    requirement: formData.get('requirement') as string,
    dueDate: (formData.get('dueDate') as string) || undefined,
    status: (formData.get('status') as any) || 'PENDING',
    notes: (formData.get('notes') as string) || undefined,
  };

  const parsed = createComplianceItemSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalComplianceItems).values(parsed.data);

  revalidatePath('/client-portal/admin/compliance');
  revalidatePath(`/client-portal/admin/clients/${parsed.data.clientId}`);
}

// ─── INVOICES & PAYMENTS ────────────────────────────────────────────────────

export async function createInvoiceAction(formData: FormData): Promise<void> {
  await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    engagementId: formData.get('engagementId') ? Number(formData.get('engagementId')) : null,
    invoiceNumber: formData.get('invoiceNumber') as string,
    amount: formData.get('amount') as string,
    issueDate: (formData.get('issueDate') as string) || undefined,
    dueDate: (formData.get('dueDate') as string) || undefined,
    status: (formData.get('status') as any) || 'UNPAID',
    pdfUrl: (formData.get('pdfUrl') as string) || undefined,
    notes: (formData.get('notes') as string) || undefined,
  };

  const parsed = createInvoiceSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalInvoices).values(parsed.data);

  revalidatePath('/client-portal/admin/invoices');
  revalidatePath(`/client-portal/admin/clients/${parsed.data.clientId}`);
}

export async function recordPaymentAction(formData: FormData): Promise<void> {
  await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    invoiceId: formData.get('invoiceId') ? Number(formData.get('invoiceId')) : null,
    paymentRef: formData.get('paymentRef') as string,
    amount: formData.get('amount') as string,
    paymentDate: (formData.get('paymentDate') as string) || undefined,
    paymentMethod: (formData.get('paymentMethod') as string) || 'BANK_TRANSFER',
    status: (formData.get('status') as any) || 'COMPLETED',
  };

  const parsed = recordPaymentSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalPayments).values(parsed.data);

  if (parsed.data.invoiceId) {
    await db
      .update(portalInvoices)
      .set({ status: 'PAID', updatedAt: new Date() })
      .where(eq(portalInvoices.id, parsed.data.invoiceId));
  }

  revalidatePath('/client-portal/admin/payments');
  revalidatePath('/client-portal/admin/invoices');
}

// ─── DOCUMENTS & REPORTS ─────────────────────────────────────────────────────

export async function uploadDocumentAdminAction(formData: FormData): Promise<void> {
  const adminCtx = await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    engagementId: formData.get('engagementId') ? Number(formData.get('engagementId')) : null,
    title: formData.get('title') as string,
    fileUrl: formData.get('fileUrl') as string,
    fileType: (formData.get('fileType') as string) || 'pdf',
    fileSize: (formData.get('fileSize') as string) || undefined,
    category: (formData.get('category') as string) || 'General',
    status: (formData.get('status') as any) || 'APPROVED',
  };

  const parsed = createDocumentSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalDocuments).values({
    ...parsed.data,
    uploadedBy: adminCtx.userId,
  });

  revalidatePath('/client-portal/admin/documents');
}

export async function createReportAction(formData: FormData): Promise<void> {
  await requirePortalAdmin();

  const rawData = {
    clientId: Number(formData.get('clientId')),
    engagementId: formData.get('engagementId') ? Number(formData.get('engagementId')) : null,
    title: formData.get('title') as string,
    period: (formData.get('period') as string) || undefined,
    publicationDate: (formData.get('publicationDate') as string) || undefined,
    fileUrl: (formData.get('fileUrl') as string) || undefined,
    summary: (formData.get('summary') as string) || undefined,
  };

  const parsed = createReportSchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalReports).values(parsed.data);

  revalidatePath('/client-portal/admin/reports');
}

// ─── MEETINGS & SUPPORT ──────────────────────────────────────────────────────

export async function updateMeetingStatusAction(meetingId: number, status: string, meetingUrl?: string): Promise<void> {
  await requirePortalAdmin();

  await db
    .update(portalMeetings)
    .set({
      status,
      meetingUrl: meetingUrl || undefined,
      updatedAt: new Date(),
    })
    .where(eq(portalMeetings.id, meetingId));

  revalidatePath('/client-portal/admin/meetings');
}

export async function adminReplyTicketAction(formData: FormData): Promise<void> {
  const adminCtx = await requirePortalAdmin();

  const rawData = {
    ticketId: Number(formData.get('ticketId')),
    message: formData.get('message') as string,
  };

  const parsed = ticketReplySchema.safeParse(rawData);
  if (!parsed.success) return;

  await db.insert(portalTicketReplies).values({
    ticketId: parsed.data.ticketId,
    senderId: adminCtx.userId,
    senderType: 'PORTAL_ADMIN',
    message: parsed.data.message,
  });

  await db
    .update(portalSupportTickets)
    .set({ status: 'IN_PROGRESS', updatedAt: new Date() })
    .where(eq(portalSupportTickets.id, parsed.data.ticketId));

  revalidatePath('/client-portal/admin/support');
}
