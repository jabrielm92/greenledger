import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { calculateEmissions } from "@/lib/emissions/calculator";
import { mapExtractedDataToEmission } from "@/lib/ai/document-to-emissions";
import { emit } from "@/lib/events";

const createEmissionFromDocSchema = z.object({
  extractedData: z.record(z.unknown()),
  region: z.string().default("GLOBAL"),
  documentType: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: documentId } = await params;
    const body = await req.json();
    const { extractedData, region, documentType: overrideType } = createEmissionFromDocSchema.parse(body);

    // Verify document ownership
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

    // Use overridden type if provided, otherwise use the stored document type
    const effectiveType = overrideType || document.documentType;

    if (!effectiveType) {
      return NextResponse.json(
        { error: "Document has not been classified yet" },
        { status: 400 }
      );
    }

    // If the user overrode the document type, update it on the document record
    if (overrideType && overrideType !== document.documentType) {
      await prisma.document.update({
        where: { id: documentId },
        data: { documentType: overrideType as never },
      });
    }

    // Map extracted data to emission draft
    const draft = mapExtractedDataToEmission(
      effectiveType,
      extractedData,
      region
    );

    if (!draft) {
      return NextResponse.json(
        {
          error: `Cannot create emission entry from document type "${document.documentType}". Supported types: utility bills, fuel receipts, invoices, supplier reports, travel records, waste manifests, fleet logs, and refrigerant logs.`,
        },
        { status: 400 }
      );
    }

    // Calculate emissions using the calculation engine
    let calcResult;
    try {
      calcResult = await calculateEmissions(
        draft.calculationInput,
        session.user.organizationId
      );
    } catch (calcError) {
      return NextResponse.json(
        {
          error:
            calcError instanceof Error
              ? calcError.message
              : "Emission calculation failed",
        },
        { status: 422 }
      );
    }

    // Validate date order
    const start = new Date(draft.startDate);
    const end = new Date(draft.endDate);
    if (end < start) {
      return NextResponse.json(
        { error: "End date must be on or after start date" },
        { status: 400 }
      );
    }

    // Create the emission entry
    const entry = await prisma.emissionEntry.create({
      data: {
        organizationId: session.user.organizationId,
        documentId,
        scope: draft.scope,
        category: draft.category,
        subcategory: draft.subcategory,
        source: draft.source,
        description: draft.description,
        activityValue: draft.activityValue,
        activityUnit: draft.activityUnit,
        emissionFactor: calcResult.emissionFactor,
        emissionFactorSource: calcResult.emissionFactorSource,
        co2e: calcResult.co2e,
        co2: calcResult.co2,
        ch4: calcResult.ch4,
        n2o: calcResult.n2o,
        startDate: new Date(draft.startDate),
        endDate: new Date(draft.endDate),
        location: draft.location,
        calculationMethod: calcResult.calculationMethod,
        confidenceScore: document.extractionConfidence,
        notes: `Auto-generated from document: ${document.fileName}`,
      },
    });

    // Update document status to REVIEWED
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "REVIEWED",
        extractedData: extractedData as never,
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "emission_from_document",
      entityType: "EmissionEntry",
      entityId: entry.id,
      documentId,
      newValue: {
        scope: entry.scope,
        category: entry.category,
        co2e: entry.co2e,
        source: "ai_extraction",
      },
    });

    // Emit event so compliance updates, notifications, and stale-report checks run
    await emit("emission.auto_created", {
      emissionEntryId: entry.id,
      documentId,
      organizationId: session.user.organizationId,
      userId: session.user.id,
      scope: entry.scope,
      category: entry.category,
      co2e: entry.co2e,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[CREATE_EMISSION_FROM_DOC]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
