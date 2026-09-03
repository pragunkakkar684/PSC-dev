'use server';

import { db } from '@/lib/db';
import { contactSubmissions, newsletterSubscribers } from '@/lib/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const publicContactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(200),
  company: z.string().max(200).optional().nullable(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(100).optional().nullable(),
  practiceArea: z.string().max(100).optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters long'),
});

const publicNewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function submitContactFormAction(formData: any) {
  const parsed = publicContactSchema.parse(formData);

  const [created] = await db
    .insert(contactSubmissions)
    .values({
      name: parsed.fullName,
      company: parsed.company || null,
      email: parsed.email.toLowerCase().trim(),
      phone: parsed.phone || null,
      serviceInterest: parsed.practiceArea || 'General Inquiry',
      message: parsed.message,
      status: 'new',
    })
    .returning();

  return { success: true, id: created.id };
}

export async function submitNewsletterAction(email: string) {
  const parsed = publicNewsletterSchema.parse({ email });
  const normalizedEmail = parsed.email.toLowerCase().trim();

  // Check if already subscribed
  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return { success: true, message: 'You are subscribed to our newsletter updates.' };
  }

  await db.insert(newsletterSubscribers).values({
    email: normalizedEmail,
  });

  return { success: true, message: 'Successfully subscribed to PSC Global Insights!' };
}
