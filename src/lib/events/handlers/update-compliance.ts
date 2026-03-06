/**
 * Handler: emission.auto_created → update compliance framework progress
 *
 * When new emission entries are created, recalculate the completionPct
 * for each active OrgFramework. The calculation checks how many required
 * data points in climate/emissions-related sections now have backing data.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import type { PipelineEvent } from "../dispatcher";

// Scope-related section codes that map to emissions data
const EMISSIONS_SECTION_PATTERNS = [
  "E1", "E2", "E3", "E4", "E5",        // CSRD environmental
  "climate", "energy", "emissions",       // common section keywords
  "301", "302", "303", "305",            // GRI environmental disclosures
];

export async function handleUpdateCompliance(
  payload: PipelineEvent["emission.auto_created"]
): Promise<void> {
  const { organizationId } = payload;

  // Get active frameworks for this org
  const orgFrameworks = await prisma.orgFramework.findMany({
    where: { organizationId },
    include: {
      framework: {
        include: {
          sections: {
            where: { isRequired: true },
            include: {
              dataPoints: { where: { isRequired: true } },
            },
          },
        },
      },
    },
  });

  if (orgFrameworks.length === 0) {
    return;
  }

  // Count distinct emissions data categories we have
  const emissionCategories = await prisma.emissionEntry.groupBy({
    by: ["scope", "category"],
    where: { organizationId },
  });

  const hasScope1 = emissionCategories.some((e) => e.scope === "SCOPE_1");
  const hasScope2 = emissionCategories.some((e) => e.scope === "SCOPE_2");
  const hasScope3 = emissionCategories.some((e) => e.scope === "SCOPE_3");

  // Count reports that exist
  const reportCount = await prisma.report.count({
    where: { organizationId, status: { not: "DRAFT" } },
  });

  // Count suppliers with ESG scores
  const scoredSuppliers = await prisma.supplier.count({
    where: {
      organizationId,
      esgRiskLevel: { not: "UNKNOWN" },
    },
  });

  for (const orgFw of orgFrameworks) {
    const totalRequired = orgFw.framework.sections.reduce(
      (sum, section) => sum + section.dataPoints.length,
      0
    );

    if (totalRequired === 0) {
      continue;
    }

    // Estimate completion based on available data
    let coveredPoints = 0;

    for (const section of orgFw.framework.sections) {
      const code = section.code.toLowerCase();
      const isEmissionsSection = EMISSIONS_SECTION_PATTERNS.some(
        (pattern) => code.includes(pattern.toLowerCase())
      );

      for (const dp of section.dataPoints) {
        const dpCode = dp.code.toLowerCase();

        // Check if this data point is covered by existing data
        let isCovered = false;

        if (isEmissionsSection || dpCode.includes("emission") || dpCode.includes("ghg")) {
          // Emissions data points: covered if we have matching scope data
          if (dpCode.includes("scope_1") || dpCode.includes("scope1") || dpCode.includes("direct")) {
            isCovered = hasScope1;
          } else if (dpCode.includes("scope_2") || dpCode.includes("scope2") || dpCode.includes("indirect")) {
            isCovered = hasScope2;
          } else if (dpCode.includes("scope_3") || dpCode.includes("scope3") || dpCode.includes("value_chain")) {
            isCovered = hasScope3;
          } else if (dpCode.includes("total") || dpCode.includes("ghg")) {
            isCovered = hasScope1 || hasScope2 || hasScope3;
          }
        } else if (dpCode.includes("supplier") || dpCode.includes("supply_chain")) {
          isCovered = scoredSuppliers > 0;
        } else if (dpCode.includes("report") || dpCode.includes("disclosure")) {
          isCovered = reportCount > 0;
        }

        // Also check explicit ReportDataPoint entries
        if (!isCovered) {
          const reportDataPoint = await prisma.reportDataPoint.findFirst({
            where: {
              dataPointId: dp.id,
              isComplete: true,
              report: { organizationId },
            },
          });
          isCovered = !!reportDataPoint;
        }

        if (isCovered) {
          coveredPoints++;
        }
      }
    }

    const newCompletionPct = Math.round((coveredPoints / totalRequired) * 100);
    const previousPct = orgFw.completionPct;

    if (newCompletionPct !== previousPct) {
      // Update status based on completion
      let newStatus = orgFw.status;
      if (newCompletionPct > 0 && orgFw.status === "NOT_STARTED") {
        newStatus = "IN_PROGRESS";
      }

      await prisma.orgFramework.update({
        where: { id: orgFw.id },
        data: {
          completionPct: newCompletionPct,
          status: newStatus,
        },
      });

      await logAudit({
        organizationId,
        action: "compliance_progress_updated",
        entityType: "OrgFramework",
        entityId: orgFw.id,
        previousValue: { completionPct: previousPct, status: orgFw.status },
        newValue: { completionPct: newCompletionPct, status: newStatus },
        metadata: { trigger: "auto_emission_created" },
      });
    }
  }
}
