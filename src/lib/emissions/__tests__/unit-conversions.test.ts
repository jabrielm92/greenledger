import { describe, it, expect } from "vitest";
import { convertToStandardUnit, mapToFactorUnit } from "../unit-conversions";

describe("convertToStandardUnit", () => {
  // -------------------------------------------------------
  // Energy-based categories (electricity, natural_gas, etc.)
  // -------------------------------------------------------
  describe("electricity / energy categories", () => {
    it("kWh passes through unchanged", () => {
      const r = convertToStandardUnit(100, "kWh", "electricity");
      expect(r).toEqual({ value: 100, unit: "kWh", conversionFactor: 1 });
    });

    it("MWh converts to kWh (×1000)", () => {
      const r = convertToStandardUnit(5, "MWh", "electricity");
      expect(r.value).toBe(5000);
      expect(r.unit).toBe("kWh");
    });

    it("GJ converts to kWh", () => {
      const r = convertToStandardUnit(1, "GJ", "electricity");
      expect(r.value).toBeCloseTo(277.778);
      expect(r.unit).toBe("kWh");
    });

    it("therms converts to kWh", () => {
      const r = convertToStandardUnit(10, "therms", "natural_gas");
      expect(r.value).toBeCloseTo(293.001);
    });

    it("BTU converts to kWh", () => {
      const r = convertToStandardUnit(1000000, "BTU", "electricity");
      expect(r.value).toBeCloseTo(293.071, 0);
    });

    it("MMBTU converts to kWh", () => {
      const r = convertToStandardUnit(1, "MMBTU", "natural_gas");
      expect(r.value).toBeCloseTo(293.071);
    });

    it("natural_gas in m3 converts to m3 via volume path", () => {
      const r = convertToStandardUnit(100, "m3", "natural_gas");
      // m3 → liters (×1000) → back to m3 ÷1000 = 100
      expect(r.value).toBeCloseTo(100);
      expect(r.unit).toBe("m3");
    });

    it("natural_gas in liters converts to m3", () => {
      const r = convertToStandardUnit(1000, "liters", "natural_gas");
      expect(r.value).toBeCloseTo(1); // 1000 liters = 1 m3
      expect(r.unit).toBe("m3");
    });

    it("district_heating kWh passes through", () => {
      const r = convertToStandardUnit(500, "kWh", "district_heating");
      expect(r.value).toBe(500);
      expect(r.unit).toBe("kWh");
    });

    it("district_cooling MWh converts", () => {
      const r = convertToStandardUnit(2, "MWh", "district_cooling");
      expect(r.value).toBe(2000);
    });
  });

  // -------------------------------------------------------
  // Fuel categories (volume-based)
  // -------------------------------------------------------
  describe("fuel categories", () => {
    it("diesel in liters passes through", () => {
      const r = convertToStandardUnit(50, "liters", "diesel");
      expect(r.value).toBe(50);
      expect(r.unit).toBe("liter");
    });

    it("gasoline in gallons converts to liters", () => {
      const r = convertToStandardUnit(10, "gallons", "gasoline");
      expect(r.value).toBeCloseTo(37.8541);
      expect(r.unit).toBe("liter");
    });

    it("lpg in m3 converts to liters", () => {
      const r = convertToStandardUnit(1, "m3", "lpg");
      expect(r.value).toBe(1000);
      expect(r.unit).toBe("liter");
    });

    it("fuel_oil in liters", () => {
      const r = convertToStandardUnit(200, "l", "fuel_oil");
      expect(r.value).toBe(200);
      expect(r.unit).toBe("liter");
    });
  });

  // -------------------------------------------------------
  // Distance-based categories
  // -------------------------------------------------------
  describe("distance categories", () => {
    it("employee_commute in km passes through", () => {
      const r = convertToStandardUnit(30, "km", "employee_commute");
      expect(r.value).toBe(30);
      expect(r.unit).toBe("km");
    });

    it("employee_commute in miles converts to km", () => {
      const r = convertToStandardUnit(10, "miles", "employee_commute");
      expect(r.value).toBeCloseTo(16.0934);
      expect(r.unit).toBe("km");
    });

    it("air_travel in km", () => {
      const r = convertToStandardUnit(1000, "km", "air_travel");
      expect(r.value).toBe(1000);
      expect(r.unit).toBe("km");
    });

    it("vehicle in miles converts to km", () => {
      const r = convertToStandardUnit(60, "miles", "vehicle");
      expect(r.value).toBeCloseTo(96.5604);
    });
  });

  // -------------------------------------------------------
  // Upstream transport (tonne-distance)
  // -------------------------------------------------------
  describe("upstream_transport", () => {
    it("tonne_km passes through", () => {
      const r = convertToStandardUnit(500, "tonne_km", "upstream_transport");
      expect(r.value).toBe(500);
      expect(r.unit).toBe("tonne_km");
    });

    it("tonne-km with hyphen passes through", () => {
      const r = convertToStandardUnit(500, "tonne-km", "upstream_transport");
      expect(r.value).toBe(500);
      expect(r.unit).toBe("tonne_km");
    });

    it("tonne_miles converts to tonne_km", () => {
      const r = convertToStandardUnit(100, "tonne_miles", "upstream_transport");
      expect(r.value).toBeCloseTo(160.934);
      expect(r.unit).toBe("tonne_km");
    });
  });

  // -------------------------------------------------------
  // Mass categories (refrigerant, waste, coal)
  // -------------------------------------------------------
  describe("mass categories", () => {
    it("refrigerant in kg passes through", () => {
      const r = convertToStandardUnit(5, "kg", "refrigerant");
      expect(r.value).toBe(5);
      expect(r.unit).toBe("kg");
    });

    it("waste in tonnes converts to kg", () => {
      const r = convertToStandardUnit(2, "tonnes", "waste");
      expect(r.value).toBe(2000);
      expect(r.unit).toBe("kg");
    });

    it("coal in lbs converts to kg", () => {
      const r = convertToStandardUnit(100, "lbs", "coal");
      expect(r.value).toBeCloseTo(45.3592);
      expect(r.unit).toBe("kg");
    });

    it("coal in tons (US short tons) converts to kg", () => {
      const r = convertToStandardUnit(1, "tons", "coal");
      expect(r.value).toBeCloseTo(907.185);
    });
  });

  // -------------------------------------------------------
  // Water (volume to m3)
  // -------------------------------------------------------
  describe("water", () => {
    it("m3 passes through", () => {
      const r = convertToStandardUnit(50, "m3", "water");
      expect(r.value).toBe(50);
      expect(r.unit).toBe("m3");
    });

    it("liters converts to m3", () => {
      const r = convertToStandardUnit(5000, "liters", "water");
      expect(r.value).toBeCloseTo(5);
      expect(r.unit).toBe("m3");
    });

    it("gallons converts to m3", () => {
      const r = convertToStandardUnit(264.172, "gallons", "water");
      expect(r.value).toBeCloseTo(1, 0); // ~264 gallons ≈ 1 m3
    });
  });

  // -------------------------------------------------------
  // Purchased goods (mass or pass-through)
  // -------------------------------------------------------
  describe("purchased_goods", () => {
    it("kg passes through", () => {
      const r = convertToStandardUnit(100, "kg", "purchased_goods");
      expect(r.value).toBe(100);
      expect(r.unit).toBe("kg");
    });

    it("tonnes converts to kg", () => {
      const r = convertToStandardUnit(5, "tonnes", "purchased_goods");
      expect(r.value).toBe(5000);
    });

    it("spend-based EUR passes through unchanged", () => {
      const r = convertToStandardUnit(10000, "EUR", "purchased_goods");
      expect(r.value).toBe(10000);
      expect(r.unit).toBe("EUR");
      expect(r.conversionFactor).toBe(1);
    });
  });

  // -------------------------------------------------------
  // Unknown category — pass through
  // -------------------------------------------------------
  describe("unknown category", () => {
    it("passes through value and unit unchanged", () => {
      const r = convertToStandardUnit(42, "widgets", "unknown_category");
      expect(r.value).toBe(42);
      expect(r.unit).toBe("widgets");
      expect(r.conversionFactor).toBe(1);
    });
  });
});

describe("mapToFactorUnit", () => {
  it("maps electricity kWh", () => {
    expect(mapToFactorUnit("kWh", "electricity")).toBe("kgCO2e/kWh");
  });

  it("maps diesel liter", () => {
    expect(mapToFactorUnit("liter", "diesel")).toBe("kgCO2e/liter");
  });

  it("maps diesel gallon", () => {
    expect(mapToFactorUnit("gallon", "diesel")).toBe("kgCO2e/gallon");
  });

  it("maps vehicle km", () => {
    expect(mapToFactorUnit("km", "vehicle")).toBe("kgCO2e/km");
  });

  it("maps air_travel km", () => {
    expect(mapToFactorUnit("km", "air_travel")).toBe("kgCO2e/km");
  });

  it("maps waste tonne", () => {
    expect(mapToFactorUnit("tonne", "waste")).toBe("kgCO2e/tonne");
  });

  it("maps water m3", () => {
    expect(mapToFactorUnit("m3", "water")).toBe("kgCO2e/m3");
  });

  it("maps upstream_transport tonne_km", () => {
    expect(mapToFactorUnit("tonne_km", "upstream_transport")).toBe("kgCO2e/tonne_km");
  });

  it("maps employee_commute km", () => {
    expect(mapToFactorUnit("km", "employee_commute")).toBe("kgCO2e/km");
  });

  it("falls back to generic format for unknown combo", () => {
    expect(mapToFactorUnit("widgets", "unknown")).toBe("kgCO2e/widgets");
  });
});
