import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedEmissionFactors() {
  console.log("Seeding emission factors...");

  const factors = [
    // ============================================
    // ELECTRICITY GRID FACTORS (Scope 2)
    // ============================================
    { category: "electricity", subcategory: "grid", region: "US", unit: "kgCO2e/kWh", co2ePerUnit: 0.417, co2PerUnit: 0.390, ch4PerUnit: 0.012, n2oPerUnit: 0.015, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-CA", unit: "kgCO2e/kWh", co2ePerUnit: 0.225, co2PerUnit: 0.210, ch4PerUnit: 0.007, n2oPerUnit: 0.008, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-TX", unit: "kgCO2e/kWh", co2ePerUnit: 0.396, co2PerUnit: 0.370, ch4PerUnit: 0.012, n2oPerUnit: 0.014, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-NY", unit: "kgCO2e/kWh", co2ePerUnit: 0.228, co2PerUnit: 0.213, ch4PerUnit: 0.007, n2oPerUnit: 0.008, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-FL", unit: "kgCO2e/kWh", co2ePerUnit: 0.415, co2PerUnit: 0.388, ch4PerUnit: 0.012, n2oPerUnit: 0.015, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "EU", unit: "kgCO2e/kWh", co2ePerUnit: 0.256, co2PerUnit: 0.240, ch4PerUnit: 0.008, n2oPerUnit: 0.008, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "GB", unit: "kgCO2e/kWh", co2ePerUnit: 0.207, co2PerUnit: 0.193, ch4PerUnit: 0.006, n2oPerUnit: 0.008, source: "DEFRA", year: 2025 },
    { category: "electricity", subcategory: "grid", region: "DE", unit: "kgCO2e/kWh", co2ePerUnit: 0.366, co2PerUnit: 0.343, ch4PerUnit: 0.011, n2oPerUnit: 0.012, source: "UBA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "FR", unit: "kgCO2e/kWh", co2ePerUnit: 0.052, co2PerUnit: 0.049, ch4PerUnit: 0.001, n2oPerUnit: 0.002, source: "ADEME", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "CA", unit: "kgCO2e/kWh", co2ePerUnit: 0.120, co2PerUnit: 0.112, ch4PerUnit: 0.004, n2oPerUnit: 0.004, source: "ECCC", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "NL", unit: "kgCO2e/kWh", co2ePerUnit: 0.328, co2PerUnit: 0.307, ch4PerUnit: 0.010, n2oPerUnit: 0.011, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "ES", unit: "kgCO2e/kWh", co2ePerUnit: 0.149, co2PerUnit: 0.139, ch4PerUnit: 0.005, n2oPerUnit: 0.005, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "IT", unit: "kgCO2e/kWh", co2ePerUnit: 0.257, co2PerUnit: 0.241, ch4PerUnit: 0.008, n2oPerUnit: 0.008, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "SE", unit: "kgCO2e/kWh", co2ePerUnit: 0.013, co2PerUnit: 0.012, ch4PerUnit: 0.000, n2oPerUnit: 0.001, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "AU", unit: "kgCO2e/kWh", co2ePerUnit: 0.680, co2PerUnit: 0.636, ch4PerUnit: 0.020, n2oPerUnit: 0.024, source: "DEE", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "JP", unit: "kgCO2e/kWh", co2ePerUnit: 0.457, co2PerUnit: 0.428, ch4PerUnit: 0.013, n2oPerUnit: 0.016, source: "MOE", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "IN", unit: "kgCO2e/kWh", co2ePerUnit: 0.708, co2PerUnit: 0.663, ch4PerUnit: 0.021, n2oPerUnit: 0.024, source: "CEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.494, co2PerUnit: 0.462, ch4PerUnit: 0.015, n2oPerUnit: 0.017, source: "IEA", year: 2024 },

    // ============================================
    // NATURAL GAS (Scope 1 - Stationary Combustion)
    // ============================================
    { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/therm", co2ePerUnit: 5.31, co2PerUnit: 5.28, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "EPA", year: 2024 },
    { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 2.02, co2PerUnit: 2.00, ch4PerUnit: 0.004, n2oPerUnit: 0.016, source: "EPA", year: 2024 },
    { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.184, co2PerUnit: 0.183, ch4PerUnit: 0.0004, n2oPerUnit: 0.0006, source: "DEFRA", year: 2025 },
    { category: "natural_gas", subcategory: "combustion", region: "US", unit: "kgCO2e/MCF", co2ePerUnit: 53.06, co2PerUnit: 52.91, ch4PerUnit: 0.05, n2oPerUnit: 0.10, source: "EPA", year: 2024 },

    // ============================================
    // DIESEL (Scope 1)
    // ============================================
    { category: "diesel", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.68, co2PerUnit: 2.65, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
    { category: "diesel", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 10.15, co2PerUnit: 10.04, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },
    { category: "diesel", subcategory: "combustion", region: "US", unit: "kgCO2e/gallon", co2ePerUnit: 10.21, co2PerUnit: 10.10, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },

    // ============================================
    // GASOLINE / PETROL (Scope 1)
    // ============================================
    { category: "gasoline", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.31, co2PerUnit: 2.29, ch4PerUnit: 0.008, n2oPerUnit: 0.012, source: "DEFRA", year: 2025 },
    { category: "gasoline", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 8.78, co2PerUnit: 8.70, ch4PerUnit: 0.03, n2oPerUnit: 0.05, source: "EPA", year: 2024 },
    { category: "gasoline", subcategory: "combustion", region: "US", unit: "kgCO2e/gallon", co2ePerUnit: 8.78, co2PerUnit: 8.70, ch4PerUnit: 0.03, n2oPerUnit: 0.05, source: "EPA", year: 2024 },

    // ============================================
    // LPG / PROPANE (Scope 1)
    // ============================================
    { category: "lpg", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 1.56, co2PerUnit: 1.54, ch4PerUnit: 0.008, n2oPerUnit: 0.012, source: "DEFRA", year: 2025 },
    { category: "lpg", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 5.74, co2PerUnit: 5.68, ch4PerUnit: 0.03, n2oPerUnit: 0.03, source: "EPA", year: 2024 },

    // ============================================
    // FUEL OIL (Scope 1)
    // ============================================
    { category: "fuel_oil", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.96, co2PerUnit: 2.93, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
    { category: "fuel_oil", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 11.24, co2PerUnit: 11.13, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },

    // ============================================
    // MOBILE COMBUSTION - DISTANCE (Scope 1)
    // ============================================
    { category: "vehicle", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.171, co2PerUnit: 0.170, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/mile", co2ePerUnit: 0.275, co2PerUnit: 0.273, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "EPA", year: 2024 },
    { category: "vehicle", subcategory: "small_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.139, co2PerUnit: 0.138, ch4PerUnit: 0.0004, n2oPerUnit: 0.0004, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "large_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.209, co2PerUnit: 0.207, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "van", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.245, co2PerUnit: 0.243, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "hgv", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.882, co2PerUnit: 0.874, ch4PerUnit: 0.004, n2oPerUnit: 0.004, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "motorcycle", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.113, co2PerUnit: 0.112, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },

    // ============================================
    // AIR TRAVEL (Scope 1 or 3 depending on context)
    // ============================================
    { category: "air_travel", subcategory: "domestic", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.255, co2PerUnit: 0.244, ch4PerUnit: 0.001, n2oPerUnit: 0.010, source: "DEFRA", year: 2025 },
    { category: "air_travel", subcategory: "short_haul", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.156, co2PerUnit: 0.149, ch4PerUnit: 0.001, n2oPerUnit: 0.006, source: "DEFRA", year: 2025 },
    { category: "air_travel", subcategory: "long_haul", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.195, co2PerUnit: 0.186, ch4PerUnit: 0.001, n2oPerUnit: 0.008, source: "DEFRA", year: 2025 },

    // ============================================
    // REFRIGERANTS (Scope 1 - Fugitive Emissions)
    // ============================================
    { category: "refrigerant", subcategory: "R-410A", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2088.0, co2PerUnit: 2088.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-134a", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1430.0, co2PerUnit: 1430.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-32", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 675.0, co2PerUnit: 675.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-404A", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 3922.0, co2PerUnit: 3922.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-407C", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1774.0, co2PerUnit: 1774.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-22", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1810.0, co2PerUnit: 1810.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },

    // ============================================
    // PURCHASED HEAT/STEAM (Scope 2)
    // ============================================
    { category: "district_heating", subcategory: "heat", region: "EU", unit: "kgCO2e/kWh", co2ePerUnit: 0.190, co2PerUnit: 0.185, ch4PerUnit: 0.002, n2oPerUnit: 0.003, source: "EEA", year: 2024 },
    { category: "district_heating", subcategory: "heat", region: "GB", unit: "kgCO2e/kWh", co2ePerUnit: 0.176, co2PerUnit: 0.172, ch4PerUnit: 0.002, n2oPerUnit: 0.002, source: "DEFRA", year: 2025 },
    { category: "district_heating", subcategory: "steam", region: "US", unit: "kgCO2e/kWh", co2ePerUnit: 0.255, co2PerUnit: 0.249, ch4PerUnit: 0.003, n2oPerUnit: 0.003, source: "EPA", year: 2024 },

    // ============================================
    // PURCHASED COOLING (Scope 2)
    // ============================================
    { category: "district_cooling", subcategory: "cooling", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.210, co2PerUnit: 0.205, ch4PerUnit: 0.002, n2oPerUnit: 0.003, source: "IEA", year: 2024 },

    // ============================================
    // COAL (Scope 1 - Stationary)
    // ============================================
    { category: "coal", subcategory: "bituminous", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.42, co2PerUnit: 2.40, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },
    { category: "coal", subcategory: "anthracite", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.60, co2PerUnit: 2.58, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },

    // ============================================
    // WASTE (Scope 1/3)
    // ============================================
    { category: "waste", subcategory: "landfill_general", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 457.0, co2PerUnit: 35.0, ch4PerUnit: 420.0, n2oPerUnit: 2.0, source: "DEFRA", year: 2025 },
    { category: "waste", subcategory: "recycling_mixed", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 21.0, co2PerUnit: 21.0, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "waste", subcategory: "incineration", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 21.3, co2PerUnit: 21.0, ch4PerUnit: 0.1, n2oPerUnit: 0.2, source: "DEFRA", year: 2025 },

    // ============================================
    // WATER (Scope 3 but useful for reporting)
    // ============================================
    { category: "water", subcategory: "supply", region: "GB", unit: "kgCO2e/m3", co2ePerUnit: 0.149, co2PerUnit: 0.149, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "water", subcategory: "treatment", region: "GB", unit: "kgCO2e/m3", co2ePerUnit: 0.272, co2PerUnit: 0.272, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "water", subcategory: "supply", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 0.344, co2PerUnit: 0.344, ch4PerUnit: null, n2oPerUnit: null, source: "IEA", year: 2024 },
    { category: "water", subcategory: "treatment", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 0.708, co2PerUnit: 0.708, ch4PerUnit: null, n2oPerUnit: null, source: "IEA", year: 2024 },

    // ============================================
    // EMPLOYEE COMMUTING (Scope 3)
    // ============================================
    { category: "employee_commute", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.171, co2PerUnit: 0.170, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },
    { category: "employee_commute", subcategory: "bus", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.089, co2PerUnit: 0.088, ch4PerUnit: 0.0003, n2oPerUnit: 0.0007, source: "DEFRA", year: 2025 },
    { category: "employee_commute", subcategory: "rail", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.035, co2PerUnit: 0.035, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "employee_commute", subcategory: "motorcycle", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.113, co2PerUnit: 0.112, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },
    { category: "employee_commute", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/mile", co2ePerUnit: 0.275, co2PerUnit: 0.273, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "EPA", year: 2024 },

    // ============================================
    // PURCHASED GOODS & SERVICES (Scope 3 - Category 1)
    // ============================================
    // Activity-based factors (per kg of material)
    { category: "purchased_goods", subcategory: "materials", region: "DE", unit: "kgCO2e/kg", co2ePerUnit: 0.47, co2PerUnit: 0.44, ch4PerUnit: 0.014, n2oPerUnit: 0.016, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "materials", region: "EU", unit: "kgCO2e/kg", co2ePerUnit: 0.47, co2PerUnit: 0.44, ch4PerUnit: 0.014, n2oPerUnit: 0.016, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "materials", region: "US", unit: "kgCO2e/kg", co2ePerUnit: 0.52, co2PerUnit: 0.49, ch4PerUnit: 0.015, n2oPerUnit: 0.015, source: "EPA", year: 2024 },
    { category: "purchased_goods", subcategory: "materials", region: "GB", unit: "kgCO2e/kg", co2ePerUnit: 0.45, co2PerUnit: 0.42, ch4PerUnit: 0.014, n2oPerUnit: 0.016, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "materials", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 0.50, co2PerUnit: 0.47, ch4PerUnit: 0.015, n2oPerUnit: 0.015, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "chemicals", region: "DE", unit: "kgCO2e/kg", co2ePerUnit: 1.58, co2PerUnit: 1.50, ch4PerUnit: 0.04, n2oPerUnit: 0.04, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "chemicals", region: "EU", unit: "kgCO2e/kg", co2ePerUnit: 1.58, co2PerUnit: 1.50, ch4PerUnit: 0.04, n2oPerUnit: 0.04, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "chemicals", region: "US", unit: "kgCO2e/kg", co2ePerUnit: 1.72, co2PerUnit: 1.63, ch4PerUnit: 0.05, n2oPerUnit: 0.04, source: "EPA", year: 2024 },
    { category: "purchased_goods", subcategory: "chemicals", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1.65, co2PerUnit: 1.57, ch4PerUnit: 0.04, n2oPerUnit: 0.04, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "metals", region: "DE", unit: "kgCO2e/kg", co2ePerUnit: 2.41, co2PerUnit: 2.30, ch4PerUnit: 0.05, n2oPerUnit: 0.06, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "metals", region: "EU", unit: "kgCO2e/kg", co2ePerUnit: 2.41, co2PerUnit: 2.30, ch4PerUnit: 0.05, n2oPerUnit: 0.06, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "metals", region: "US", unit: "kgCO2e/kg", co2ePerUnit: 2.55, co2PerUnit: 2.43, ch4PerUnit: 0.06, n2oPerUnit: 0.06, source: "EPA", year: 2024 },
    { category: "purchased_goods", subcategory: "metals", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.48, co2PerUnit: 2.36, ch4PerUnit: 0.06, n2oPerUnit: 0.06, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "plastics", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 3.12, co2PerUnit: 2.97, ch4PerUnit: 0.07, n2oPerUnit: 0.08, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "paper", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 0.92, co2PerUnit: 0.87, ch4PerUnit: 0.03, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "textiles", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 15.0, co2PerUnit: 14.3, ch4PerUnit: 0.35, n2oPerUnit: 0.35, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "electronics", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 20.0, co2PerUnit: 19.0, ch4PerUnit: 0.50, n2oPerUnit: 0.50, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "food_and_beverages", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 3.20, co2PerUnit: 2.80, ch4PerUnit: 0.30, n2oPerUnit: 0.10, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "construction_materials", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 0.24, co2PerUnit: 0.23, ch4PerUnit: 0.005, n2oPerUnit: 0.005, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "furniture", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1.20, co2PerUnit: 1.14, ch4PerUnit: 0.03, n2oPerUnit: 0.03, source: "DEFRA", year: 2025 },
    // Spend-based factors (per currency unit) for when only monetary data is available
    { category: "purchased_goods", subcategory: "materials", region: "DE", unit: "kgCO2e/EUR", co2ePerUnit: 0.39, co2PerUnit: 0.37, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "materials", region: "EU", unit: "kgCO2e/EUR", co2ePerUnit: 0.39, co2PerUnit: 0.37, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "DEFRA", year: 2025 },
    { category: "purchased_goods", subcategory: "materials", region: "GLOBAL", unit: "kgCO2e/USD", co2ePerUnit: 0.42, co2PerUnit: 0.40, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },
    { category: "purchased_goods", subcategory: "services", region: "GLOBAL", unit: "kgCO2e/USD", co2ePerUnit: 0.13, co2PerUnit: 0.12, ch4PerUnit: 0.005, n2oPerUnit: 0.005, source: "EPA", year: 2024 },
    { category: "purchased_goods", subcategory: "services", region: "EU", unit: "kgCO2e/EUR", co2ePerUnit: 0.12, co2PerUnit: 0.11, ch4PerUnit: 0.005, n2oPerUnit: 0.005, source: "DEFRA", year: 2025 },

    // ============================================
    // UPSTREAM TRANSPORTATION (Scope 3)
    // ============================================
    { category: "upstream_transport", subcategory: "road_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 0.107, co2PerUnit: 0.106, ch4PerUnit: 0.0004, n2oPerUnit: 0.0006, source: "DEFRA", year: 2025 },
    { category: "upstream_transport", subcategory: "rail_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 0.028, co2PerUnit: 0.028, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "upstream_transport", subcategory: "sea_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 0.016, co2PerUnit: 0.016, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "upstream_transport", subcategory: "air_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 1.128, co2PerUnit: 1.100, ch4PerUnit: 0.003, n2oPerUnit: 0.025, source: "DEFRA", year: 2025 },
  ];

  for (const factor of factors) {
    await prisma.emissionFactor.upsert({
      where: {
        category_subcategory_region_source_year: {
          category: factor.category,
          subcategory: factor.subcategory,
          region: factor.region,
          source: factor.source,
          year: factor.year,
        },
      },
      update: {
        co2ePerUnit: factor.co2ePerUnit,
        co2PerUnit: factor.co2PerUnit,
        ch4PerUnit: factor.ch4PerUnit,
        n2oPerUnit: factor.n2oPerUnit,
        unit: factor.unit,
        isActive: true,
      },
      create: {
        category: factor.category,
        subcategory: factor.subcategory,
        region: factor.region,
        unit: factor.unit,
        co2ePerUnit: factor.co2ePerUnit,
        co2PerUnit: factor.co2PerUnit,
        ch4PerUnit: factor.ch4PerUnit,
        n2oPerUnit: factor.n2oPerUnit,
        source: factor.source,
        year: factor.year,
        validFrom: new Date(`${factor.year}-01-01`),
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${factors.length} emission factors.`);
}

async function seedComplianceFrameworks() {
  console.log("Seeding compliance frameworks...");

  // CSRD Framework
  const csrd = await prisma.complianceFramework.upsert({
    where: { name: "CSRD" },
    update: {},
    create: {
      name: "CSRD",
      displayName: "CSRD / ESRS Report",
      version: "2024",
      description:
        "EU Corporate Sustainability Reporting Directive based on European Sustainability Reporting Standards (ESRS)",
      regions: ["EU"],
      isActive: true,
    },
  });

  const csrdSections = [
    {
      code: "ESRS2",
      title: "General Disclosures",
      sortOrder: 1,
      isRequired: true,
      subsections: [
        { code: "ESRS2-BP1", title: "Basis for Preparation", isRequired: true },
        { code: "ESRS2-GOV1", title: "Governance — Role of Administrative Bodies", isRequired: true },
        { code: "ESRS2-SBM1", title: "Strategy — Market Position & Business Model", isRequired: true },
        { code: "ESRS2-IRO1", title: "Impact, Risk & Opportunity Identification", isRequired: true },
      ],
    },
    {
      code: "E1",
      title: "Climate Change",
      sortOrder: 2,
      isRequired: true,
      subsections: [
        { code: "E1-1", title: "Transition Plan for Climate Change Mitigation", isRequired: true },
        { code: "E1-4", title: "Targets Related to Climate Change", isRequired: true },
        { code: "E1-5", title: "Energy Consumption & Mix", isRequired: true },
        { code: "E1-6", title: "Gross Scope 1, 2, 3 GHG Emissions", isRequired: true },
        { code: "E1-7", title: "GHG Removals & Carbon Credits", isRequired: false },
        { code: "E1-9", title: "Anticipated Financial Effects of Climate Change", isRequired: false },
      ],
    },
    {
      code: "S1",
      title: "Own Workforce",
      sortOrder: 3,
      isRequired: true,
      subsections: [
        { code: "S1-1", title: "Policies Related to Own Workforce", isRequired: true },
        { code: "S1-6", title: "Characteristics of Employees", isRequired: true },
        { code: "S1-9", title: "Diversity Metrics", isRequired: false },
      ],
    },
    {
      code: "G1",
      title: "Business Conduct",
      sortOrder: 4,
      isRequired: true,
      subsections: [
        { code: "G1-1", title: "Corporate Culture & Business Conduct Policies", isRequired: true },
        { code: "G1-3", title: "Prevention & Detection of Corruption/Bribery", isRequired: true },
      ],
    },
  ];

  for (const section of csrdSections) {
    const parentSection = await prisma.frameworkSection.upsert({
      where: { id: `${csrd.id}-${section.code}` },
      update: {
        title: section.title,
        sortOrder: section.sortOrder,
        isRequired: section.isRequired,
      },
      create: {
        id: `${csrd.id}-${section.code}`,
        frameworkId: csrd.id,
        code: section.code,
        title: section.title,
        sortOrder: section.sortOrder,
        isRequired: section.isRequired,
      },
    });

    if (section.subsections) {
      for (let i = 0; i < section.subsections.length; i++) {
        const sub = section.subsections[i];
        await prisma.frameworkSection.upsert({
          where: { id: `${csrd.id}-${sub.code}` },
          update: {
            title: sub.title,
            sortOrder: i + 1,
            isRequired: sub.isRequired,
          },
          create: {
            id: `${csrd.id}-${sub.code}`,
            frameworkId: csrd.id,
            code: sub.code,
            title: sub.title,
            parentId: parentSection.id,
            sortOrder: i + 1,
            isRequired: sub.isRequired,
          },
        });
      }
    }
  }

  // Seed data points for key sections
  const e16Section = await prisma.frameworkSection.findFirst({
    where: { code: "E1-6", frameworkId: csrd.id },
  });

  if (e16Section) {
    const dataPoints = [
      { code: "E1-6-1", label: "Total Scope 1 GHG Emissions", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-2", label: "Total Scope 2 GHG Emissions (location-based)", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-3", label: "Total Scope 2 GHG Emissions (market-based)", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-4", label: "Total Scope 3 GHG Emissions", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: false },
      { code: "E1-6-5", label: "Total GHG Emissions", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-6", label: "GHG Emissions Intensity (per revenue)", dataType: "NUMERIC" as const, unit: "tCO2e/EUR M", isRequired: false },
      { code: "E1-6-N", label: "GHG Emissions Methodology Narrative", dataType: "NARRATIVE" as const, unit: null, isRequired: true },
    ];

    for (const dp of dataPoints) {
      await prisma.frameworkDataPoint.upsert({
        where: { id: `${e16Section.id}-${dp.code}` },
        update: { label: dp.label, dataType: dp.dataType, unit: dp.unit, isRequired: dp.isRequired },
        create: {
          id: `${e16Section.id}-${dp.code}`,
          sectionId: e16Section.id,
          code: dp.code,
          label: dp.label,
          dataType: dp.dataType,
          unit: dp.unit,
          isRequired: dp.isRequired,
        },
      });
    }
  }

  const e15Section = await prisma.frameworkSection.findFirst({
    where: { code: "E1-5", frameworkId: csrd.id },
  });

  if (e15Section) {
    const dataPoints = [
      { code: "E1-5-1", label: "Total Energy Consumption", dataType: "NUMERIC" as const, unit: "MWh", isRequired: true },
      { code: "E1-5-2", label: "Energy from Fossil Sources", dataType: "NUMERIC" as const, unit: "MWh", isRequired: true },
      { code: "E1-5-3", label: "Energy from Renewable Sources", dataType: "NUMERIC" as const, unit: "MWh", isRequired: true },
      { code: "E1-5-4", label: "Renewable Energy Percentage", dataType: "PERCENTAGE" as const, unit: "%", isRequired: true },
      { code: "E1-5-N", label: "Energy Consumption Narrative", dataType: "NARRATIVE" as const, unit: null, isRequired: true },
    ];

    for (const dp of dataPoints) {
      await prisma.frameworkDataPoint.upsert({
        where: { id: `${e15Section.id}-${dp.code}` },
        update: { label: dp.label, dataType: dp.dataType, unit: dp.unit, isRequired: dp.isRequired },
        create: {
          id: `${e15Section.id}-${dp.code}`,
          sectionId: e15Section.id,
          code: dp.code,
          label: dp.label,
          dataType: dp.dataType,
          unit: dp.unit,
          isRequired: dp.isRequired,
        },
      });
    }
  }

  // GRI Framework (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "GRI" },
    update: {},
    create: {
      name: "GRI",
      displayName: "GRI Standards",
      version: "2021",
      description: "Global Reporting Initiative Universal, Sector, and Topic Standards",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // SASB Framework (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "SASB" },
    update: {},
    create: {
      name: "SASB",
      displayName: "SASB Standards",
      version: "2023",
      description: "Sustainability Accounting Standards Board industry-specific standards",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // ISSB S1 (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "ISSB_S1" },
    update: {},
    create: {
      name: "ISSB_S1",
      displayName: "ISSB S1 — General Sustainability",
      version: "2023",
      description: "IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // ISSB S2 (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "ISSB_S2" },
    update: {},
    create: {
      name: "ISSB_S2",
      displayName: "ISSB S2 — Climate-related Disclosures",
      version: "2023",
      description: "IFRS S2 Climate-related Disclosures",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // SB-253 (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "SB253" },
    update: {},
    create: {
      name: "SB253",
      displayName: "California SB-253",
      version: "2024",
      description: "Climate Corporate Data Accountability Act requiring Scope 1, 2, and 3 reporting",
      regions: ["US-CA"],
      isActive: true,
    },
  });

  console.log("Seeded compliance frameworks.");
}

async function seedDemoData() {
  console.log("Checking for organizations that need demo data...");

  const orgs = await prisma.organization.findMany({
    include: {
      users: { take: 1 },
      _count: { select: { emissionEntries: true } },
    },
  });

  for (const org of orgs) {
    if (org._count.emissionEntries > 0) {
      console.log(`Organization "${org.name}" already has data, skipping.`);
      continue;
    }

    const userId = org.users[0]?.id;
    if (!userId) {
      console.log(`Organization "${org.name}" has no users, skipping.`);
      continue;
    }

    console.log(`Seeding demo data for organization "${org.name}"...`);

    // Create a reporting period
    const currentYear = new Date().getFullYear();
    const reportingPeriod = await prisma.reportingPeriod.upsert({
      where: {
        organizationId_name: {
          organizationId: org.id,
          name: `FY ${currentYear}`,
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        name: `FY ${currentYear}`,
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`),
        isCurrent: true,
      },
    });

    // Seed emission entries across all three scopes with monthly data
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed

    const emissionEntries = [];

    // Scope 1: Natural gas, diesel fleet, company vehicles
    for (let m = 0; m <= Math.min(currentMonth, 11); m++) {
      const startDate = new Date(currentYear, m, 1);
      const endDate = new Date(currentYear, m + 1, 0);

      // Natural gas heating (seasonal pattern)
      const heatingFactor = m < 3 || m > 9 ? 1.5 : 0.4;
      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_1" as const,
        category: "natural_gas",
        subcategory: "combustion",
        source: "Office heating - natural gas",
        activityValue: Math.round(800 * heatingFactor + Math.random() * 200),
        activityUnit: "therms",
        emissionFactor: 5.31,
        emissionFactorSource: "EPA 2024",
        co2e: Math.round(800 * heatingFactor * 5.31),
        co2: Math.round(800 * heatingFactor * 5.28),
        ch4: Math.round(800 * heatingFactor * 0.01 * 100) / 100,
        n2o: Math.round(800 * heatingFactor * 0.02 * 100) / 100,
        startDate,
        endDate,
        location: "HQ Office",
        isEstimated: false,
        confidenceScore: 0.95,
        calculationMethod: "activity-based",
      });

      // Diesel fleet
      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_1" as const,
        category: "diesel",
        subcategory: "combustion",
        source: "Delivery fleet - diesel",
        activityValue: Math.round(450 + Math.random() * 100),
        activityUnit: "gallons",
        emissionFactor: 10.21,
        emissionFactorSource: "EPA 2024",
        co2e: Math.round(450 * 10.21),
        co2: Math.round(450 * 10.10),
        ch4: Math.round(450 * 0.04 * 100) / 100,
        n2o: Math.round(450 * 0.07 * 100) / 100,
        startDate,
        endDate,
        location: "Fleet operations",
        isEstimated: false,
        confidenceScore: 0.92,
        calculationMethod: "activity-based",
      });

      // Company vehicles (gasoline)
      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_1" as const,
        category: "vehicle",
        subcategory: "average_car",
        source: "Company vehicles - gasoline",
        activityValue: Math.round(3200 + Math.random() * 800),
        activityUnit: "km",
        emissionFactor: 0.171,
        emissionFactorSource: "DEFRA 2025",
        co2e: Math.round(3200 * 0.171),
        co2: Math.round(3200 * 0.170),
        ch4: Math.round(3200 * 0.0005 * 100) / 100,
        n2o: Math.round(3200 * 0.0005 * 100) / 100,
        startDate,
        endDate,
        location: "Company car pool",
        isEstimated: false,
        confidenceScore: 0.90,
        calculationMethod: "activity-based",
      });
    }

    // Scope 2: Electricity
    for (let m = 0; m <= Math.min(currentMonth, 11); m++) {
      const startDate = new Date(currentYear, m, 1);
      const endDate = new Date(currentYear, m + 1, 0);
      const summerCooling = m >= 5 && m <= 8 ? 1.3 : 1.0;

      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_2" as const,
        category: "electricity",
        subcategory: "grid",
        source: "Purchased electricity - grid",
        activityValue: Math.round(12000 * summerCooling + Math.random() * 2000),
        activityUnit: "kWh",
        emissionFactor: 0.417,
        emissionFactorSource: "EPA 2024 (US average)",
        co2e: Math.round(12000 * summerCooling * 0.417),
        co2: Math.round(12000 * summerCooling * 0.390),
        ch4: Math.round(12000 * summerCooling * 0.012 * 100) / 100,
        n2o: Math.round(12000 * summerCooling * 0.015 * 100) / 100,
        startDate,
        endDate,
        location: "HQ Office + Warehouse",
        isEstimated: false,
        confidenceScore: 0.98,
        calculationMethod: "activity-based",
      });
    }

    // Scope 3: Business travel, employee commuting, waste
    for (let m = 0; m <= Math.min(currentMonth, 11); m++) {
      const startDate = new Date(currentYear, m, 1);
      const endDate = new Date(currentYear, m + 1, 0);

      // Business air travel
      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_3" as const,
        category: "air_travel",
        subcategory: "short_haul",
        source: "Business flights - short haul",
        activityValue: Math.round(8000 + Math.random() * 4000),
        activityUnit: "km",
        emissionFactor: 0.156,
        emissionFactorSource: "DEFRA 2025",
        co2e: Math.round(8000 * 0.156),
        co2: Math.round(8000 * 0.149),
        ch4: Math.round(8000 * 0.001 * 100) / 100,
        n2o: Math.round(8000 * 0.006 * 100) / 100,
        startDate,
        endDate,
        isEstimated: true,
        confidenceScore: 0.80,
        calculationMethod: "activity-based",
      });

      // Employee commuting
      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_3" as const,
        category: "employee_commute",
        subcategory: "average_car",
        source: "Employee commuting (estimated)",
        activityValue: Math.round(15000 + Math.random() * 3000),
        activityUnit: "km",
        emissionFactor: 0.171,
        emissionFactorSource: "DEFRA 2025",
        co2e: Math.round(15000 * 0.171),
        co2: Math.round(15000 * 0.170),
        ch4: Math.round(15000 * 0.0005 * 100) / 100,
        n2o: Math.round(15000 * 0.0005 * 100) / 100,
        startDate,
        endDate,
        isEstimated: true,
        confidenceScore: 0.70,
        calculationMethod: "activity-based",
      });

      // Waste
      emissionEntries.push({
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        scope: "SCOPE_3" as const,
        category: "waste",
        subcategory: "landfill_general",
        source: "Office & warehouse waste",
        activityValue: Math.round(2 + Math.random() * 1.5),
        activityUnit: "tonnes",
        emissionFactor: 457.0,
        emissionFactorSource: "DEFRA 2025",
        co2e: Math.round(2 * 457),
        co2: Math.round(2 * 35),
        ch4: Math.round(2 * 420 * 100) / 100,
        n2o: Math.round(2 * 2 * 100) / 100,
        startDate,
        endDate,
        location: "HQ Office",
        isEstimated: true,
        confidenceScore: 0.75,
        calculationMethod: "activity-based",
      });
    }

    // Bulk create emission entries
    await prisma.emissionEntry.createMany({ data: emissionEntries });
    console.log(`  Created ${emissionEntries.length} emission entries.`);

    // Seed documents
    const documents = [
      { fileName: "electricity-bill-jan-2026.pdf", fileType: "application/pdf", filePath: "/uploads/demo/elec-jan.pdf", fileSize: 245000, documentType: "UTILITY_BILL" as const, status: "REVIEWED" as const, extractionConfidence: 0.96 },
      { fileName: "electricity-bill-feb-2026.pdf", fileType: "application/pdf", filePath: "/uploads/demo/elec-feb.pdf", fileSize: 238000, documentType: "UTILITY_BILL" as const, status: "REVIEWED" as const, extractionConfidence: 0.95 },
      { fileName: "electricity-bill-mar-2026.pdf", fileType: "application/pdf", filePath: "/uploads/demo/elec-mar.pdf", fileSize: 241000, documentType: "UTILITY_BILL" as const, status: "EXTRACTED" as const, extractionConfidence: 0.94 },
      { fileName: "fleet-diesel-receipt-q1.pdf", fileType: "application/pdf", filePath: "/uploads/demo/diesel-q1.pdf", fileSize: 128000, documentType: "FUEL_RECEIPT" as const, status: "REVIEWED" as const, extractionConfidence: 0.91 },
      { fileName: "fleet-diesel-receipt-q2.pdf", fileType: "application/pdf", filePath: "/uploads/demo/diesel-q2.pdf", fileSize: 132000, documentType: "FUEL_RECEIPT" as const, status: "EXTRACTED" as const, extractionConfidence: 0.89 },
      { fileName: "office-supplies-invoice.pdf", fileType: "application/pdf", filePath: "/uploads/demo/invoice-supplies.pdf", fileSize: 95000, documentType: "INVOICE" as const, status: "REVIEWED" as const, extractionConfidence: 0.93 },
      { fileName: "waste-disposal-manifest-q1.pdf", fileType: "application/pdf", filePath: "/uploads/demo/waste-q1.pdf", fileSize: 156000, documentType: "WASTE_MANIFEST" as const, status: "EXTRACTED" as const, extractionConfidence: 0.88 },
      { fileName: "supplier-esg-assessment-meridian.pdf", fileType: "application/pdf", filePath: "/uploads/demo/supplier-meridian.pdf", fileSize: 320000, documentType: "SUPPLIER_REPORT" as const, status: "REVIEWED" as const, extractionConfidence: 0.85 },
    ];

    for (const doc of documents) {
      await prisma.document.create({
        data: {
          ...doc,
          organizationId: org.id,
          uploadedById: userId,
          extractedData: { demo: true },
        },
      });
    }
    console.log(`  Created ${documents.length} documents.`);

    // Seed suppliers
    const suppliers = [
      { name: "Meridian Tech Solutions", contactEmail: "esg@meridiantech.com", contactName: "Sarah Chen", industry: "TECHNOLOGY" as const, country: "US", esgRiskLevel: "LOW" as const, esgScore: 82, lastAssessment: new Date(currentYear, 1, 15) },
      { name: "Atlas Industrial Group", contactEmail: "sustainability@atlasgroup.com", contactName: "James Wilson", industry: "MANUFACTURING" as const, country: "DE", esgRiskLevel: "MEDIUM" as const, esgScore: 64, lastAssessment: new Date(currentYear, 0, 20) },
      { name: "Vantage Supply Co", contactEmail: "compliance@vantagesupply.com", contactName: "Maria Garcia", industry: "LOGISTICS" as const, country: "NL", esgRiskLevel: "LOW" as const, esgScore: 78, lastAssessment: new Date(currentYear, 2, 1) },
      { name: "Pinnacle Manufacturing", contactEmail: "green@pinnaclemfg.com", contactName: "Tom Anderson", industry: "MANUFACTURING" as const, country: "GB", esgRiskLevel: "HIGH" as const, esgScore: 41, lastAssessment: new Date(currentYear, 1, 28) },
      { name: "Horizon Energy Partners", contactEmail: "esg@horizonenergy.com", contactName: "Lisa Park", industry: "ENERGY" as const, country: "US", esgRiskLevel: "MEDIUM" as const, esgScore: 58, lastAssessment: new Date(currentYear, 0, 10) },
      { name: "GreenPack Logistics", contactEmail: "info@greenpack.eu", contactName: "Erik Johansson", industry: "LOGISTICS" as const, country: "SE", esgRiskLevel: "LOW" as const, esgScore: 91 },
    ];

    for (const supplier of suppliers) {
      await prisma.supplier.create({
        data: { ...supplier, organizationId: org.id },
      });
    }
    console.log(`  Created ${suppliers.length} suppliers.`);

    // Assign compliance frameworks to the org
    const frameworks = await prisma.complianceFramework.findMany({
      where: { name: { in: ["CSRD", "GRI"] } },
    });

    for (const fw of frameworks) {
      await prisma.orgFramework.upsert({
        where: {
          organizationId_frameworkId_targetYear: {
            organizationId: org.id,
            frameworkId: fw.id,
            targetYear: currentYear,
          },
        },
        update: {},
        create: {
          organizationId: org.id,
          frameworkId: fw.id,
          targetYear: currentYear,
          status: "IN_PROGRESS",
          completionPct: fw.name === "CSRD" ? 42 : 28,
          coveredDataPoints: fw.name === "CSRD" ? 5 : 3,
          totalDataPoints: fw.name === "CSRD" ? 12 : 11,
          dueDate: fw.name === "CSRD" ? new Date(currentYear, 5, 30) : new Date(currentYear, 11, 31),
        },
      });
    }
    console.log(`  Assigned ${frameworks.length} compliance frameworks.`);

    // Create a demo report
    await prisma.report.create({
      data: {
        organizationId: org.id,
        reportingPeriodId: reportingPeriod.id,
        frameworkType: "CSRD",
        title: `CSRD Draft Report - FY ${currentYear}`,
        status: "DRAFT",
        version: 1,
      },
    });
    console.log("  Created 1 draft report.");

    // Add some audit log entries
    const auditEntries = [
      { action: "CREATE", entityType: "Document", entityId: "demo-1", metadata: { fileName: "electricity-bill-jan-2026.pdf" } },
      { action: "EXTRACT", entityType: "Document", entityId: "demo-2", metadata: { confidence: 0.96 } },
      { action: "CREATE", entityType: "EmissionEntry", entityId: "demo-3", metadata: { scope: "SCOPE_1", category: "natural_gas" } },
      { action: "CREATE", entityType: "Supplier", entityId: "demo-4", metadata: { name: "Meridian Tech Solutions" } },
      { action: "UPDATE", entityType: "OrgFramework", entityId: "demo-5", metadata: { framework: "CSRD", completionPct: 42 } },
      { action: "CREATE", entityType: "Report", entityId: "demo-6", metadata: { title: `CSRD Draft Report - FY ${currentYear}` } },
    ];

    for (const entry of auditEntries) {
      await prisma.auditLog.create({
        data: {
          ...entry,
          organizationId: org.id,
          userId,
          metadata: entry.metadata as object,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last 7 days
        },
      });
    }
    console.log("  Created audit log entries.");

    console.log(`Done seeding demo data for "${org.name}".`);
  }
}

async function seedAdminUser() {
  console.log("Seeding admin user...");

  const adminEmail = "jabriel@arisolutionsinc.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin user already exists, skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Finao028!", 12);

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Jabriel - Super Admin",
      hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
      locale: "en",
    },
  });

  console.log("Admin user created: jabriel@arisolutionsinc.com");
}

async function main() {
  console.log("Starting seed...");
  await seedAdminUser();
  await seedEmissionFactors();
  await seedComplianceFrameworks();
  await seedDemoData();
  console.log("Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
