import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { DocumentType } from "@prisma/client";

const EMISSIONS_SECTION_PATTERNS = [
  "E1", "E2", "E3", "E4", "E5",
  "climate", "energy", "emissions",
  "301", "302", "303", "305",
];

interface ScoringFactor {
  id: string;
  label: string;
  category: "emissions" | "documents" | "suppliers" | "reports" | "governance";
  status: "complete" | "partial" | "missing";
  score: number;
  maxScore: number;
  description: string;
  action?: string;
}

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

    // Fetch all relevant data in parallel
    const [
      orgFrameworks,
      emissionCategories,
      documentsByType,
      reportCount,
      scoredSuppliers,
      totalSuppliers,
      extractedDocs,
      totalDocs,
      org,
    ] = await Promise.all([
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
      prisma.emissionEntry.groupBy({
        by: ["scope", "category"],
        where: { organizationId: orgId },
      }),
      prisma.document.groupBy({
        by: ["documentType"],
        where: {
          organizationId: orgId,
          status: { in: ["EXTRACTED", "REVIEWED"] },
        },
        _count: true,
      }),
      prisma.report.count({ where: { organizationId: orgId } }),
      prisma.supplier.count({
        where: { organizationId: orgId, esgRiskLevel: { not: "UNKNOWN" } },
      }),
      prisma.supplier.count({ where: { organizationId: orgId } }),
      prisma.document.count({
        where: { organizationId: orgId, status: { in: ["EXTRACTED", "REVIEWED"] } },
      }),
      prisma.document.count({ where: { organizationId: orgId } }),
      prisma.organization.findUnique({
        where: { id: orgId },
        select: { name: true, industry: true, country: true },
      }),
    ]);

    const hasScope1 = emissionCategories.some((e) => e.scope === "SCOPE_1");
    const hasScope2 = emissionCategories.some((e) => e.scope === "SCOPE_2");
    const hasScope3 = emissionCategories.some((e) => e.scope === "SCOPE_3");
    const uniqueCategories = new Set(emissionCategories.map((e) => e.category));

    // Build scoring factors
    const factors: ScoringFactor[] = [];

    // Emissions factors
    factors.push({
      id: "scope1",
      label: "Scope 1 Emissions (Direct)",
      category: "emissions",
      status: hasScope1 ? "complete" : "missing",
      score: hasScope1 ? 15 : 0,
      maxScore: 15,
      description: hasScope1
        ? "Direct emissions data recorded (fuel combustion, company vehicles, refrigerants)"
        : "No Scope 1 emission entries found",
      action: hasScope1 ? undefined : "Add entries for natural gas, diesel, fleet vehicles, or refrigerants in Emissions > Scope 1",
    });

    factors.push({
      id: "scope2",
      label: "Scope 2 Emissions (Indirect)",
      category: "emissions",
      status: hasScope2 ? "complete" : "missing",
      score: hasScope2 ? 15 : 0,
      maxScore: 15,
      description: hasScope2
        ? "Indirect energy emissions data recorded (purchased electricity, heat)"
        : "No Scope 2 emission entries found",
      action: hasScope2 ? undefined : "Upload utility bills or add electricity/heat data in Emissions > Scope 2",
    });

    factors.push({
      id: "scope3",
      label: "Scope 3 Emissions (Value Chain)",
      category: "emissions",
      status: hasScope3 ? "complete" : "missing",
      score: hasScope3 ? 10 : 0,
      maxScore: 10,
      description: hasScope3
        ? "Value chain emissions data recorded (travel, waste, commuting)"
        : "No Scope 3 emission entries found",
      action: hasScope3 ? undefined : "Add business travel, waste disposal, or employee commuting data in Emissions > Scope 3",
    });

    // Document factors
    const docTypes = new Set(documentsByType.map((d) => d.documentType));
    const requiredDocTypes = ["UTILITY_BILL", "FUEL_RECEIPT", "INVOICE"] as const;
    const coveredDocTypes = requiredDocTypes.filter((t) => docTypes.has(t as DocumentType));

    factors.push({
      id: "documents",
      label: "Supporting Documents",
      category: "documents",
      status: coveredDocTypes.length >= 3 ? "complete" : coveredDocTypes.length > 0 ? "partial" : "missing",
      score: Math.min(15, coveredDocTypes.length * 5),
      maxScore: 15,
      description: extractedDocs > 0
        ? `${extractedDocs} document${extractedDocs === 1 ? "" : "s"} processed (${coveredDocTypes.length}/3 key types covered)`
        : "No documents uploaded and extracted yet",
      action: coveredDocTypes.length < 3
        ? `Upload ${requiredDocTypes.filter((t) => !docTypes.has(t as DocumentType)).map((t) => t.replace(/_/g, " ").toLowerCase()).join(", ")} to improve your score`
        : undefined,
    });

    // Supplier factors
    factors.push({
      id: "suppliers",
      label: "Supply Chain ESG Assessment",
      category: "suppliers",
      status: scoredSuppliers >= 3 ? "complete" : scoredSuppliers > 0 ? "partial" : "missing",
      score: Math.min(10, scoredSuppliers > 0 ? (scoredSuppliers >= 3 ? 10 : 5) : 0),
      maxScore: 10,
      description: totalSuppliers > 0
        ? `${scoredSuppliers}/${totalSuppliers} suppliers have ESG risk assessments`
        : "No suppliers added to the system",
      action: scoredSuppliers < 3
        ? totalSuppliers === 0
          ? "Add your key suppliers in the Suppliers section to track supply chain ESG risk"
          : `${totalSuppliers - scoredSuppliers} supplier${totalSuppliers - scoredSuppliers === 1 ? " needs" : "s need"} ESG risk assessment — open each supplier to trigger scoring`
        : undefined,
    });

    // Report factors
    factors.push({
      id: "reports",
      label: "Compliance Reports Generated",
      category: "reports",
      status: reportCount >= 1 ? "complete" : "missing",
      score: reportCount >= 1 ? 15 : 0,
      maxScore: 15,
      description: reportCount > 0
        ? `${reportCount} report${reportCount === 1 ? "" : "s"} generated`
        : "No compliance reports generated yet",
      action: reportCount === 0
        ? "Go to Reports > New Report to generate your first compliance report"
        : undefined,
    });

    // Governance / policies factor
    const hasPolicyDocs = docTypes.has("SUPPLIER_REPORT") || extractedDocs >= 5;
    factors.push({
      id: "governance",
      label: "Governance & Policy Documentation",
      category: "governance",
      status: hasPolicyDocs ? "complete" : extractedDocs >= 3 ? "partial" : "missing",
      score: hasPolicyDocs ? 10 : extractedDocs >= 3 ? 5 : 0,
      maxScore: 10,
      description: hasPolicyDocs
        ? "Governance documentation coverage is strong"
        : "Upload more documents to demonstrate ESG governance practices",
      action: !hasPolicyDocs
        ? "Upload supplier ESG reports, policy documents, or additional supporting evidence"
        : undefined,
    });

    // Diversity of emission categories
    factors.push({
      id: "coverage",
      label: "Emission Category Coverage",
      category: "emissions",
      status: uniqueCategories.size >= 4 ? "complete" : uniqueCategories.size >= 2 ? "partial" : "missing",
      score: Math.min(10, uniqueCategories.size >= 4 ? 10 : uniqueCategories.size * 3),
      maxScore: 10,
      description: uniqueCategories.size > 0
        ? `${uniqueCategories.size} emission categor${uniqueCategories.size === 1 ? "y" : "ies"} tracked across all scopes`
        : "No emission categories tracked",
      action: uniqueCategories.size < 4
        ? "Add more diverse emission types (e.g., electricity, natural gas, vehicle fuel, waste) for comprehensive coverage"
        : undefined,
    });

    // Calculate overall score
    const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
    const maxPossibleScore = factors.reduce((sum, f) => sum + f.maxScore, 0);
    const overallPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

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
          missingItems: missingItems.slice(0, 5), // cap to prevent huge payloads
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
