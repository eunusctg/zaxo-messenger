import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'zaxo';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

/**
 * Create an S3 client configured for Cloudflare R2.
 * R2 is S3-compatible, so we use the AWS S3 SDK.
 */
function createR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    // Required for R2
    forcePathStyle: false,
  });
}

/**
 * Upload a file to Cloudflare R2 storage
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string = 'application/octet-stream'
): Promise<{ url: string; key: string }> {
  const client = createR2Client();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await client.send(command);

  const url = `${R2_PUBLIC_URL}/${key}`;
  return { url, key };
}

/**
 * Get a signed URL for uploading a file directly from the client
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string = 'application/octet-stream',
  expiresIn: number = 3600
): Promise<string> {
  const client = createR2Client();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Get a signed URL for downloading a private file
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const client = createR2Client();

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Delete a file from R2 storage
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = createR2Client();

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await client.send(command);
}

/**
 * List files in an R2 bucket with a given prefix
 */
export async function listR2Files(
  prefix: string,
  maxKeys: number = 100
): Promise<{ key: string; size: number; lastModified: Date }[]> {
  const client = createR2Client();

  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await client.send(command);

  return (response.Contents || []).map((obj) => ({
    key: obj.Key || '',
    size: obj.Size || 0,
    lastModified: obj.LastModified || new Date(),
  }));
}

/**
 * Generate a unique key for a media file upload
 */
export function generateMediaKey(
  userId: string,
  type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker',
  filename: string
): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `media/${userId}/${type}/${timestamp}-${randomStr}-${sanitizedFilename}`;
}

/**
 * Get the public URL for a file in R2
 */
export function getR2PublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}
