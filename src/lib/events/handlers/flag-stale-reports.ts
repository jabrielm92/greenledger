/**
 * Handler: emission.auto_created → flag stale reports
 *
 * When new emission data arrives, any draft/review/approved reports
 * that reference the same reporting period get a stale data flag
 * so users know to refresh before publishing.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import type { PipelineEvent } from "../dispatcher";

export async function handleFlagStaleReports(
  payload: PipelineEvent["emission.auto_created"]
): Promise<void> {
  const { emissionEntryId, organizationId } = payload;

  // Get the emission entry to find its reporting period
  const entry = await prisma.emissionEntry.findUnique({
    where: { id: emissionEntryId },
    select: { reportingPeriodId: true },
  });

  // Find reports in non-final states that could be affected
  const where: Record<string, unknown> = {
    organizationId,
    status: { in: ["REVIEW", "APPROVED"] },
  };

  // If the emission has a reporting period, match it; otherwise flag all non-final reports
  if (entry?.reportingPeriodId) {
    where.reportingPeriodId = entry.reportingPeriodId;
  }

  const staleReports = await prisma.report.findMany({
    where,
    select: { id: true, title: true, status: true, manualEdits: true },
  });

  for (const report of staleReports) {
    // Store the stale flag in manualEdits metadata (avoids schema change)
    const currentEdits = (report.manualEdits as Record<string, unknown>) || {};

    // Skip if already flagged
    if (currentEdits._staleData) {
      continue;
    }

    await prisma.report.update({
      where: { id: report.id },
      data: {
        manualEdits: {
          ...currentEdits,
          _staleData: {
            flaggedAt: new Date().toISOString(),
            reason: "New emission data added after report generation",
            emissionEntryId,
          },
        } as never,
      },
    });

    await logAudit({
      organizationId,
      action: "report_flagged_stale",
      entityType: "Report",
      entityId: report.id,
      newValue: {
        reason: "new_emission_data",
        emissionEntryId,
      },
    });
  }
}
