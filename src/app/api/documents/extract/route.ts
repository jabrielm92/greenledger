import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractDocument } from "@/lib/ai/extract-document";
import { logAudit } from "@/lib/audit/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 }
      );
    }

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
          status: result.confidence >= 0.8 ? "EXTRACTED" : "EXTRACTED",
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

      console.error("[EXTRACTION_ERROR]", extractionError);
      return NextResponse.json(
        { error: "Extraction failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[DOCUMENTS_EXTRACT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
