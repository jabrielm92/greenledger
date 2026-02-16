import { prisma } from "@/lib/prisma";

interface LogAuditParams {
  organizationId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  documentId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit(params: LogAuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: params.organizationId,
        userId: params.userId ?? undefined,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        previousValue: params.previousValue
          ? JSON.parse(JSON.stringify(params.previousValue))
          : undefined,
        newValue: params.newValue
          ? JSON.parse(JSON.stringify(params.newValue))
          : undefined,
        documentId: params.documentId,
        metadata: params.metadata
          ? JSON.parse(JSON.stringify(params.metadata))
          : undefined,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}
