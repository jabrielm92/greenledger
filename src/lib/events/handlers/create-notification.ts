/**
 * Handler: various events → create in-app notifications
 *
 * Generates Notification records so users can see what the
 * automation pipeline did on their behalf.
 */

import { prisma } from "@/lib/prisma";
import type { PipelineEvent } from "../dispatcher";

type NotificationType =
  | "EXTRACTION_COMPLETE"
  | "EXTRACTION_FAILED"
  | "EMISSION_AUTO_CREATED"
  | "SUPPLIER_AUTO_CREATED"
  | "REPORT_STALE"
  | "COMPLIANCE_MILESTONE";

async function createNotification(params: {
  organizationId: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  entityType?: string;
  entityId?: string;
}): Promise<void> {
  await prisma.notification.create({
    data: {
      organizationId: params.organizationId,
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      entityType: params.entityType,
      entityId: params.entityId,
    },
  });
}

export async function notifyExtractionComplete(
  payload: PipelineEvent["document.extracted"]
): Promise<void> {
  const doc = await prisma.document.findUnique({
    where: { id: payload.documentId },
    select: { fileName: true },
  });

  const confidence = (payload.confidence * 100).toFixed(0);

  await createNotification({
    organizationId: payload.organizationId,
    userId: payload.userId,
    type: "EXTRACTION_COMPLETE",
    title: "Document extracted",
    message: `"${doc?.fileName || "Document"}" was classified as ${payload.documentType.replace(/_/g, " ").toLowerCase()} with ${confidence}% confidence.`,
    link: `/documents/${payload.documentId}`,
    entityType: "Document",
    entityId: payload.documentId,
  });
}

export async function notifyExtractionFailed(
  payload: PipelineEvent["document.extraction_failed"]
): Promise<void> {
  const doc = await prisma.document.findUnique({
    where: { id: payload.documentId },
    select: { fileName: true },
  });

  await createNotification({
    organizationId: payload.organizationId,
    userId: payload.userId,
    type: "EXTRACTION_FAILED",
    title: "Extraction failed",
    message: `Failed to extract data from "${doc?.fileName || "document"}": ${payload.error}`,
    link: `/documents/${payload.documentId}`,
    entityType: "Document",
    entityId: payload.documentId,
  });
}

export async function notifyEmissionAutoCreated(
  payload: PipelineEvent["emission.auto_created"]
): Promise<void> {
  const co2eFormatted =
    payload.co2e >= 1000
      ? `${(payload.co2e / 1000).toFixed(2)} tCO2e`
      : `${payload.co2e.toFixed(2)} kgCO2e`;

  await createNotification({
    organizationId: payload.organizationId,
    userId: payload.userId,
    type: "EMISSION_AUTO_CREATED",
    title: "Emission entry auto-created",
    message: `${payload.scope.replace("_", " ")} emission (${payload.category}): ${co2eFormatted} — created from document extraction.`,
    link: `/emissions`,
    entityType: "EmissionEntry",
    entityId: payload.emissionEntryId,
  });
}

export async function notifySupplierAutoCreated(
  payload: PipelineEvent["supplier.auto_created"]
): Promise<void> {
  await createNotification({
    organizationId: payload.organizationId,
    userId: payload.userId,
    type: "SUPPLIER_AUTO_CREATED",
    title: "New supplier detected",
    message: `"${payload.supplierName}" was automatically added from a document. ESG risk scoring has been triggered.`,
    link: `/suppliers`,
    entityType: "Supplier",
    entityId: payload.supplierId,
  });
}
