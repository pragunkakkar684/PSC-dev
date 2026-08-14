/**
 * PSC Global CMS — Media Service
 *
 * All Cloudinary operations go through this service.
 * Components never call Cloudinary directly.
 * This is SERVER-ONLY.
 */
import 'server-only';
import { cloudinary, type CloudinaryFolder } from '@/lib/cloudinary';
import { validateMediaFile } from '@/lib/validation/media';
import { db } from '@/lib/db';
import { mediaFiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface UploadResult {
  success: true;
  cloudinaryId: string;
  url: string;
  resourceType: 'image' | 'document';
  sizeBytes: number;
  mimeType: string;
  originalName: string;
  folder: string;
}

export interface UploadError {
  success: false;
  error: string;
}

/**
 * Uploads a file buffer to Cloudinary and records it in the database.
 *
 * @param buffer    File contents as Buffer
 * @param mimeType  MIME type of the file
 * @param folder    Cloudinary folder (use CLOUDINARY_FOLDERS constants)
 * @param originalName  Original filename
 * @param uploadedBy  User ID of the uploader (for audit trail)
 */
export async function uploadMedia(
  buffer: Buffer,
  mimeType: string,
  folder: CloudinaryFolder,
  originalName: string,
  uploadedBy?: string,
): Promise<UploadResult | UploadError> {
  // 1. Validate file type and size
  const validation = validateMediaFile(mimeType, buffer.length);
  if (!validation.valid) {
    return { success: false, error: validation.error! };
  }

  // 2. Upload to Cloudinary
  try {
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: validation.resourceType === 'document' ? 'raw' : 'image',
      // Use original filename (slugified) as the public_id base
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    // 3. Record in database
    await db.insert(mediaFiles).values({
      cloudinaryId: result.public_id,
      url: result.secure_url,
      resourceType: validation.resourceType!,
      originalName,
      mimeType,
      sizeBytes: buffer.length,
      folder,
      uploadedBy: uploadedBy ?? null,
    });

    return {
      success: true,
      cloudinaryId: result.public_id,
      url: result.secure_url,
      resourceType: validation.resourceType!,
      sizeBytes: buffer.length,
      mimeType,
      originalName,
      folder,
    };
  } catch (error) {
    console.error('[MediaService] Cloudinary upload failed:', error);
    return {
      success: false,
      error: 'Upload failed. Please try again.',
    };
  }
}

/**
 * Deletes a file from Cloudinary and removes the record from the database.
 */
export async function deleteMedia(
  cloudinaryId: string,
  resourceType: 'image' | 'document' = 'image',
): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(cloudinaryId, {
      resource_type: resourceType === 'document' ? 'raw' : 'image',
    });
    await db.delete(mediaFiles).where(eq(mediaFiles.cloudinaryId, cloudinaryId));
    return { success: true };
  } catch (error) {
    console.error('[MediaService] Delete failed:', error);
    return { success: false, error: 'Delete failed. Please try again.' };
  }
}

/**
 * Retrieves all media files from the database (for media library).
 */
export async function listMedia() {
  return db.select().from(mediaFiles).orderBy(mediaFiles.uploadedAt);
}
