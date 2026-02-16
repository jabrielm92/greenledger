import { anthropic, AI_MODEL } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { CSRD_TEMPLATE, getSectionByCode } from "@/lib/reports/csrd-template";
import { GRI_TEMPLATE } from "@/lib/reports/gri-template";
import type { GeneratedSection, ReportTemplate } from "@/types";

interface ReportGenerationInput {
  organizationId: string;
  reportingPeriodId: string;
  frameworkType: string;
  sections: string[];
}

function getTemplate(frameworkType: string): ReportTemplate {
  switch (frameworkType) {
    case "CSRD":
      return CSRD_TEMPLATE;
    case "GRI":
      return GRI_TEMPLATE;
    default:
      return CSRD_TEMPLATE;
  }
}

export async function generateReport(
  input: ReportGenerationInput
): Promise<Record<string, GeneratedSection>> {
  // 1. Fetch organization context
  const org = await prisma.organization.findUnique({
    where: { id: input.organizationId },
  });
  if (!org) throw new Error("Organization not found");

  // 2. Fetch emissions data
  const emissions = await prisma.emissionEntry.findMany({
    where: {
      organizationId: input.organizationId,
      reportingPeriodId: input.reportingPeriodId,
    },
  });

  // 3. Aggregate emissions
  const emissionsSummary = aggregateEmissions(emissions);

  // 4. Fetch supplier data
  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: input.organizationId },
  });

  const supplierSummary = {
    totalSuppliers: suppliers.length,
    byRiskLevel: suppliers.reduce(
      (acc, s) => {
        acc[s.esgRiskLevel] = (acc[s.esgRiskLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    assessed: suppliers.filter((s) => s.lastAssessment).length,
    unassessed: suppliers.filter((s) => !s.lastAssessment).length,
  };

  // 5. Generate each section
  const template = getTemplate(input.frameworkType);
  const generatedSections: Record<string, GeneratedSection> = {};

  for (const sectionCode of input.sections) {
    const sectionInfo = getSectionByCode(template, sectionCode);
    if (!sectionInfo) continue;

    const sectionData = buildSectionData(
      sectionCode,
      emissionsSummary,
      supplierSummary
    );

    const prompt = buildReportSectionPrompt(
      sectionCode,
      sectionInfo.title,
      {
        name: org.name,
        industry: org.industry || "Unknown",
        employeeCount: org.employeeCount || 0,
        country: org.country || "Unknown",
        reportingYear: new Date().getFullYear() - 1,
      },
      sectionData
    );

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    try {
      const parsed = JSON.parse(
        text.replace(/```json|```/g, "").trim()
      );
      generatedSections[sectionCode] = {
        code: sectionCode,
        title: sectionInfo.title,
        content: parsed.content || "",
        dataPointsUsed: parsed.dataPointsCovered || [],
        confidence: parsed.confidence || 0,
        methodology: `AI-generated using ${input.frameworkType} template with available emissions and organizational data`,
      };
    } catch {
      // Fallback if response isn't valid JSON
      generatedSections[sectionCode] = {
        code: sectionCode,
        title: sectionInfo.title,
        content: text,
        dataPointsUsed: [],
        confidence: 0.5,
        methodology: "AI-generated (raw text response)",
      };
    }
  }

  return generatedSections;
}

interface EmissionsSummaryAgg {
  scope1Total: number;
  scope2Total: number;
  totalEmissions: number;
  byCategory: Record<string, number>;
  entryCount: number;
}

function aggregateEmissions(
  emissions: { scope: string; category: string; co2e: number }[]
): EmissionsSummaryAgg {
  let scope1Total = 0;
  let scope2Total = 0;
  const byCategory: Record<string, number> = {};

  for (const e of emissions) {
    if (e.scope === "SCOPE_1") scope1Total += e.co2e;
    if (e.scope === "SCOPE_2") scope2Total += e.co2e;
    byCategory[e.category] = (byCategory[e.category] || 0) + e.co2e;
  }

  return {
    scope1Total,
    scope2Total,
    totalEmissions: scope1Total + scope2Total,
    byCategory,
    entryCount: emissions.length,
  };
}

function buildSectionData(
  sectionCode: string,
  emissions: EmissionsSummaryAgg,
  suppliers: { totalSuppliers: number; byRiskLevel: Record<string, number>; assessed: number; unassessed: number }
): Record<string, unknown> {
  // Climate-related sections get emissions data
  if (sectionCode.startsWith("E1") || sectionCode.startsWith("GRI-305") || sectionCode.startsWith("GRI-302")) {
    return {
      scope1Emissions: emissions.scope1Total,
      scope2Emissions: emissions.scope2Total,
      totalEmissions: emissions.totalEmissions,
      emissionsByCategory: emissions.byCategory,
      dataEntryCount: emissions.entryCount,
      unit: "kgCO2e",
    };
  }

  // Supplier-related sections
  if (sectionCode.startsWith("GRI-308") || sectionCode === "ESRS2-IRO1") {
    return {
      ...suppliers,
      emissions: {
        total: emissions.totalEmissions,
        unit: "kgCO2e",
      },
    };
  }

  // General sections get high-level overview
  return {
    totalEmissions: emissions.totalEmissions,
    totalSuppliers: suppliers.totalSuppliers,
  };
}

export function buildReportSectionPrompt(
  sectionCode: string,
  sectionTitle: string,
  orgContext: {
    name: string;
    industry: string;
    employeeCount: number;
    country: string;
    reportingYear: number;
  },
  sectionData: Record<string, unknown>
): string {
  return `You are an expert sustainability report writer helping a small-to-medium business comply with the EU Corporate Sustainability Reporting Directive (CSRD) under the European Sustainability Reporting Standards (ESRS).

COMPANY CONTEXT:
- Company: ${orgContext.name}
- Industry: ${orgContext.industry}
- Employees: ${orgContext.employeeCount}
- Location: ${orgContext.country}
- Reporting Year: ${orgContext.reportingYear}

SECTION TO GENERATE:
- Code: ${sectionCode}
- Title: ${sectionTitle}

AVAILABLE DATA:
${JSON.stringify(sectionData, null, 2)}

INSTRUCTIONS:
1. Write a professional, audit-ready narrative section for this ESRS disclosure requirement.
2. Use the provided data to support all claims with specific numbers.
3. Where data is missing, note it as a disclosure gap and suggest what data is needed.
4. Write in third person referring to the company by name.
5. Use clear, professional language appropriate for a regulatory filing.
6. Include relevant metrics, percentages, and year-over-year comparisons where data allows.
7. Structure the section with appropriate subheadings if the content warrants it.
8. Keep the tone factual and balanced — do not overstate achievements.
9. Reference specific ESRS data point codes where applicable (e.g., "As required by E1-6...").

RESPONSE FORMAT:
Respond with ONLY a valid JSON object:
{
  "sectionCode": "${sectionCode}",
  "sectionTitle": "${sectionTitle}",
  "content": "The full narrative text in Markdown format",
  "dataPointsCovered": ["E1-6-a", "E1-6-b"],
  "dataGaps": ["List of missing data points with descriptions"],
  "recommendations": ["Suggestions for improving this section"],
  "confidence": 0.0
}`;
}
