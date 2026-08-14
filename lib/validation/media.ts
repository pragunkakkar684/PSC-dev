/**
 * PSC Global CMS — Media Validation
 *
 * Validates MIME type and file size before upload.
 * Used by the media service and upload API route.
 */

/** Maximum file sizes */
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,   // 10 MB
  document: 50 * 1024 * 1024, // 50 MB
} as const;

/** Allowed MIME types */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
] as const;

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export type AllowedDocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  resourceType?: 'image' | 'document';
}

/**
 * Validates a file's MIME type and size.
 * Returns the Cloudinary resource type on success.
 */
export function validateMediaFile(
  mimeType: string,
  sizeBytes: number,
): MediaValidationResult {
  const isImage = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType);
  const isDocument = (ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(mimeType);

  if (!isImage && !isDocument) {
    return {
      valid: false,
      error: `File type "${mimeType}" is not allowed. Allowed types: JPEG, PNG, WEBP, PDF.`,
    };
  }

  const maxSize = isImage ? MAX_FILE_SIZES.image : MAX_FILE_SIZES.document;
  if (sizeBytes > maxSize) {
    const maxMb = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxMb} MB for ${isImage ? 'images' : 'documents'}.`,
    };
  }

  return {
    valid: true,
    resourceType: isImage ? 'image' : 'document',
  };
}
