/**
 * Handler: document.extracted → auto-detect and create Supplier
 *
 * When an INVOICE or SUPPLIER_REPORT is extracted, look for vendor
 * information and create a Supplier record if one doesn't already exist.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { emit, type PipelineEvent } from "../dispatcher";

const SUPPLIER_DOC_TYPES = ["INVOICE", "SUPPLIER_REPORT"];

export async function handleAutoDetectSupplier(
  payload: PipelineEvent["document.extracted"]
): Promise<void> {
  const { documentId, organizationId, userId, documentType, extractedData } = payload;

  if (!SUPPLIER_DOC_TYPES.includes(documentType)) {
    return;
  }

  // Extract vendor/supplier name from extracted data
  const vendorName =
    (extractedData.vendor as string) ||
    (extractedData.vendorName as string) ||
    (extractedData.supplierName as string) ||
    (extractedData.supplier as string) ||
    (extractedData.companyName as string);

  if (!vendorName || vendorName.trim().length === 0) {
    return;
  }

  const normalizedName = vendorName.trim();

  // Check if a supplier with this name already exists (case-insensitive)
  const existing = await prisma.supplier.findFirst({
    where: {
      organizationId,
      name: { equals: normalizedName, mode: "insensitive" },
    },
  });

  if (existing) {
    return;
  }

  // Create new supplier from extracted data
  const contactEmail = (extractedData.vendorEmail as string) || (extractedData.email as string) || undefined;
  const contactName = (extractedData.vendorContact as string) || (extractedData.contactName as string) || undefined;
  const country = (extractedData.vendorCountry as string) || (extractedData.country as string) || undefined;

  const supplier = await prisma.supplier.create({
    data: {
      organizationId,
      name: normalizedName,
      contactEmail: contactEmail || null,
      contactName: contactName || null,
      country: country || null,
      esgRiskLevel: "UNKNOWN",
      notes: `Auto-detected from ${documentType.toLowerCase().replace("_", " ")} (Document: ${documentId})`,
    },
  });

  await logAudit({
    organizationId,
    userId,
    action: "supplier_auto_created",
    entityType: "Supplier",
    entityId: supplier.id,
    documentId,
    newValue: {
      name: supplier.name,
      source: "auto_detection",
      documentType,
    },
  });

  await emit("supplier.auto_created", {
    supplierId: supplier.id,
    organizationId,
    userId,
    supplierName: supplier.name,
    documentId,
  });
}
