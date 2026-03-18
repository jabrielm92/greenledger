/**
 * One-time migration script to move existing local files to S3.
 * Run with: npx tsx scripts/migrate-to-s3.ts
 */

import { PrismaClient } from "@prisma/client";
import { uploadFile } from "../src/lib/storage";
import * as fs from "fs";

const prisma = new PrismaClient();

async function migrateToS3() {
  console.log("Starting S3 migration...");

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { filePath: { startsWith: "./" } },
        { filePath: { startsWith: "/" } },
        { filePath: { contains: "uploads/" } },
      ],
    },
  });

  console.log(`Found ${documents.length} documents to migrate`);

  let migrated = 0;
  let errors = 0;

  for (const doc of documents) {
    try {
      const localPath = doc.filePath;

      if (!fs.existsSync(localPath)) {
        console.warn(`  File not found: ${localPath}`);
        errors++;
        continue;
      }

      const fileBuffer = fs.readFileSync(localPath);

      const { filePath: s3Key } = await uploadFile(
        fileBuffer,
        doc.fileName,
        doc.organizationId,
        doc.fileType
      );

      await prisma.document.update({
        where: { id: doc.id },
        data: { filePath: s3Key },
      });

      console.log(`  Migrated: ${doc.fileName} -> ${s3Key}`);
      migrated++;
    } catch (error) {
      console.error(`  Failed to migrate ${doc.fileName}:`, error);
      errors++;
    }
  }

  console.log("");
  console.log("Migration complete:");
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Errors: ${errors}`);

  await prisma.$disconnect();
}

migrateToS3().catch(console.error);
