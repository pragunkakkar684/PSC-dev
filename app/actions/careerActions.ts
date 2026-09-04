'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { careersPositions, portalJobApplications } from '@/lib/db/schema';
import { requirePortalAdmin } from '@/lib/auth/portalAuth';
import { eq, desc } from 'drizzle-orm';

export interface QuestionConfig {
  id: string;
  text: string;
  type: 'YES_NO' | 'TEXT';
  required?: boolean;
}

export interface ApplicationAnswer {
  questionId: string;
  questionText: string;
  answer: string;
}

// ─── ADMIN: CREATE JOB OPENING ────────────────────────────────────────────────
export async function createJobOpeningAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requirePortalAdmin();

  const title = formData.get('title') as string;
  const department = (formData.get('department') as string) || 'Tax Advisory';
  const location = (formData.get('location') as string) || 'London, UK';
  const type = (formData.get('type') as string) || 'Full-time';
  const description = (formData.get('description') as string) || '';
  const requirements = (formData.get('requirements') as string) || '';
  const questionsJson = (formData.get('questions') as string) || '[]';

  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Job title is required' };
  }

  let questions: QuestionConfig[] = [];
  try {
    questions = JSON.parse(questionsJson);
  } catch (err) {
    questions = [];
  }

  try {
    const [newJob] = await db.insert(careersPositions).values({
      title: title.trim(),
      department,
      location,
      type,
      description,
      requirements,
      questions,
      isPublished: true,
    }).returning();

    revalidatePath('/client-portal/admin/careers');
    revalidatePath('/career');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create job opening' };
  }
}

// ─── ADMIN: UPDATE JOB OPENING ────────────────────────────────────────────────
export async function updateJobOpeningAction(jobId: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requirePortalAdmin();

  const title = formData.get('title') as string;
  const department = formData.get('department') as string;
  const location = formData.get('location') as string;
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const requirements = formData.get('requirements') as string;
  const questionsJson = formData.get('questions') as string;
  const isPublished = formData.get('isPublished') === 'true';

  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Job title is required' };
  }

  let questions: QuestionConfig[] = [];
  if (questionsJson) {
    try {
      questions = JSON.parse(questionsJson);
    } catch (err) {
      questions = [];
    }
  }

  try {
    await db.update(careersPositions)
      .set({
        title: title.trim(),
        department,
        location,
        type,
        description,
        requirements,
        questions,
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(careersPositions.id, jobId));

    revalidatePath('/client-portal/admin/careers');
    revalidatePath(`/client-portal/admin/careers/${jobId}`);
    revalidatePath('/career');
    revalidatePath(`/career/${jobId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update job opening' };
  }
}

// ─── ADMIN: DELETE JOB OPENING ────────────────────────────────────────────────
export async function deleteJobOpeningAction(jobId: number): Promise<{ success: boolean; error?: string }> {
  await requirePortalAdmin();

  try {
    await db.delete(careersPositions).where(eq(careersPositions.id, jobId));

    revalidatePath('/client-portal/admin/careers');
    revalidatePath('/career');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete job opening' };
  }
}

// ─── ADMIN: UPDATE APPLICATION STATUS ─────────────────────────────────────────
export async function updateApplicationStatusAction(applicationId: number, status: string): Promise<{ success: boolean; error?: string }> {
  await requirePortalAdmin();

  try {
    await db.update(portalJobApplications)
      .set({ status })
      .where(eq(portalJobApplications.id, applicationId));

    revalidatePath('/client-portal/admin/careers');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update status' };
  }
}

// ─── PUBLIC VISITOR: SUBMIT JOB APPLICATION ──────────────────────────────────
export async function submitJobApplicationAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const jobIdStr = formData.get('jobId') as string;
  const applicantName = formData.get('applicantName') as string;
  const applicantEmail = formData.get('applicantEmail') as string;
  const applicantPhone = formData.get('applicantPhone') as string;
  const resumeUrl = (formData.get('resumeUrl') as string) || '';
  const coverLetter = (formData.get('coverLetter') as string) || '';
  const answersJson = (formData.get('answers') as string) || '[]';

  if (!jobIdStr || !applicantName || !applicantEmail || !applicantPhone) {
    return { success: false, error: 'Please fill in all required fields (Name, Email, Phone).' };
  }

  const jobId = parseInt(jobIdStr, 10);
  if (isNaN(jobId)) {
    return { success: false, error: 'Invalid Job ID' };
  }

  let answers: ApplicationAnswer[] = [];
  try {
    answers = JSON.parse(answersJson);
  } catch (e) {
    answers = [];
  }

  try {
    await db.insert(portalJobApplications).values({
      jobId,
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim(),
      resumeUrl: resumeUrl.trim() || undefined,
      coverLetter: coverLetter.trim() || undefined,
      answers,
      status: 'NEW',
    });

    revalidatePath('/client-portal/admin/careers');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit application' };
  }
}
