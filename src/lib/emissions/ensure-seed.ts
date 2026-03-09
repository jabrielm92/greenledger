/**
 * Ensures the EmissionFactor table has seed data.
 *
 * If the table is empty (seed hasn't been run), this inserts the
 * standard emission factors at runtime so the calculation pipeline
 * works immediately without requiring a separate `prisma db seed` step.
 *
 * This is idempotent and safe to call from any code path.
 */

import { prisma } from "@/lib/prisma";

let _seeded: boolean | null = null;

const STANDARD_FACTORS = [
  // Electricity grid
  { category: "electricity", subcategory: "grid", region: "US", unit: "kgCO2e/kWh", co2ePerUnit: 0.417, co2PerUnit: 0.390, ch4PerUnit: 0.012, n2oPerUnit: 0.015, source: "EPA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "US-CA", unit: "kgCO2e/kWh", co2ePerUnit: 0.225, co2PerUnit: 0.210, ch4PerUnit: 0.007, n2oPerUnit: 0.008, source: "EPA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "US-TX", unit: "kgCO2e/kWh", co2ePerUnit: 0.396, co2PerUnit: 0.370, ch4PerUnit: 0.012, n2oPerUnit: 0.014, source: "EPA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "US-NY", unit: "kgCO2e/kWh", co2ePerUnit: 0.228, co2PerUnit: 0.213, ch4PerUnit: 0.007, n2oPerUnit: 0.008, source: "EPA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "EU", unit: "kgCO2e/kWh", co2ePerUnit: 0.256, co2PerUnit: 0.240, ch4PerUnit: 0.008, n2oPerUnit: 0.008, source: "EEA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "GB", unit: "kgCO2e/kWh", co2ePerUnit: 0.207, co2PerUnit: 0.193, ch4PerUnit: 0.006, n2oPerUnit: 0.008, source: "DEFRA", year: 2025 },
  { category: "electricity", subcategory: "grid", region: "DE", unit: "kgCO2e/kWh", co2ePerUnit: 0.366, co2PerUnit: 0.343, ch4PerUnit: 0.011, n2oPerUnit: 0.012, source: "UBA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "FR", unit: "kgCO2e/kWh", co2ePerUnit: 0.052, co2PerUnit: 0.049, ch4PerUnit: 0.001, n2oPerUnit: 0.002, source: "ADEME", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "CA", unit: "kgCO2e/kWh", co2ePerUnit: 0.120, co2PerUnit: 0.112, ch4PerUnit: 0.004, n2oPerUnit: 0.004, source: "ECCC", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "AU", unit: "kgCO2e/kWh", co2ePerUnit: 0.680, co2PerUnit: 0.636, ch4PerUnit: 0.020, n2oPerUnit: 0.024, source: "DEE", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "JP", unit: "kgCO2e/kWh", co2ePerUnit: 0.457, co2PerUnit: 0.428, ch4PerUnit: 0.013, n2oPerUnit: 0.016, source: "MOE", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "IN", unit: "kgCO2e/kWh", co2ePerUnit: 0.708, co2PerUnit: 0.663, ch4PerUnit: 0.021, n2oPerUnit: 0.024, source: "CEA", year: 2024 },
  { category: "electricity", subcategory: "grid", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.494, co2PerUnit: 0.462, ch4PerUnit: 0.015, n2oPerUnit: 0.017, source: "IEA", year: 2024 },
  // Natural gas
  { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/therm", co2ePerUnit: 5.31, co2PerUnit: 5.28, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "EPA", year: 2024 },
  { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 2.02, co2PerUnit: 2.00, ch4PerUnit: 0.004, n2oPerUnit: 0.016, source: "EPA", year: 2024 },
  { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.184, co2PerUnit: 0.183, ch4PerUnit: 0.0004, n2oPerUnit: 0.0006, source: "DEFRA", year: 2025 },
  { category: "natural_gas", subcategory: "combustion", region: "US", unit: "kgCO2e/MCF", co2ePerUnit: 53.06, co2PerUnit: 52.91, ch4PerUnit: 0.05, n2oPerUnit: 0.10, source: "EPA", year: 2024 },
  // Diesel
  { category: "diesel", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.68, co2PerUnit: 2.65, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
  { category: "diesel", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 10.15, co2PerUnit: 10.04, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },
  { category: "diesel", subcategory: "combustion", region: "US", unit: "kgCO2e/gallon", co2ePerUnit: 10.21, co2PerUnit: 10.10, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },
  // Gasoline
  { category: "gasoline", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.31, co2PerUnit: 2.29, ch4PerUnit: 0.008, n2oPerUnit: 0.012, source: "DEFRA", year: 2025 },
  { category: "gasoline", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 8.78, co2PerUnit: 8.70, ch4PerUnit: 0.03, n2oPerUnit: 0.05, source: "EPA", year: 2024 },
  // LPG
  { category: "lpg", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 1.56, co2PerUnit: 1.54, ch4PerUnit: 0.008, n2oPerUnit: 0.012, source: "DEFRA", year: 2025 },
  { category: "lpg", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 5.74, co2PerUnit: 5.68, ch4PerUnit: 0.03, n2oPerUnit: 0.03, source: "EPA", year: 2024 },
  // Fuel oil
  { category: "fuel_oil", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.96, co2PerUnit: 2.93, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
  { category: "fuel_oil", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 11.24, co2PerUnit: 11.13, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },
  // Vehicle
  { category: "vehicle", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.171, co2PerUnit: 0.170, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },
  { category: "vehicle", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/mile", co2ePerUnit: 0.275, co2PerUnit: 0.273, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "EPA", year: 2024 },
  { category: "vehicle", subcategory: "van", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.245, co2PerUnit: 0.243, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "DEFRA", year: 2025 },
  { category: "vehicle", subcategory: "hgv", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.882, co2PerUnit: 0.874, ch4PerUnit: 0.004, n2oPerUnit: 0.004, source: "DEFRA", year: 2025 },
  // Air travel
  { category: "air_travel", subcategory: "domestic", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.255, co2PerUnit: 0.244, ch4PerUnit: 0.001, n2oPerUnit: 0.010, source: "DEFRA", year: 2025 },
  { category: "air_travel", subcategory: "short_haul", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.156, co2PerUnit: 0.149, ch4PerUnit: 0.001, n2oPerUnit: 0.006, source: "DEFRA", year: 2025 },
  { category: "air_travel", subcategory: "long_haul", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.195, co2PerUnit: 0.186, ch4PerUnit: 0.001, n2oPerUnit: 0.008, source: "DEFRA", year: 2025 },
  // Refrigerants
  { category: "refrigerant", subcategory: "R-410A", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2088.0, co2PerUnit: 2088.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
  { category: "refrigerant", subcategory: "R-134a", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1430.0, co2PerUnit: 1430.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
  { category: "refrigerant", subcategory: "R-32", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 675.0, co2PerUnit: 675.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
  // District heating/cooling
  { category: "district_heating", subcategory: "heat", region: "EU", unit: "kgCO2e/kWh", co2ePerUnit: 0.190, co2PerUnit: 0.185, ch4PerUnit: 0.002, n2oPerUnit: 0.003, source: "EEA", year: 2024 },
  { category: "district_heating", subcategory: "heat", region: "GB", unit: "kgCO2e/kWh", co2ePerUnit: 0.176, co2PerUnit: 0.172, ch4PerUnit: 0.002, n2oPerUnit: 0.002, source: "DEFRA", year: 2025 },
  { category: "district_cooling", subcategory: "cooling", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.210, co2PerUnit: 0.205, ch4PerUnit: 0.002, n2oPerUnit: 0.003, source: "IEA", year: 2024 },
  // Coal
  { category: "coal", subcategory: "bituminous", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.42, co2PerUnit: 2.40, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },
  { category: "coal", subcategory: "anthracite", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.60, co2PerUnit: 2.58, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },
  // Waste
  { category: "waste", subcategory: "landfill_general", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 457.0, co2PerUnit: 35.0, ch4PerUnit: 420.0, n2oPerUnit: 2.0, source: "DEFRA", year: 2025 },
  { category: "waste", subcategory: "recycling_mixed", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 21.0, co2PerUnit: 21.0, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
  { category: "waste", subcategory: "incineration", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 21.3, co2PerUnit: 21.0, ch4PerUnit: 0.1, n2oPerUnit: 0.2, source: "DEFRA", year: 2025 },
  // Water
  { category: "water", subcategory: "supply", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 0.344, co2PerUnit: 0.344, ch4PerUnit: null, n2oPerUnit: null, source: "IEA", year: 2024 },
  { category: "water", subcategory: "treatment", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 0.708, co2PerUnit: 0.708, ch4PerUnit: null, n2oPerUnit: null, source: "IEA", year: 2024 },
  // Employee commute
  { category: "employee_commute", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.171, co2PerUnit: 0.170, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },
  { category: "employee_commute", subcategory: "bus", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.089, co2PerUnit: 0.088, ch4PerUnit: 0.0003, n2oPerUnit: 0.0007, source: "DEFRA", year: 2025 },
  { category: "employee_commute", subcategory: "rail", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.035, co2PerUnit: 0.035, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
  // Upstream transport
  { category: "upstream_transport", subcategory: "road_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 0.107, co2PerUnit: 0.106, ch4PerUnit: 0.0004, n2oPerUnit: 0.0006, source: "DEFRA", year: 2025 },
  { category: "upstream_transport", subcategory: "rail_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 0.028, co2PerUnit: 0.028, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
  { category: "upstream_transport", subcategory: "sea_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 0.016, co2PerUnit: 0.016, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
  { category: "upstream_transport", subcategory: "air_freight", region: "GLOBAL", unit: "kgCO2e/tonne_km", co2ePerUnit: 1.128, co2PerUnit: 1.100, ch4PerUnit: 0.003, n2oPerUnit: 0.025, source: "DEFRA", year: 2025 },
] as const;

export async function ensureEmissionFactorsSeeded(): Promise<void> {
  // Fast path: already checked this process
  if (_seeded === true) return;

  try {
    const count = await prisma.emissionFactor.count({ where: { isActive: true } });
    if (count > 0) {
      _seeded = true;
      return;
    }

    console.log("[SEED] EmissionFactor table is empty — seeding standard factors...");

    for (const factor of STANDARD_FACTORS) {
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

    _seeded = true;
    console.log(`[SEED] Seeded ${STANDARD_FACTORS.length} emission factors.`);
  } catch (error) {
    console.error("[SEED] Failed to seed emission factors:", error);
    // Don't set _seeded so it retries next time
  }
}
