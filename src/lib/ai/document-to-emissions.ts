import type { CalculationInput } from "@/types";

/**
 * Maps AI-extracted document data into a CalculationInput + metadata
 * that can be fed directly into the emissions calculator.
 */

export interface EmissionDraft {
  scope: "SCOPE_1" | "SCOPE_2";
  category: string;
  subcategory?: string;
  source: string;
  description: string;
  activityValue: number;
  activityUnit: string;
  startDate: string;
  endDate: string;
  location?: string;
  calculationInput: CalculationInput;
}

/**
 * Convert extracted document data into a draft emission entry.
 * Returns null if the document type is not mappable to emissions.
 */
export function mapExtractedDataToEmission(
  documentType: string,
  extractedData: Record<string, unknown>,
  region: string = "GLOBAL"
): EmissionDraft | null {
  switch (documentType) {
    case "UTILITY_BILL":
      return mapUtilityBill(extractedData, region);
    case "FUEL_RECEIPT":
      return mapFuelReceipt(extractedData, region);
    default:
      return null;
  }
}

function mapUtilityBill(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  const consumption = data.consumption as
    | { value: number; unit: string }
    | null
    | undefined;
  if (!consumption?.value || !consumption?.unit) return null;

  const utilityType = (data.utilityType as string) || "electricity";
  const provider = (data.provider as string) || "Unknown provider";

  const billingPeriod = data.billingPeriod as
    | { start: string; end: string }
    | null
    | undefined;
  const now = new Date().toISOString().split("T")[0];
  const startDate = billingPeriod?.start || now;
  const endDate = billingPeriod?.end || now;

  // Map utility type to emissions category and scope
  const { scope, category } = mapUtilityTypeToCategory(utilityType);

  const year = new Date(endDate).getFullYear() || new Date().getFullYear();

  return {
    scope,
    category,
    source: provider,
    description: `${formatUtilityType(utilityType)} consumption from ${provider}`,
    activityValue: consumption.value,
    activityUnit: consumption.unit,
    startDate,
    endDate,
    location: (data.facilityAddress as string) || undefined,
    calculationInput: {
      activityValue: consumption.value,
      activityUnit: consumption.unit,
      category,
      region,
      year,
    },
  };
}

function mapFuelReceipt(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  const quantity = data.quantity as
    | { value: number; unit: string }
    | null
    | undefined;
  if (!quantity?.value || !quantity?.unit) return null;

  const fuelType = (data.fuelType as string) || "diesel";
  const vendor = (data.vendor as string) || "Unknown vendor";
  const date = (data.date as string) || new Date().toISOString().split("T")[0];

  const year = new Date(date).getFullYear() || new Date().getFullYear();

  return {
    scope: "SCOPE_1",
    category: fuelType,
    source: vendor,
    description: `${formatFuelType(fuelType)} purchase from ${vendor}`,
    activityValue: quantity.value,
    activityUnit: quantity.unit,
    startDate: date,
    endDate: date,
    location: (data.location as string) || undefined,
    calculationInput: {
      activityValue: quantity.value,
      activityUnit: quantity.unit,
      category: fuelType,
      region,
      year,
    },
  };
}

function mapUtilityTypeToCategory(utilityType: string): {
  scope: "SCOPE_1" | "SCOPE_2";
  category: string;
} {
  switch (utilityType) {
    case "natural_gas":
      return { scope: "SCOPE_1", category: "natural_gas" };
    case "electricity":
      return { scope: "SCOPE_2", category: "electricity" };
    case "district_heating":
      return { scope: "SCOPE_2", category: "district_heating" };
    case "water":
      return { scope: "SCOPE_2", category: "water" };
    default:
      return { scope: "SCOPE_2", category: "electricity" };
  }
}

function formatUtilityType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatFuelType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
