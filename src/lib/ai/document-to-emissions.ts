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
    case "INVOICE":
      return mapInvoice(extractedData, region);
    case "SUPPLIER_REPORT":
      return mapSupplierReport(extractedData, region);
    case "FLEET_LOG":
      return mapFleetLog(extractedData, region);
    case "REFRIGERANT_LOG":
      return mapRefrigerantLog(extractedData, region);
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

function mapInvoice(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  // Invoices may contain fuel, utility, or purchased-goods data
  const total = data.total as { value: number; currency: string } | null | undefined;
  const category = (data.category as string) || "purchased_goods";
  const vendor = (data.vendor as string) || "Unknown vendor";
  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const year = new Date(date).getFullYear() || new Date().getFullYear();

  // Try line items for activity data first
  const lineItems = data.lineItems as Array<{ description: string; quantity: number; unit: string; amount: number }> | undefined;
  let activityValue = 0;
  let activityUnit = "units";

  if (lineItems && lineItems.length > 0) {
    activityValue = lineItems.reduce((sum, li) => sum + (li.quantity || 0), 0);
    activityUnit = lineItems[0].unit || "units";
  } else if (total?.value) {
    // Use spend-based estimation
    activityValue = total.value;
    activityUnit = total.currency || "USD";
  }

  if (!activityValue) return null;

  // Map common invoice categories to scopes
  const lcCategory = category.toLowerCase();
  const isFuel = /fuel|gas|diesel|petrol|gasoline/.test(lcCategory);
  const isUtility = /electric|utility|energy|power|heating/.test(lcCategory);
  const scope = isFuel ? "SCOPE_1" as const : isUtility ? "SCOPE_2" as const : "SCOPE_3" as const;
  const emissionCategory = isFuel ? "fuel_combustion" : isUtility ? "electricity" : "purchased_goods";

  return {
    scope,
    category: emissionCategory,
    subcategory: category,
    source: vendor,
    description: `Invoice from ${vendor} — ${category}`,
    activityValue,
    activityUnit,
    startDate: date,
    endDate: date,
    calculationInput: {
      activityValue,
      activityUnit,
      category: emissionCategory,
      subcategory: category,
      region,
      year,
    },
  };
}

function mapSupplierReport(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  // Supplier ESG reports often include total emissions or energy data
  const relevantData = data.relevantData as Array<{
    field: string; value: string | number; unit: string | null; category: string;
  }> | undefined;

  if (!relevantData || relevantData.length === 0) {
    // Try direct emissions fields
    const totalEmissions = data.totalEmissions as number | undefined;
    if (totalEmissions) {
      const supplier = (data.vendor as string) || (data.supplierName as string) || "Unknown supplier";
      const date = (data.date as string) || new Date().toISOString().split("T")[0];
      return {
        scope: "SCOPE_3",
        category: "purchased_goods",
        subcategory: "supplier_emissions",
        source: supplier,
        description: `Supplier emissions report from ${supplier}`,
        activityValue: totalEmissions,
        activityUnit: "tCO2e",
        startDate: date,
        endDate: date,
        calculationInput: {
          activityValue: totalEmissions,
          activityUnit: "tCO2e",
          category: "purchased_goods",
          subcategory: "supplier_emissions",
          region,
          year: new Date(date).getFullYear() || new Date().getFullYear(),
        },
      };
    }
    return null;
  }

  // Find the most relevant emission data point
  const emissionEntry = relevantData.find(
    (d) => d.category === "emissions" || /co2|emission|ghg/i.test(d.field)
  ) || relevantData.find((d) => d.category === "energy") || relevantData[0];

  const value = typeof emissionEntry.value === "number"
    ? emissionEntry.value
    : parseFloat(String(emissionEntry.value));
  if (isNaN(value) || value === 0) return null;

  const supplier = (data.vendor as string) || (data.supplierName as string) || "Unknown supplier";
  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const year = new Date(date).getFullYear() || new Date().getFullYear();

  return {
    scope: "SCOPE_3",
    category: "purchased_goods",
    subcategory: emissionEntry.category || "supplier_emissions",
    source: supplier,
    description: `${emissionEntry.field} from ${supplier} report`,
    activityValue: value,
    activityUnit: emissionEntry.unit || "tCO2e",
    startDate: date,
    endDate: date,
    calculationInput: {
      activityValue: value,
      activityUnit: emissionEntry.unit || "tCO2e",
      category: "purchased_goods",
      subcategory: emissionEntry.category || "supplier_emissions",
      region,
      year,
    },
  };
}

function mapFleetLog(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  // Fleet logs contain distance driven or fuel consumed by vehicles
  const distance = data.distance as { value: number; unit: string } | null | undefined;
  const fuelConsumed = data.fuelConsumed as { value: number; unit: string } | null | undefined;
  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const year = new Date(date).getFullYear() || new Date().getFullYear();
  const vehicleId = (data.vehicleId as string) || "Fleet vehicle";
  const fuelType = (data.fuelType as string) || "diesel";

  if (fuelConsumed?.value) {
    return {
      scope: "SCOPE_1",
      category: fuelType,
      subcategory: "fleet",
      source: vehicleId,
      description: `Fleet fuel consumption — ${vehicleId}`,
      activityValue: fuelConsumed.value,
      activityUnit: fuelConsumed.unit || "liters",
      startDate: date,
      endDate: date,
      calculationInput: {
        activityValue: fuelConsumed.value,
        activityUnit: fuelConsumed.unit || "liters",
        category: fuelType,
        subcategory: "fleet",
        region,
        year,
      },
    };
  }

  if (distance?.value) {
    return {
      scope: "SCOPE_1",
      category: fuelType,
      subcategory: "fleet",
      source: vehicleId,
      description: `Fleet distance — ${vehicleId}`,
      activityValue: distance.value,
      activityUnit: distance.unit || "km",
      startDate: date,
      endDate: date,
      calculationInput: {
        activityValue: distance.value,
        activityUnit: distance.unit || "km",
        category: fuelType,
        subcategory: "fleet",
        region,
        year,
      },
    };
  }

  return null;
}

function mapRefrigerantLog(
  data: Record<string, unknown>,
  region: string
): EmissionDraft | null {
  const quantity = data.quantity as { value: number; unit: string } | null | undefined;
  if (!quantity?.value) return null;

  const refrigerantType = (data.refrigerantType as string) || "R-410A";
  const equipmentId = (data.equipmentId as string) || "HVAC system";
  const date = (data.date as string) || new Date().toISOString().split("T")[0];
  const year = new Date(date).getFullYear() || new Date().getFullYear();

  return {
    scope: "SCOPE_1",
    category: "refrigerants",
    subcategory: refrigerantType,
    source: equipmentId,
    description: `Refrigerant ${refrigerantType} recharge — ${equipmentId}`,
    activityValue: quantity.value,
    activityUnit: quantity.unit || "kg",
    startDate: date,
    endDate: date,
    calculationInput: {
      activityValue: quantity.value,
      activityUnit: quantity.unit || "kg",
      category: "refrigerants",
      subcategory: refrigerantType,
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
