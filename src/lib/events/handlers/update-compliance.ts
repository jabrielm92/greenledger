/**
 * Handler: emission.auto_created → update compliance framework progress
 *
 * When new emission entries are created, recalculate the completionPct
 * for each active OrgFramework. The calculation checks how many required
 * data points in climate/emissions-related sections now have backing data.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
// Scope-related section codes that map to emissions data
const EMISSIONS_SECTION_PATTERNS = [
  "E1", "E2", "E3", "E4", "E5",        // CSRD environmental
  "climate", "energy", "emissions",       // common section keywords
  "301", "302", "303", "305",            // GRI environmental disclosures
];

export async function handleUpdateCompliance(
  payload: { organizationId: string }
): Promise<void> {
  const { organizationId } = payload;

  // Get active frameworks for this org
  const orgFrameworks = await prisma.orgFramework.findMany({
    where: { organizationId },
    include: {
      framework: {
        include: {
          sections: {
            include: {
              dataPoints: true,
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
  const hasAnyEmissions = emissionCategories.length > 0;

  // Count reports that exist
  const reportCount = await prisma.report.count({
    where: { organizationId },
  });

  // Count suppliers with ESG scores
  const scoredSuppliers = await prisma.supplier.count({
    where: {
      organizationId,
      esgRiskLevel: { not: "UNKNOWN" },
    },
  });

  // Count total suppliers
  const totalSuppliers = await prisma.supplier.count({
    where: { organizationId },
  });

  // Count extracted documents
  const extractedDocs = await prisma.document.count({
    where: {
      organizationId,
      status: { in: ["EXTRACTED", "REVIEWED"] },
    },
  });

  for (const orgFw of orgFrameworks) {
    const allDataPoints = orgFw.framework.sections.flatMap(
      (section) => section.dataPoints
    );

    let totalRequired = allDataPoints.filter((dp) => dp.isRequired).length;

    // If no data points marked as required, use all data points
    if (totalRequired === 0) {
      totalRequired = allDataPoints.length;
    }

    if (totalRequired === 0) {
      // No data points at all — base score on whether we have data
      const baseScore = hasAnyEmissions ? 25 : 0;
      const docBonus = extractedDocs > 0 ? 15 : 0;
      const supplierBonus = totalSuppliers > 0 ? 10 : 0;
      const newCompletionPct = Math.min(100, baseScore + docBonus + supplierBonus);

      if (newCompletionPct !== orgFw.completionPct) {
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
      }
      continue;
    }

    // Estimate completion based on available data
    let coveredPoints = 0;
    const dataPointsToCheck = totalRequired === allDataPoints.length
      ? allDataPoints
      : allDataPoints.filter((dp) => dp.isRequired);

    for (const dp of dataPointsToCheck) {
      const section = orgFw.framework.sections.find(
        (s) => s.id === dp.sectionId
      );
      const sectionCode = section?.code.toLowerCase() || "";
      const dpCode = dp.code.toLowerCase();

      const isEmissionsSection = EMISSIONS_SECTION_PATTERNS.some(
        (pattern) => sectionCode.includes(pattern.toLowerCase())
      );

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
        } else {
          // Generic emissions data point — covered if we have any emissions
          isCovered = hasAnyEmissions;
        }
      } else if (dpCode.includes("supplier") || dpCode.includes("supply_chain")) {
        isCovered = totalSuppliers > 0 || scoredSuppliers > 0;
      } else if (dpCode.includes("report") || dpCode.includes("disclosure")) {
        isCovered = reportCount > 0;
      } else if (dpCode.includes("energy") || dpCode.includes("consumption")) {
        isCovered = hasAnyEmissions;
      } else if (dpCode.includes("waste") || dpCode.includes("water")) {
        isCovered = hasAnyEmissions;
      } else if (dpCode.includes("governance") || dpCode.includes("policy") || dpCode.includes("strategy")) {
        // Governance/policy points — give credit if org has documents
        isCovered = extractedDocs > 0;
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

      // Give partial credit for having documents even if specific match isn't found
      if (!isCovered && extractedDocs > 0 && hasAnyEmissions) {
        // Mark as covered if we have enough supporting data
        // This prevents 0% when user has active data
        isCovered = false; // keep false, but we add a baseline below
      }

      if (isCovered) {
        coveredPoints++;
      }
    }

    // Calculate base percentage from data point coverage
    let newCompletionPct = Math.round((coveredPoints / totalRequired) * 100);

    // Add baseline progress for having any data at all
    if (newCompletionPct === 0 && (hasAnyEmissions || extractedDocs > 0 || totalSuppliers > 0)) {
      let baseline = 0;
      if (hasAnyEmissions) baseline += 10;
      if (extractedDocs > 0) baseline += 5;
      if (totalSuppliers > 0) baseline += 5;
      newCompletionPct = Math.min(100, baseline);
    }

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
