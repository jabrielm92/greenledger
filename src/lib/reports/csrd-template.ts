import type { ReportTemplate } from "@/types";

/**
 * CSRD / ESRS Report Template
 * Covers the core disclosure requirements for SMEs under the
 * EU Corporate Sustainability Reporting Directive.
 */
export const CSRD_TEMPLATE: ReportTemplate = {
  id: "CSRD_2024",
  name: "CSRD / ESRS Report",
  sections: [
    {
      code: "ESRS2",
      title: "General Disclosures",
      required: true,
      subsections: [
        {
          code: "ESRS2-BP1",
          title: "Basis for Preparation",
          required: true,
        },
        {
          code: "ESRS2-GOV1",
          title: "Governance — Role of Administrative Bodies",
          required: true,
        },
        {
          code: "ESRS2-SBM1",
          title: "Strategy — Market Position & Business Model",
          required: true,
        },
        {
          code: "ESRS2-IRO1",
          title: "Impact, Risk & Opportunity Identification",
          required: true,
        },
      ],
    },
    {
      code: "E1",
      title: "Climate Change",
      required: true,
      subsections: [
        {
          code: "E1-1",
          title: "Transition Plan for Climate Change Mitigation",
          required: true,
        },
        {
          code: "E1-4",
          title: "Targets Related to Climate Change",
          required: true,
        },
        {
          code: "E1-5",
          title: "Energy Consumption & Mix",
          required: true,
        },
        {
          code: "E1-6",
          title: "Gross Scope 1, 2, 3 GHG Emissions",
          required: true,
        },
        {
          code: "E1-7",
          title: "GHG Removals & Carbon Credits",
          required: false,
        },
        {
          code: "E1-9",
          title: "Anticipated Financial Effects of Climate Change",
          required: false,
        },
      ],
    },
    {
      code: "S1",
      title: "Own Workforce",
      required: true,
      subsections: [
        {
          code: "S1-1",
          title: "Policies Related to Own Workforce",
          required: true,
        },
        {
          code: "S1-6",
          title: "Characteristics of Employees",
          required: true,
        },
        {
          code: "S1-9",
          title: "Diversity Metrics",
          required: false,
        },
      ],
    },
    {
      code: "G1",
      title: "Business Conduct",
      required: true,
      subsections: [
        {
          code: "G1-1",
          title: "Corporate Culture & Business Conduct Policies",
          required: true,
        },
        {
          code: "G1-3",
          title: "Prevention & Detection of Corruption/Bribery",
          required: true,
        },
      ],
    },
  ],
};

/**
 * Get all section codes (including subsections) from the template.
 */
export function getAllSectionCodes(template: ReportTemplate): string[] {
  const codes: string[] = [];
  for (const section of template.sections) {
    codes.push(section.code);
    if (section.subsections) {
      for (const sub of section.subsections) {
        codes.push(sub.code);
      }
    }
  }
  return codes;
}

/**
 * Get required section codes only.
 */
export function getRequiredSectionCodes(template: ReportTemplate): string[] {
  const codes: string[] = [];
  for (const section of template.sections) {
    if (section.subsections) {
      for (const sub of section.subsections) {
        if (sub.required) codes.push(sub.code);
      }
    } else if (section.required) {
      codes.push(section.code);
    }
  }
  return codes;
}

/**
 * Look up a section definition by its code.
 */
export function getSectionByCode(
  template: ReportTemplate,
  code: string
): { code: string; title: string; required: boolean; parent?: string } | null {
  for (const section of template.sections) {
    if (section.code === code) {
      return { code: section.code, title: section.title, required: section.required };
    }
    if (section.subsections) {
      for (const sub of section.subsections) {
        if (sub.code === code) {
          return {
            code: sub.code,
            title: sub.title,
            required: sub.required,
            parent: section.code,
          };
        }
      }
    }
  }
  return null;
}
