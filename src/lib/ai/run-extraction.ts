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
import { analyzeDocument } from "./analyze-document";
import { parseDocumentContent } from "./parse-document-content";
import { selectModel, analyzeComplexity } from "./select-model";
import { logAIUsage } from "./log-usage";
import { logAudit } from "@/lib/audit/logger";
import { emit } from "@/lib/events";
import { logger } from "@/lib/logger";

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
    // Read and parse file content based on document type
    const fileBuffer = await getFile(document.filePath);
    const parsed = await parseDocumentContent(fileBuffer, document.fileType);

    // Analyze document complexity for model selection
    const complexity = await analyzeComplexity(fileBuffer, document.fileType);
    // Use document type hint from filename if available
    if (document.documentType) {
      complexity.documentType = document.documentType;
    }
    const { model, estimatedCost, reason } = selectModel(complexity);

    logger.info("AI model selected for extraction", {
      documentId,
      model,
      estimatedCost,
      reason,
      pageCount: complexity.pageCount,
    });

    // Run AI extraction with the parsed content and selected model
    const effectiveMimeType = parsed.isImage
      ? (document.fileType.startsWith("image/") ? document.fileType : "image/png")
      : "text/plain";
    const result = await extractDocument(
      parsed.content,
      effectiveMimeType,
      document.fileName,
      model
    );

    // Log AI usage
    if (result.usage) {
      await logAIUsage({
        organizationId,
        documentId,
        operation: "document_extraction",
        model: result.usage.model,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
      });
    }

    // Run AI analysis in parallel with usage logging for faster processing
    const [aiAnalysis] = await Promise.all([
      analyzeDocument(
        result.classification.documentType,
        result.extractedData as Record<string, unknown>,
        document.fileName
      ).catch((err) => {
        console.error("[AI_ANALYSIS_ERROR]", err);
        return null;
      }),
    ]);

    // Update document with extraction results and AI analysis
    await prisma.document.update({
      where: { id: documentId },
      data: {
        documentType: result.classification.documentType as never,
        status: result.confidence >= 0.8 ? "EXTRACTED" : "REVIEWED",
        extractedData: result.extractedData as never,
        extractionConfidence: result.confidence,
        ...(aiAnalysis ? { aiAnalysis: aiAnalysis as never } : {}),
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
        aiModel: model,
        estimatedCost,
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
