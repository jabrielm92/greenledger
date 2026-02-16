export interface ReportSection {
  code: string;
  title: string;
  content: string;
  isAIGenerated: boolean;
  isEdited: boolean;
  dataPoints: ReportDataPointValue[];
  status: "complete" | "partial" | "empty";
}

export interface ReportDataPointValue {
  code: string;
  label: string;
  value: string | number | null;
  source: "auto-calculated" | "manual" | "ai-estimated";
  isComplete: boolean;
}

export interface GeneratedSection {
  code: string;
  title: string;
  content: string;
  dataPointsUsed: string[];
  confidence: number;
  methodology: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  sections: TemplateSectionDef[];
}

export interface TemplateSectionDef {
  code: string;
  title: string;
  required: boolean;
  subsections?: TemplateSectionDef[];
}

export interface OrganizationContext {
  name: string;
  industry: string;
  country: string;
  employeeCount: number;
  reportingPeriod: string;
  frameworks: string[];
}

export interface SupplierSummary {
  totalSuppliers: number;
  byRiskLevel: Record<string, number>;
  assessed: number;
  unassessed: number;
}
