/**
 * Handler: document.extracted → auto-detect and create Supplier
 *
 * When any document is extracted, look for vendor/supplier/provider
 * information and create a Supplier record if one doesn't already exist.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { emit, type PipelineEvent } from "../dispatcher";

/**
 * Recursively search extracted data for a vendor/supplier name.
 * Looks through nested objects for common vendor field names.
 */
function findVendorName(data: Record<string, unknown>): string | null {
  // Direct field lookup — check common vendor/supplier field names
  const directKeys = [
    "vendor", "vendorName", "supplierName", "supplier", "companyName",
    "provider", "handler", "carrier", "serviceCompany", "technician",
    "generator", "seller", "merchant", "payee",
  ];

  for (const key of directKeys) {
    const val = data[key];
    if (typeof val === "string" && val.trim().length > 0) {
      return val.trim();
    }
  }

  // Search nested objects (one level deep)
  for (const [, value] of Object.entries(data)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = value as Record<string, unknown>;
      for (const key of directKeys) {
        const val = nested[key];
        if (typeof val === "string" && val.trim().length > 0) {
          return val.trim();
        }
      }
    }
  }

  return null;
}

export async function handleAutoDetectSupplier(
  payload: PipelineEvent["document.extracted"]
): Promise<void> {
  const { documentId, organizationId, userId, documentType, extractedData } = payload;

  // Try to find a vendor/supplier name from any document type
  const vendorName = findVendorName(extractedData as Record<string, unknown>);

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
