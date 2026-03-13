import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateComplianceScore } from "@/lib/compliance-score";

const EMISSIONS_SECTION_PATTERNS = [
  "E1", "E2", "E3", "E4", "E5",
  "climate", "energy", "emissions",
  "301", "302", "303", "305",
];

interface FrameworkBreakdown {
  frameworkId: string;
  frameworkName: string;
  displayName: string;
  completionPct: number;
  status: string;
  targetYear: number;
  dueDate: string | null;
  totalDataPoints: number;
  coveredDataPoints: number;
  sections: {
    code: string;
    title: string;
    totalPoints: number;
    coveredPoints: number;
    status: "complete" | "partial" | "missing";
    missingItems: string[];
  }[];
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;

    // Use shared scoring logic
    const scoreResult = await calculateComplianceScore(orgId);
    const {
      overallPercentage,
      totalScore,
      maxPossibleScore,
      factors,
      data: {
        hasScope1,
        hasScope2,
        hasScope3,
        uniqueCategories,
        docTypes,
        extractedDocs,
        totalDocs,
        scoredSuppliers,
        totalSuppliers,
        reportCount,
      },
    } = scoreResult;

    // Fetch frameworks with sections for detailed breakdown
    const [orgFrameworks, org] = await Promise.all([
      prisma.orgFramework.findMany({
        where: { organizationId: orgId },
        include: {
          framework: {
            include: {
              sections: {
                include: { dataPoints: true },
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      }),
      prisma.organization.findUnique({
        where: { id: orgId },
        select: { name: true, industry: true, country: true },
      }),
    ]);

    // Build framework-level breakdowns
    const frameworkBreakdowns: FrameworkBreakdown[] = orgFrameworks.map((orgFw) => {
      const sections = orgFw.framework.sections.map((section) => {
        const sectionDataPoints = section.dataPoints;
        const totalPoints = sectionDataPoints.length;
        let coveredPoints = 0;
        const missingItems: string[] = [];

        const sectionCode = section.code.toLowerCase();
        const isEmissionsSection = EMISSIONS_SECTION_PATTERNS.some(
          (p) => sectionCode.includes(p.toLowerCase())
        );

        for (const dp of sectionDataPoints) {
          const dpCode = dp.code.toLowerCase();
          let isCovered = false;

          if (isEmissionsSection || dpCode.includes("emission") || dpCode.includes("ghg")) {
            if (dpCode.includes("scope_1") || dpCode.includes("direct")) isCovered = hasScope1;
            else if (dpCode.includes("scope_2") || dpCode.includes("indirect")) isCovered = hasScope2;
            else if (dpCode.includes("scope_3") || dpCode.includes("value_chain")) isCovered = hasScope3;
            else isCovered = hasScope1 || hasScope2;
          } else if (dpCode.includes("supplier") || dpCode.includes("supply_chain")) {
            isCovered = totalSuppliers > 0;
          } else if (dpCode.includes("energy") || dpCode.includes("consumption")) {
            isCovered = hasScope2;
          } else if (dpCode.includes("governance") || dpCode.includes("policy")) {
            isCovered = extractedDocs >= 3;
          } else if (dpCode.includes("report") || dpCode.includes("disclosure")) {
            isCovered = reportCount > 0;
          }

          if (isCovered) {
            coveredPoints++;
          } else {
            missingItems.push(dp.label);
          }
        }

        return {
          code: section.code,
          title: section.title,
          totalPoints,
          coveredPoints,
          status: (totalPoints === 0 ? "complete" : coveredPoints === totalPoints ? "complete" : coveredPoints > 0 ? "partial" : "missing") as "complete" | "partial" | "missing",
          missingItems: missingItems.slice(0, 5),
        };
      });

      const totalDPs = sections.reduce((s, sec) => s + sec.totalPoints, 0);
      const coveredDPs = sections.reduce((s, sec) => s + sec.coveredPoints, 0);

      return {
        frameworkId: orgFw.frameworkId,
        frameworkName: orgFw.framework.name,
        displayName: orgFw.framework.displayName,
        completionPct: orgFw.completionPct,
        status: orgFw.status,
        targetYear: orgFw.targetYear,
        dueDate: orgFw.dueDate?.toISOString() ?? null,
        totalDataPoints: totalDPs,
        coveredDataPoints: coveredDPs,
        sections,
      };
    });

    // Generate prioritized recommendations
    const recommendations = factors
      .filter((f) => f.action)
      .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))
      .map((f) => ({
        priority: f.maxScore - f.score >= 10 ? "high" : f.maxScore - f.score >= 5 ? "medium" : "low",
        label: f.label,
        action: f.action!,
        potentialGain: f.maxScore - f.score,
      }));

    return NextResponse.json({
      overallScore: overallPercentage,
      totalScore,
      maxPossibleScore,
      factors,
      frameworks: frameworkBreakdowns,
      recommendations,
      dataSummary: {
        emissionCategories: uniqueCategories.size,
        documentsProcessed: extractedDocs,
        documentsTotal: totalDocs,
        documentTypes: Array.from(docTypes),
        suppliersScored: scoredSuppliers,
        suppliersTotal: totalSuppliers,
        reportsGenerated: reportCount,
        hasScope1,
        hasScope2,
        hasScope3,
      },
      organization: org,
    });
  } catch (error) {
    console.error("[COMPLIANCE_BREAKDOWN]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
