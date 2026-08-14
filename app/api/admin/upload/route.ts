/**
 * Admin Media Upload API Route
 * POST /api/admin/upload
 *
 * Security:
 * - Requires authentication (admin or editor)
 * - File type and size validated before upload
 * - Cloudinary API secret stays server-side
 * - Never returns the API secret to the client
 */
import { type NextRequest, NextResponse } from 'next/server';
import { requireEditor } from '@/lib/auth/permissions';
import { uploadMedia } from '@/lib/services/media';
import { CLOUDINARY_FOLDERS } from '@/lib/cloudinary';
import type { CloudinaryFolder } from '@/lib/cloudinary';

const VALID_FOLDERS = Object.values(CLOUDINARY_FOLDERS) as string[];

export async function POST(request: NextRequest) {
  // 1. Require authentication
  let user;
  try {
    user = await requireEditor();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const folder = formData.get('folder') as string | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // 3. Validate folder
  const uploadFolder: CloudinaryFolder = VALID_FOLDERS.includes(folder ?? '')
    ? (folder as CloudinaryFolder)
    : CLOUDINARY_FOLDERS.pages;

  // 4. Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 5. Upload via media service (handles validation + Cloudinary + DB)
  const result = await uploadMedia(
    buffer,
    file.type,
    uploadFolder,
    file.name,
    user.id,
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({
    cloudinaryId: result.cloudinaryId,
    url: result.url,
    resourceType: result.resourceType,
    originalName: result.originalName,
  });
}
