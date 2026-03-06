/**
 * Handler: document.extracted → auto-create EmissionEntry
 *
 * When a document is extracted with high confidence (≥ 0.8),
 * automatically create an EmissionEntry from the extracted data.
 * Only fires for mappable document types (utility bills, fuel receipts,
 * travel records, waste manifests).
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { mapExtractedDataToEmission } from "@/lib/ai/document-to-emissions";
import { calculateEmissions } from "@/lib/emissions/calculator";
import { emit, type PipelineEvent } from "../dispatcher";

export async function handleAutoCreateEmission(
  payload: PipelineEvent["document.extracted"]
): Promise<void> {
  const { documentId, organizationId, userId, documentType, extractedData, confidence } = payload;

  // Only auto-create for high-confidence extractions
  if (confidence < 0.8) {
    return;
  }

  // Check if an emission entry already exists for this document
  const existing = await prisma.emissionEntry.findFirst({
    where: { documentId },
  });
  if (existing) {
    return;
  }

  // Get org region for emission factor lookup
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { country: true },
  });
  const region = org?.country || "GLOBAL";

  // Map extracted data to emission draft
  const draft = mapExtractedDataToEmission(documentType, extractedData, region);
  if (!draft) {
    return; // Document type not mappable (e.g. INVOICE, OTHER)
  }

  // Calculate emissions
  let calcResult;
  try {
    calcResult = await calculateEmissions(draft.calculationInput, organizationId);
  } catch (error) {
    console.error(
      `[AUTO_EMISSION] Calculation failed for document ${documentId}:`,
      error instanceof Error ? error.message : error
    );
    return;
  }

  // Validate dates
  const start = new Date(draft.startDate);
  const end = new Date(draft.endDate);
  if (end < start) {
    return;
  }

  // Find current reporting period
  const currentPeriod = await prisma.reportingPeriod.findFirst({
    where: { organizationId, isCurrent: true },
  });

  // Create the emission entry
  const entry = await prisma.emissionEntry.create({
    data: {
      organizationId,
      documentId,
      reportingPeriodId: currentPeriod?.id,
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
      startDate: start,
      endDate: end,
      location: draft.location,
      calculationMethod: calcResult.calculationMethod,
      confidenceScore: confidence,
      isEstimated: true,
      notes: `Auto-created from document extraction (confidence: ${(confidence * 100).toFixed(0)}%)`,
    },
  });

  await logAudit({
    organizationId,
    userId,
    action: "emission_auto_created",
    entityType: "EmissionEntry",
    entityId: entry.id,
    documentId,
    newValue: {
      scope: entry.scope,
      category: entry.category,
      co2e: entry.co2e,
      source: "auto_extraction",
      reportingPeriodId: currentPeriod?.id,
    },
  });

  // Emit downstream event
  await emit("emission.auto_created", {
    emissionEntryId: entry.id,
    documentId,
    organizationId,
    userId,
    scope: entry.scope,
    category: entry.category,
    co2e: entry.co2e,
  });
}
