import type { CalculationInput, CalculationResult } from "@/types";
import { convertToStandardUnit, mapToFactorUnit } from "./unit-conversions";
import { lookupEmissionFactor, lookupCustomFactor } from "./emission-factors";

/**
 * Core emissions calculation engine.
 * Takes activity data and returns emissions in kgCO2e with full methodology breakdown.
 */
export async function calculateEmissions(
  input: CalculationInput,
  organizationId?: string
): Promise<CalculationResult> {
  // Step 1: Convert units to standard
  const converted = convertToStandardUnit(
    input.activityValue,
    input.activityUnit,
    input.category
  );

  // Step 2: Look up emission factor
  let factor;

  if (input.customFactorId && organizationId) {
    factor = await lookupCustomFactor(input.customFactorId, organizationId);
  }

  if (!factor) {
    const factorUnit = mapToFactorUnit(converted.unit, input.category);
    factor = await lookupEmissionFactor({
      category: input.category,
      subcategory: input.subcategory,
      region: input.region,
      unit: factorUnit,
      year: input.year,
    });
  }

  if (!factor) {
    throw new Error(
      `No emission factor found for category="${input.category}", ` +
        `subcategory="${input.subcategory || "none"}", region="${input.region}", ` +
        `unit="${converted.unit}". Please add a custom emission factor or try a different region.`
    );
  }

  // Step 3: Calculate emissions
  const co2e = converted.value * factor.co2ePerUnit;

  // Step 4: Break down by gas type (proportional estimate if per-gas factors not available)
  // The database stores co2PerUnit, ch4PerUnit, n2oPerUnit separately
  // We need to fetch the full factor for gas breakdown
  const fullFactor = await getFullFactor(factor.id, input.category);
  const co2 = fullFactor?.co2PerUnit
    ? converted.value * fullFactor.co2PerUnit
    : co2e * 0.95;
  const ch4 = fullFactor?.ch4PerUnit
    ? converted.value * fullFactor.ch4PerUnit
    : co2e * 0.03;
  const n2o = fullFactor?.n2oPerUnit
    ? converted.value * fullFactor.n2oPerUnit
    : co2e * 0.02;

  // Step 5: Build methodology explanation
  const methodology = buildMethodology(input, converted, factor, co2e);

  return {
    co2e,
    co2,
    ch4,
    n2o,
    emissionFactor: factor.co2ePerUnit,
    emissionFactorSource: `${factor.source} (${factor.year})`,
    calculationMethod: `${factor.co2ePerUnit} ${factor.unit} × ${converted.value.toFixed(2)} ${converted.unit}`,
    methodology,
  };
}

async function getFullFactor(
  factorId: string,
  _category: string
): Promise<{
  co2PerUnit: number | null;
  ch4PerUnit: number | null;
  n2oPerUnit: number | null;
} | null> {
  // Try standard emission factor first
  const { prisma } = await import("@/lib/prisma");

  const standard = await prisma.emissionFactor.findUnique({
    where: { id: factorId },
    select: { co2PerUnit: true, ch4PerUnit: true, n2oPerUnit: true },
  });

  if (standard) return standard;

  // Custom factor doesn't have gas breakdown
  return null;
}

function buildMethodology(
  input: CalculationInput,
  converted: { value: number; unit: string; conversionFactor: number },
  factor: { co2ePerUnit: number; unit: string; source: string; year: number; region: string },
  co2e: number
): string {
  const parts: string[] = [];

  parts.push(
    `Activity: ${input.activityValue} ${input.activityUnit} of ${input.category}` +
      (input.subcategory ? ` (${input.subcategory})` : "")
  );

  if (converted.conversionFactor !== 1) {
    parts.push(
      `Unit conversion: ${input.activityValue} ${input.activityUnit} → ${converted.value.toFixed(4)} ${converted.unit} (factor: ${converted.conversionFactor})`
    );
  }

  parts.push(
    `Emission factor: ${factor.co2ePerUnit} ${factor.unit} (Source: ${factor.source} ${factor.year}, Region: ${factor.region})`
  );

  parts.push(
    `Calculation: ${converted.value.toFixed(4)} ${converted.unit} × ${factor.co2ePerUnit} ${factor.unit} = ${co2e.toFixed(4)} kgCO2e`
  );

  parts.push(`Total: ${(co2e / 1000).toFixed(4)} tCO2e`);

  return parts.join("\n");
}
