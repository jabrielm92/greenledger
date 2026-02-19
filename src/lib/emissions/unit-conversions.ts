/**
 * Unit conversion factors to normalize activity data into standard units
 * for emission factor lookup.
 */

// Volume conversions (to liters)
const TO_LITERS: Record<string, number> = {
  liters: 1,
  liter: 1,
  l: 1,
  gallons: 3.78541,
  gallon: 3.78541,
  gal: 3.78541,
  m3: 1000,
  "cubic meters": 1000,
};

// Energy conversions (to kWh)
const TO_KWH: Record<string, number> = {
  kWh: 1,
  kwh: 1,
  MWh: 1000,
  mwh: 1000,
  GJ: 277.778,
  gj: 277.778,
  therms: 29.3001,
  therm: 29.3001,
  BTU: 0.000293071,
  btu: 0.000293071,
  MMBTU: 293.071,
  mmbtu: 293.071,
  MCF: 293.071, // 1 MCF natural gas ≈ 1 MMBTU
};

// Distance conversions (to km)
const TO_KM: Record<string, number> = {
  km: 1,
  kilometers: 1,
  miles: 1.60934,
  mile: 1.60934,
  mi: 1.60934,
};

// Mass conversions (to kg)
const TO_KG: Record<string, number> = {
  kg: 1,
  kilograms: 1,
  tonnes: 1000,
  tonne: 1000,
  tons: 907.185,
  ton: 907.185,
  lbs: 0.453592,
  lb: 0.453592,
  pounds: 0.453592,
};

interface ConversionResult {
  value: number;
  unit: string;
  conversionFactor: number;
}

/**
 * Convert a value from one unit to a standard unit for the given category.
 * Returns the converted value and the standard unit used.
 */
export function convertToStandardUnit(
  value: number,
  fromUnit: string,
  category: string
): ConversionResult {
  const normalizedUnit = fromUnit.trim();

  // Energy-based categories
  if (
    ["electricity", "natural_gas", "district_heating", "district_cooling"].includes(category)
  ) {
    const factor = TO_KWH[normalizedUnit];
    if (factor) {
      return { value: value * factor, unit: "kWh", conversionFactor: factor };
    }
    // Natural gas may also come in volume
    if (category === "natural_gas") {
      const volFactor = TO_LITERS[normalizedUnit];
      if (volFactor) {
        // Convert liters to m3, factor will handle the rest
        return {
          value: (value * volFactor) / 1000,
          unit: "m3",
          conversionFactor: volFactor / 1000,
        };
      }
    }
  }

  // Fuel categories (volume-based)
  if (["diesel", "gasoline", "lpg", "fuel_oil"].includes(category)) {
    const factor = TO_LITERS[normalizedUnit];
    if (factor) {
      return { value: value * factor, unit: "liter", conversionFactor: factor };
    }
    // Also accept gallons mapped to gallon
    if (normalizedUnit === "gallons" || normalizedUnit === "gallon") {
      return { value, unit: "gallon", conversionFactor: 1 };
    }
  }

  // Vehicle / distance categories
  if (["vehicle", "air_travel"].includes(category)) {
    const factor = TO_KM[normalizedUnit];
    if (factor) {
      return { value: value * factor, unit: "km", conversionFactor: factor };
    }
    // Also accept miles directly
    if (normalizedUnit === "miles" || normalizedUnit === "mile") {
      return { value, unit: "mile", conversionFactor: 1 };
    }
  }

  // Mass categories (refrigerants, waste, coal)
  if (["refrigerant", "waste", "coal", "water"].includes(category)) {
    const factor = TO_KG[normalizedUnit];
    if (factor) {
      return { value: value * factor, unit: "kg", conversionFactor: factor };
    }
    // Waste often in tonnes
    if (category === "waste" && (normalizedUnit === "tonnes" || normalizedUnit === "tonne")) {
      return { value, unit: "tonne", conversionFactor: 1 };
    }
    // Water in m3
    if (category === "water" && normalizedUnit === "m3") {
      return { value, unit: "m3", conversionFactor: 1 };
    }
  }

  // No conversion needed or unknown — pass through
  return { value, unit: normalizedUnit, conversionFactor: 1 };
}

/**
 * Map a unit to the emission factor unit format used in the database.
 */
export function mapToFactorUnit(
  standardUnit: string,
  category: string
): string {
  const unitMap: Record<string, Record<string, string>> = {
    electricity: { kWh: "kgCO2e/kWh" },
    natural_gas: {
      kWh: "kgCO2e/kWh",
      m3: "kgCO2e/m3",
      therm: "kgCO2e/therm",
      MCF: "kgCO2e/MCF",
    },
    diesel: { liter: "kgCO2e/liter", gallon: "kgCO2e/gallon" },
    gasoline: { liter: "kgCO2e/liter", gallon: "kgCO2e/gallon" },
    lpg: { liter: "kgCO2e/liter", gallon: "kgCO2e/gallon" },
    fuel_oil: { liter: "kgCO2e/liter", gallon: "kgCO2e/gallon" },
    vehicle: { km: "kgCO2e/km", mile: "kgCO2e/mile" },
    air_travel: { km: "kgCO2e/km" },
    refrigerant: { kg: "kgCO2e/kg" },
    coal: { kg: "kgCO2e/kg" },
    waste: { tonne: "kgCO2e/tonne", kg: "kgCO2e/kg" },
    water: { m3: "kgCO2e/m3" },
    district_heating: { kWh: "kgCO2e/kWh" },
    district_cooling: { kWh: "kgCO2e/kWh" },
  };

  return unitMap[category]?.[standardUnit] || `kgCO2e/${standardUnit}`;
}
