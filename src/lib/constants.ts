// ============================================
// PLAN LIMITS
// ============================================

export const PLAN_LIMITS = {
  FREE_TRIAL: {
    maxDocuments: 25,
    maxEmissionEntries: 100,
    maxReports: 3,
    maxSuppliers: 10,
    maxTeamMembers: 2,
    maxStorageMB: 100,
    aiExtractionsPerMonth: 25,
    reportGenerationsPerMonth: 3,
    trialDays: 14,
  },
  BASE: {
    maxDocuments: 250,
    maxEmissionEntries: 1000,
    maxReports: 12,
    maxSuppliers: 50,
    maxTeamMembers: 5,
    maxStorageMB: 1000,
    aiExtractionsPerMonth: 100,
    reportGenerationsPerMonth: 12,
    trialDays: 0,
  },
  PROFESSIONAL: {
    maxDocuments: 2500,
    maxEmissionEntries: 10000,
    maxReports: -1, // unlimited
    maxSuppliers: 250,
    maxTeamMembers: 20,
    maxStorageMB: 10000,
    aiExtractionsPerMonth: 500,
    reportGenerationsPerMonth: -1,
    trialDays: 0,
  },
  ENTERPRISE: {
    maxDocuments: -1,
    maxEmissionEntries: -1,
    maxReports: -1,
    maxSuppliers: -1,
    maxTeamMembers: -1,
    maxStorageMB: -1,
    aiExtractionsPerMonth: -1,
    reportGenerationsPerMonth: -1,
    trialDays: 0,
  },
} as const;

// ============================================
// INDUSTRIES
// ============================================

export const INDUSTRIES = [
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "LOGISTICS", label: "Logistics & Transportation" },
  { value: "PROFESSIONAL_SERVICES", label: "Professional Services" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "RETAIL", label: "Retail" },
  { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "ENERGY", label: "Energy" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "OTHER", label: "Other" },
] as const;

// ============================================
// EMPLOYEE COUNT RANGES
// ============================================

export const EMPLOYEE_COUNTS = [
  { value: "1-50", label: "1–50 employees", midpoint: 25 },
  { value: "51-100", label: "51–100 employees", midpoint: 75 },
  { value: "101-250", label: "101–250 employees", midpoint: 175 },
  { value: "251-500", label: "251–500 employees", midpoint: 375 },
  { value: "500+", label: "500+ employees", midpoint: 750 },
] as const;

// ============================================
// COUNTRIES
// ============================================

export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "PT", label: "Portugal" },
  { value: "AT", label: "Austria" },
  { value: "CH", label: "Switzerland" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "IE", label: "Ireland" },
  { value: "PL", label: "Poland" },
  { value: "CZ", label: "Czech Republic" },
  { value: "AU", label: "Australia" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "IN", label: "India" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "ZA", label: "South Africa" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "KR", label: "South Korea" },
  { value: "HK", label: "Hong Kong" },
  { value: "NZ", label: "New Zealand" },
] as const;

export const EU_COUNTRIES = [
  "DE", "FR", "NL", "BE", "IT", "ES", "PT", "AT", "SE", "DK",
  "FI", "IE", "PL", "CZ",
] as const;

// ============================================
// MONTHS
// ============================================

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

// ============================================
// EMISSION CATEGORIES
// ============================================

export const SCOPE_1_CATEGORIES = [
  { value: "stationary_combustion", label: "Stationary Combustion", units: ["therms", "m3", "kWh", "liters", "gallons"] },
  { value: "mobile_combustion", label: "Mobile Combustion", units: ["liters", "gallons", "km", "miles"] },
  { value: "fugitive_emissions", label: "Fugitive Emissions", units: ["kg"] },
  { value: "process_emissions", label: "Process Emissions", units: ["tonnes", "units"] },
] as const;

export const SCOPE_2_CATEGORIES = [
  { value: "purchased_electricity", label: "Purchased Electricity", units: ["kWh", "MWh"] },
  { value: "purchased_heat", label: "Purchased Heat/Steam", units: ["kWh", "MWh", "GJ"] },
  { value: "purchased_cooling", label: "Purchased Cooling", units: ["kWh", "MWh"] },
] as const;

// ============================================
// DOCUMENT TYPES
// ============================================

export const DOCUMENT_TYPES = [
  { value: "UTILITY_BILL", label: "Utility Bill" },
  { value: "FUEL_RECEIPT", label: "Fuel Receipt" },
  { value: "INVOICE", label: "Invoice" },
  { value: "SUPPLIER_REPORT", label: "Supplier Report" },
  { value: "TRAVEL_RECORD", label: "Travel Record" },
  { value: "WASTE_MANIFEST", label: "Waste Manifest" },
  { value: "FLEET_LOG", label: "Fleet Log" },
  { value: "REFRIGERANT_LOG", label: "Refrigerant Log" },
  { value: "OTHER", label: "Other" },
] as const;

// ============================================
// FILE UPLOAD
// ============================================

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
} as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

// ============================================
// COMPLIANCE FRAMEWORKS
// ============================================

export const FRAMEWORKS = [
  {
    id: "CSRD",
    name: "CSRD / ESRS",
    description: "EU Corporate Sustainability Reporting Directive",
    regions: ["EU"],
    recommended: (country: string) => EU_COUNTRIES.includes(country as typeof EU_COUNTRIES[number]),
  },
  {
    id: "ISSB_S1",
    name: "ISSB S1",
    description: "IFRS Sustainability Disclosure Standard S1 (General)",
    regions: ["GLOBAL"],
    recommended: (country: string) => ["CA", "GB", "JP", "SG"].includes(country),
  },
  {
    id: "ISSB_S2",
    name: "ISSB S2",
    description: "IFRS Sustainability Disclosure Standard S2 (Climate)",
    regions: ["GLOBAL"],
    recommended: (country: string) => ["CA", "GB", "JP", "SG"].includes(country),
  },
  {
    id: "SB253",
    name: "California SB-253",
    description: "Climate Corporate Data Accountability Act",
    regions: ["US-CA"],
    recommended: (country: string) => country === "US",
  },
  {
    id: "GRI",
    name: "GRI Standards",
    description: "Global Reporting Initiative (voluntary)",
    regions: ["GLOBAL"],
    recommended: () => false,
  },
  {
    id: "SASB",
    name: "SASB Standards",
    description: "Sustainability Accounting Standards Board (voluntary)",
    regions: ["GLOBAL"],
    recommended: () => false,
  },
] as const;

// ============================================
// RISK LEVELS
// ============================================

export const RISK_LEVELS = [
  { value: "LOW", label: "Low", color: "text-green-600" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
  { value: "HIGH", label: "High", color: "text-orange-600" },
  { value: "CRITICAL", label: "Critical", color: "text-red-600" },
  { value: "UNKNOWN", label: "Unknown", color: "text-gray-400" },
] as const;

// ============================================
// APP CONFIG
// ============================================

export const APP_NAME = "GreenLedger";
export const APP_DESCRIPTION = "ESG compliance on autopilot.";
export const SUPPORT_EMAIL = "support@greenledger.app";
export const ITEMS_PER_PAGE = 20;
