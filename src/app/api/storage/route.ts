import { NextRequest, NextResponse } from 'next/server';
import {
  uploadToR2,
  getPresignedUploadUrl,
  generateMediaKey,
} from '@/lib/r2-storage';

/**
 * POST /api/storage
 * Upload a file to Cloudflare R2 storage.
 *
 * Body (multipart/form-data):
 *   - file: File (the file to upload)
 *   - userId: string (owner user ID)
 *   - type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker'
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;
    const type = (formData.get('type') as string) || 'document';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'No userId provided' },
        { status: 400 }
      );
    }

    const key = generateMediaKey(userId, type as any, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToR2(key, buffer, file.type);

    return NextResponse.json({
      url: result.url,
      key: result.key,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('[Storage API] Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/storage?key=...&action=presign
 * Get a presigned upload URL for client-side direct upload.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const key = searchParams.get('key');
    const contentType = searchParams.get('contentType') || 'application/octet-stream';

    if (action === 'presign' && key) {
      const presignedUrl = await getPresignedUploadUrl(key, contentType);
      return NextResponse.json({ presignedUrl, key });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing key' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Storage API] Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
