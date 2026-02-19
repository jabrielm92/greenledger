export interface ExtractedUtilityBill {
  provider: string | null;
  accountNumber: string | null;
  billingPeriod: {
    start: string;
    end: string;
  } | null;
  utilityType: "electricity" | "natural_gas" | "water" | "district_heating" | null;
  consumption: {
    value: number;
    unit: string;
  } | null;
  cost: {
    value: number;
    currency: string;
  } | null;
  facilityAddress: string | null;
  meterNumber: string | null;
  rateType: string | null;
  renewablePercentage: number | null;
  confidence: number;
  extractionNotes: string | null;
}

export interface ExtractedFuelReceipt {
  fuelType: "diesel" | "gasoline" | "lpg" | "cng" | null;
  quantity: { value: number; unit: string } | null;
  cost: { value: number; currency: string } | null;
  vendor: string | null;
  vehicleId: string | null;
  date: string | null;
  location: string | null;
  confidence: number;
  extractionNotes: string | null;
}

export interface ExtractedInvoice {
  vendor: string | null;
  invoiceNumber: string | null;
  date: string | null;
  lineItems: Array<{
    description: string;
    quantity: number;
    unit: string;
    amount: number;
  }>;
  total: { value: number; currency: string } | null;
  category: string | null;
  confidence: number;
  extractionNotes: string | null;
}

export interface DocumentClassification {
  documentType: string;
  confidence: number;
  reasoning: string;
}

export type ExtractedData = ExtractedUtilityBill | ExtractedFuelReceipt | ExtractedInvoice;
