import type { CalculationInput } from "@/types";

/**
 * Maps AI-extracted document data into a CalculationInput + metadata
 * that can be fed directly into the emissions calculator.
 */

export interface EmissionDraft {
  scope: "SCOPE_1" | "SCOPE_2" | "SCOPE_3";
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
    case "TRAVEL_RECORD":
      return mapTravelRecord(extractedData, region);
    case "WASTE_MANIFEST":
      return mapWasteManifest(extractedData, region);
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

function mapTravelRecord(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  const distance = data.distance as
    | { value: number; unit: string }
    | null
    | undefined;
  if (!distance?.value || !distance?.unit) return null;

  const travelType = (data.travelType as string) || "domestic";
  const description = (data.description as string) || "Business travel";
  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const year = new Date(date).getFullYear() || new Date().getFullYear();

  return {
    scope: "SCOPE_3",
    category: "air_travel",
    subcategory: travelType,
    source: description,
    description: `Business air travel — ${travelType}`,
    activityValue: distance.value,
    activityUnit: distance.unit,
    startDate: date,
    endDate: date,
    calculationInput: {
      activityValue: distance.value,
      activityUnit: distance.unit,
      category: "air_travel",
      subcategory: travelType,
      region,
      year,
    },
  };
}

function mapWasteManifest(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  const weight = data.weight as
    | { value: number; unit: string }
    | null
    | undefined;
  if (!weight?.value || !weight?.unit) return null;

  const wasteType = (data.wasteType as string) || "landfill_general";
  const handler = (data.handler as string) || "Unknown waste handler";
  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const year = new Date(date).getFullYear() || new Date().getFullYear();

  return {
    scope: "SCOPE_3",
    category: "waste",
    subcategory: wasteType,
    source: handler,
    description: `Waste disposal (${wasteType}) by ${handler}`,
    activityValue: weight.value,
    activityUnit: weight.unit,
    startDate: date,
    endDate: date,
    calculationInput: {
      activityValue: weight.value,
      activityUnit: weight.unit,
      category: "waste",
      subcategory: wasteType,
      region,
      year,
    },
  };
}

function mapUtilityTypeToCategory(utilityType: string): {
  scope: "SCOPE_1" | "SCOPE_2" | "SCOPE_3";
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
      return { scope: "SCOPE_3", category: "water" };
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
