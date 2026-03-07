/**
 * Runs document extraction directly (no HTTP self-fetch).
 *
 * This replaces the previous approach of triggering extraction via
 * `fetch(/api/documents/extract)` which broke on Railway/Docker
 * because the internal container serves HTTP while the origin URL
 * uses HTTPS, causing ERR_SSL_WRONG_VERSION_NUMBER.
 */

import { prisma } from "@/lib/prisma";
import { getFile } from "@/lib/storage";
import { extractDocument } from "./extract-document";
import { logAudit } from "@/lib/audit/logger";
import { emit } from "@/lib/events";

interface ExtractionInput {
  documentId: string;
  organizationId: string;
  userId: string;
}

export async function runDocumentExtraction(input: ExtractionInput): Promise<void> {
  const { documentId, organizationId, userId } = input;

  const document = await prisma.document.findFirst({
    where: { id: documentId, organizationId },
  });

  if (!document) {
    console.error("[RUN_EXTRACTION] Document not found:", documentId);
    return;
  }

  // Update status to PROCESSING
  await prisma.document.update({
    where: { id: documentId },
    data: { status: "PROCESSING" },
  });

  try {
    // Read file content
    const fileBuffer = await getFile(document.filePath);
    const isImage = document.fileType.startsWith("image/");
    const fileContent = isImage
      ? fileBuffer.toString("base64")
      : fileBuffer.toString("utf-8");

    // Run AI extraction
    const result = await extractDocument(fileContent, document.fileType);

    // Update document with extraction results
    await prisma.document.update({
      where: { id: documentId },
      data: {
        documentType: result.classification.documentType as never,
        status: result.confidence >= 0.8 ? "EXTRACTED" : "REVIEWED",
        extractedData: result.extractedData as never,
        extractionConfidence: result.confidence,
      },
    });

    await logAudit({
      organizationId,
      userId,
      action: "document_extracted",
      entityType: "Document",
      entityId: documentId,
      documentId,
      newValue: {
        documentType: result.classification.documentType,
        confidence: result.confidence,
      },
    });

    // Trigger post-extraction pipeline
    emit("document.extracted", {
      documentId,
      organizationId,
      userId,
      documentType: result.classification.documentType,
      extractedData: result.extractedData as Record<string, unknown>,
      confidence: result.confidence,
    }).catch((err) =>
      console.error("[POST_EXTRACTION_PIPELINE]", err)
    );
  } catch (extractionError) {
    // Mark as failed
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "FAILED",
        processingError:
          extractionError instanceof Error
            ? extractionError.message
            : "Extraction failed",
      },
    });

    // Notify about extraction failure
    emit("document.extraction_failed", {
      documentId,
      organizationId,
      userId,
      error:
        extractionError instanceof Error
          ? extractionError.message
          : "Extraction failed",
    }).catch((err) =>
      console.error("[EXTRACTION_FAILED_NOTIFY]", err)
    );

    console.error("[RUN_EXTRACTION_ERROR]", extractionError);
  }
}
