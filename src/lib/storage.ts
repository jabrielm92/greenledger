import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// S3 client (lazy-initialized so the app boots even without S3 configured)
// ---------------------------------------------------------------------------

let _s3: S3Client | null = null;

function isS3Configured(): boolean {
  return !!(
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
}

function getS3Client(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: !!process.env.S3_ENDPOINT,
    });
  }
  return _s3;
}

function getBucket(): string {
  return process.env.S3_BUCKET!;
}

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

interface StorageResult {
  filePath: string;
  url?: string;
}

/**
 * Upload a file to storage (S3 or local filesystem).
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  organizationId: string,
  contentType: string
): Promise<StorageResult> {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE_MB}MB`);
  }

  const ext = path.extname(fileName);
  const key = `org-${organizationId}/documents/${crypto.randomUUID()}${ext}`;

  if (isS3Configured()) {
    return uploadToS3(buffer, key, contentType, organizationId);
  }

  return uploadToLocal(buffer, key);
}

/**
 * Read a file from storage.
 */
export async function getFile(filePath: string): Promise<Buffer> {
  if (isS3Configured() && !filePath.startsWith("./") && !filePath.startsWith("/")) {
    return downloadFromS3(filePath);
  }

  return readFile(filePath);
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (isS3Configured() && !filePath.startsWith("./") && !filePath.startsWith("/")) {
    const command = new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: filePath,
    });
    await getS3Client().send(command);
    return;
  }

  try {
    await unlink(filePath);
  } catch {
    // Ignore if file doesn't exist
  }
}

/**
 * Check if a file exists in storage.
 */
export async function fileExists(filePath: string): Promise<boolean> {
  if (isS3Configured() && !filePath.startsWith("./") && !filePath.startsWith("/")) {
    try {
      const command = new HeadObjectCommand({
        Bucket: getBucket(),
        Key: filePath,
      });
      await getS3Client().send(command);
      return true;
    } catch (error: unknown) {
      const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a presigned download URL (expires in 1 hour). S3 only.
 */
export async function getDownloadUrl(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: s3Key,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
}

/**
 * Delete all files for an organization (GDPR compliance).
 */
export async function deleteOrganizationFiles(organizationId: string): Promise<void> {
  if (!isS3Configured()) return;

  const prefix = `org-${organizationId}/`;
  const client = getS3Client();
  const bucket = getBucket();

  let continuationToken: string | undefined;

  do {
    const list = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    if (list.Contents && list.Contents.length > 0) {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: list.Contents.map((obj) => ({ Key: obj.Key })),
          },
        })
      );
    }

    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (continuationToken);
}

/**
 * Test S3 connection (health check).
 */
export async function testConnection(): Promise<boolean> {
  if (!isS3Configured()) return false;

  try {
    const command = new HeadObjectCommand({
      Bucket: getBucket(),
      Key: "health-check-test",
    });
    await getS3Client().send(command);
    return true;
  } catch (error: unknown) {
    const err = error as { $metadata?: { httpStatusCode?: number } };
    if (err.$metadata?.httpStatusCode === 404) {
      return true; // Bucket is accessible, object just doesn't exist
    }
    console.error("S3 connection test failed:", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// S3 Implementation
// ---------------------------------------------------------------------------

async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
  organizationId: string
): Promise<StorageResult> {
  const upload = new Upload({
    client: getS3Client(),
    params: {
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        "organization-id": organizationId,
        "uploaded-at": new Date().toISOString(),
      },
    },
  });

  await upload.done();
  return { filePath: key };
}

async function downloadFromS3(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });

  const response = await getS3Client().send(command);

  if (!response.Body) {
    throw new Error("File not found in storage");
  }

  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

// ---------------------------------------------------------------------------
// Local Implementation (development / fallback)
// ---------------------------------------------------------------------------

async function uploadToLocal(buffer: Buffer, key: string): Promise<StorageResult> {
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadDir, key);
  const dir = path.dirname(filePath);

  try {
    await mkdir(dir, { recursive: true });
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EACCES") throw new Error(`Upload directory permission denied: ${dir}`);
    throw err;
  }

  try {
    await writeFile(filePath, buffer);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOSPC") throw new Error("Disk full: cannot save uploaded file");
    if (code === "EACCES") throw new Error(`Write permission denied: ${filePath}`);
    throw err;
  }

  return { filePath };
}
