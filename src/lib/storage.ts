import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

interface StorageResult {
  filePath: string;
  url?: string;
}

// Check if S3 is configured
function isS3Configured(): boolean {
  return !!(
    process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
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
  const ext = path.extname(fileName);
  const key = `${organizationId}/${crypto.randomUUID()}${ext}`;

  if (isS3Configured()) {
    return uploadToS3(buffer, key, contentType);
  }

  return uploadToLocal(buffer, key);
}

/**
 * Read a file from storage.
 */
export async function getFile(filePath: string): Promise<Buffer> {
  if (isS3Configured() && !filePath.startsWith("./") && !filePath.startsWith("/")) {
    return getFromS3(filePath);
  }

  return readFile(filePath);
}

// --- S3 Implementation ---

async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<StorageResult> {
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION!;
  const endpoint = process.env.S3_ENDPOINT; // For R2, MinIO, etc.

  const baseUrl = endpoint || `https://s3.${region}.amazonaws.com`;
  const url = `${baseUrl}/${bucket}/${key}`;

  const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");

  // Simple PUT with presigned-style headers
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": buffer.length.toString(),
      "x-amz-date": date,
      "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
    },
    body: new Uint8Array(buffer),
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status} ${await response.text()}`);
  }

  return { filePath: key, url };
}

async function getFromS3(key: string): Promise<Buffer> {
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION!;
  const endpoint = process.env.S3_ENDPOINT;

  const baseUrl = endpoint || `https://s3.${region}.amazonaws.com`;
  const url = `${baseUrl}/${bucket}/${key}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`S3 download failed: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// --- Local Implementation ---

async function uploadToLocal(
  buffer: Buffer,
  key: string
): Promise<StorageResult> {
  const uploadDir = process.env.UPLOAD_DIR || "./uploads";
  const filePath = path.join(uploadDir, key);
  const dir = path.dirname(filePath);

  await mkdir(dir, { recursive: true });
  await writeFile(filePath, buffer);

  return { filePath };
}
