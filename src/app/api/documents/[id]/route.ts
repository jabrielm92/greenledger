import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { type DocumentType, type DocumentStatus } from "@prisma/client";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";

const updateDocumentSchema = z.object({
  status: z.string().optional().transform((v) => v as DocumentStatus | undefined),
  extractedData: z.any().optional(),
  documentType: z.string().optional().transform((v) => v as DocumentType | undefined),
  extractionConfidence: z.number().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        uploadedBy: { select: { name: true, email: true } },
        emissionEntries: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("[DOCUMENT_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const rawBody = await req.json();
    const body = updateDocumentSchema.parse(rawBody);

    const existing = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.extractedData !== undefined && {
          extractedData: body.extractedData,
        }),
        ...(body.documentType && { documentType: body.documentType }),
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_updated",
      entityType: "Document",
      entityId: id,
      documentId: id,
      previousValue: { status: existing.status },
      newValue: { status: document.status },
    });

    return NextResponse.json(document);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[DOCUMENT_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.document.delete({ where: { id } });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_deleted",
      entityType: "Document",
      entityId: id,
      documentId: id,
      previousValue: {
        fileName: existing.fileName,
        status: existing.status,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
