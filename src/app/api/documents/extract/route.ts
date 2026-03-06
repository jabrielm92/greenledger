import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { z, ZodError } from "zod";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractDocument } from "@/lib/ai/extract-document";
import { logAudit } from "@/lib/audit/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { emit } from "@/lib/events";

const extractSchema = z.object({
  documentId: z.string().cuid(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = checkRateLimit(`extract:${session.user.organizationId}`, { limit: 20, windowSeconds: 60 });
    if (rl.limited) {
      return NextResponse.json(rl.response, { status: 429, headers: rl.headers });
    }

    const body = await req.json();
    const { documentId } = extractSchema.parse(body);

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        organizationId: session.user.organizationId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Update status to PROCESSING
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" },
    });

    try {
      // Read file content
      const fileBuffer = await readFile(document.filePath);
      const isImage = document.fileType.startsWith("image/");
      const fileContent = isImage
        ? fileBuffer.toString("base64")
        : fileBuffer.toString("utf-8");

      // Run AI extraction
      const result = await extractDocument(fileContent, document.fileType);

      // Update document with extraction results
      const updatedDocument = await prisma.document.update({
        where: { id: documentId },
        data: {
          documentType: result.classification.documentType as never,
          status: result.confidence >= 0.8 ? "EXTRACTED" : "REVIEWED",
          extractedData: result.extractedData as never,
          extractionConfidence: result.confidence,
        },
      });

      await logAudit({
        organizationId: session.user.organizationId,
        userId: session.user.id,
        action: "document_extracted",
        entityType: "Document",
        entityId: documentId,
        documentId,
        newValue: {
          documentType: result.classification.documentType,
          confidence: result.confidence,
        },
      });

      // Trigger post-extraction pipeline (auto-create emissions, detect suppliers, notify)
      emit("document.extracted", {
        documentId,
        organizationId: session.user.organizationId,
        userId: session.user.id,
        documentType: result.classification.documentType,
        extractedData: result.extractedData as Record<string, unknown>,
        confidence: result.confidence,
      }).catch((err) =>
        console.error("[POST_EXTRACTION_PIPELINE]", err)
      );

      return NextResponse.json(updatedDocument);
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
        organizationId: session.user.organizationId,
        userId: session.user.id,
        error: extractionError instanceof Error
          ? extractionError.message
          : "Extraction failed",
      }).catch((err) =>
        console.error("[EXTRACTION_FAILED_NOTIFY]", err)
      );

      console.error("[EXTRACTION_ERROR]", extractionError);
      return NextResponse.json(
        { error: "Extraction failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[DOCUMENTS_EXTRACT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
