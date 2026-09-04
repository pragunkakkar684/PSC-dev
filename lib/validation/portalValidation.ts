import { z } from 'zod';

export const createClientSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateClientSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const createEngagementSchema = z.object({
  clientId: z.number({ message: 'Client selection is required' }),
  title: z.string().min(2, 'Engagement title is required'),
  serviceCategory: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ON_HOLD']).default('ACTIVE'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createTaskSchema = z.object({
  clientId: z.number(),
  engagementId: z.number().optional().nullable(),
  name: z.string().min(2, 'Task name is required'),
  dueDate: z.string().optional(),
  status: z.enum(['UPCOMING', 'DUE SOON', 'COMPLETED', 'OVERDUE']).default('UPCOMING'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});

export const createComplianceItemSchema = z.object({
  clientId: z.number(),
  engagementId: z.number().optional().nullable(),
  requirement: z.string().min(2, 'Requirement description is required'),
  dueDate: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'OVERDUE']).default('PENDING'),
  notes: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  clientId: z.number(),
  engagementId: z.number().optional().nullable(),
  invoiceNumber: z.string().min(2, 'Invoice number is required'),
  amount: z.string().min(1, 'Amount is required'),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['UNPAID', 'PAID', 'OVERDUE']).default('UNPAID'),
  pdfUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const recordPaymentSchema = z.object({
  clientId: z.number(),
  invoiceId: z.number().optional().nullable(),
  paymentRef: z.string().min(2, 'Payment reference is required'),
  amount: z.string().min(1, 'Amount is required'),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().default('BANK_TRANSFER'),
  status: z.enum(['COMPLETED', 'PROCESSING', 'FAILED']).default('COMPLETED'),
});

export const createDocumentSchema = z.object({
  clientId: z.number(),
  engagementId: z.number().optional().nullable(),
  title: z.string().min(2, 'Document title is required'),
  fileUrl: z.string().url('Valid file URL is required'),
  fileType: z.string().optional(),
  fileSize: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['APPROVED', 'PENDING_REVIEW', 'REJECTED']).default('APPROVED'),
});

export const createReportSchema = z.object({
  clientId: z.number(),
  engagementId: z.number().optional().nullable(),
  title: z.string().min(2, 'Report title is required'),
  period: z.string().optional(),
  publicationDate: z.string().optional(),
  fileUrl: z.string().optional(),
  summary: z.string().optional(),
});

export const createMeetingSchema = z.object({
  title: z.string().min(2, 'Meeting topic is required'),
  requestedDate: z.string().min(1, 'Requested date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  notes: z.string().optional(),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(2, 'Subject is required'),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  message: z.string().min(5, 'Description / message is required'),
});

export const ticketReplySchema = z.object({
  ticketId: z.number(),
  message: z.string().min(2, 'Message is required'),
});
