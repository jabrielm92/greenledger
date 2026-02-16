export interface CalculationInput {
  activityValue: number;
  activityUnit: string;
  category: string;
  subcategory?: string;
  region: string;
  year: number;
  customFactorId?: string;
}

export interface CalculationResult {
  co2e: number;
  co2: number;
  ch4: number;
  n2o: number;
  emissionFactor: number;
  emissionFactorSource: string;
  calculationMethod: string;
  methodology: string;
}

export interface EmissionsSummary {
  totalScope1: number;
  totalScope2: number;
  totalScope3: number;
  totalEmissions: number;
  byCategory: CategoryBreakdown[];
  byMonth: MonthlyEmission[];
  periodStart: Date;
  periodEnd: Date;
}

export interface CategoryBreakdown {
  category: string;
  scope: "SCOPE_1" | "SCOPE_2" | "SCOPE_3";
  totalCo2e: number;
  percentage: number;
  entryCount: number;
}

export interface MonthlyEmission {
  month: string; // "2025-01"
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface EmissionFactorLookup {
  id: string;
  category: string;
  subcategory?: string;
  region: string;
  unit: string;
  co2ePerUnit: number;
  source: string;
  year: number;
}
