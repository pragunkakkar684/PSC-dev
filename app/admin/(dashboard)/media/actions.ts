'use server';

import { db } from '@/lib/db';
import { mediaFiles } from '@/lib/db/schema';
import { requireEditor } from '@/lib/auth/permissions';
import { deleteMedia } from '@/lib/services/media';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getMediaFiles(options?: {
  search?: string;
  folder?: string;
  resourceType?: string;
}) {
  await requireEditor();

  const conditions = [];

  if (options?.search) {
    conditions.push(ilike(mediaFiles.originalName, `%${options.search}%`));
  }
  if (options?.folder && options.folder !== 'all') {
    conditions.push(eq(mediaFiles.folder, options.folder));
  }
  if (options?.resourceType && options.resourceType !== 'all') {
    conditions.push(eq(mediaFiles.resourceType, options.resourceType));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(mediaFiles)
    .where(whereClause)
    .orderBy(desc(mediaFiles.uploadedAt));
}

export async function deleteMediaFileAction(id: number, cloudinaryId: string, resourceType: 'image' | 'document') {
  await requireEditor();

  const result = await deleteMedia(cloudinaryId, resourceType);

  if (!result.success) {
    throw new Error(result.error || 'Failed to delete file from Cloudinary');
  }

  revalidatePath('/admin/media');
  return { success: true };
}
