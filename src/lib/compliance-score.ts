import { prisma } from "@/lib/prisma";
import type { DocumentType } from "@prisma/client";

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

export interface ComplianceScoreResult {
  overallPercentage: number;
  totalScore: number;
  maxPossibleScore: number;
  factors: ScoringFactor[];
  data: {
    hasScope1: boolean;
    hasScope2: boolean;
    hasScope3: boolean;
    uniqueCategories: Set<string>;
    docTypes: Set<DocumentType | null>;
    extractedDocs: number;
    totalDocs: number;
    scoredSuppliers: number;
    totalSuppliers: number;
    reportCount: number;
  };
}

export async function calculateComplianceScore(orgId: string): Promise<ComplianceScoreResult> {
  const [
    emissionCategories,
    documentsByType,
    reportCount,
    scoredSuppliers,
    totalSuppliers,
    extractedDocs,
    totalDocs,
  ] = await Promise.all([
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
  ]);

  const hasScope1 = emissionCategories.some((e) => e.scope === "SCOPE_1");
  const hasScope2 = emissionCategories.some((e) => e.scope === "SCOPE_2");
  const hasScope3 = emissionCategories.some((e) => e.scope === "SCOPE_3");
  const uniqueCategories = new Set(emissionCategories.map((e) => e.category));

  const factors: ScoringFactor[] = [];

  // Scope 1
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

  // Scope 2
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

  // Scope 3
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

  // Documents
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

  // Suppliers
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

  // Reports
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

  // Governance
  const hasPolicyDocs = docTypes.has("SUPPLIER_REPORT" as DocumentType) || extractedDocs >= 5;
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

  // Emission category coverage
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

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
  const maxPossibleScore = factors.reduce((sum, f) => sum + f.maxScore, 0);
  const overallPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  return {
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
  };
}
