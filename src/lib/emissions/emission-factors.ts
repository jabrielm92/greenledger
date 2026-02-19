import { prisma } from "@/lib/prisma";
import type { EmissionFactorLookup } from "@/types";

interface FactorQuery {
  category: string;
  subcategory?: string;
  region: string;
  unit: string;
  year?: number;
}

/**
 * Look up an emission factor from the database.
 * Falls back to GLOBAL region if specific region not found.
 */
export async function lookupEmissionFactor(
  query: FactorQuery
): Promise<EmissionFactorLookup | null> {
  // Try exact match first
  let factor = await prisma.emissionFactor.findFirst({
    where: {
      category: query.category,
      subcategory: query.subcategory || undefined,
      region: query.region,
      unit: query.unit,
      isActive: true,
      ...(query.year ? { year: query.year } : {}),
    },
    orderBy: { year: "desc" },
  });

  // Fallback to GLOBAL region
  if (!factor && query.region !== "GLOBAL") {
    factor = await prisma.emissionFactor.findFirst({
      where: {
        category: query.category,
        subcategory: query.subcategory || undefined,
        region: "GLOBAL",
        unit: query.unit,
        isActive: true,
        ...(query.year ? { year: query.year } : {}),
      },
      orderBy: { year: "desc" },
    });
  }

  // Fallback without subcategory
  if (!factor && query.subcategory) {
    factor = await prisma.emissionFactor.findFirst({
      where: {
        category: query.category,
        region: { in: [query.region, "GLOBAL"] },
        unit: query.unit,
        isActive: true,
      },
      orderBy: { year: "desc" },
    });
  }

  if (!factor) return null;

  return {
    id: factor.id,
    category: factor.category,
    subcategory: factor.subcategory ?? undefined,
    region: factor.region,
    unit: factor.unit,
    co2ePerUnit: factor.co2ePerUnit,
    source: factor.source,
    year: factor.year,
  };
}

/**
 * Look up a custom emission factor by ID.
 */
export async function lookupCustomFactor(
  factorId: string,
  organizationId: string
): Promise<EmissionFactorLookup | null> {
  const factor = await prisma.customEmissionFactor.findFirst({
    where: {
      id: factorId,
      organizationId,
    },
  });

  if (!factor) return null;

  return {
    id: factor.id,
    category: factor.category,
    region: "CUSTOM",
    unit: factor.unit,
    co2ePerUnit: factor.co2ePerUnit,
    source: factor.source,
    year: new Date().getFullYear(),
  };
}

/**
 * List available emission factors for a category and region.
 */
export async function listEmissionFactors(
  category?: string,
  region?: string
): Promise<EmissionFactorLookup[]> {
  const factors = await prisma.emissionFactor.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(region ? { region: { in: [region, "GLOBAL"] } } : {}),
      isActive: true,
    },
    orderBy: [{ category: "asc" }, { region: "asc" }, { year: "desc" }],
  });

  return factors.map((f) => ({
    id: f.id,
    category: f.category,
    subcategory: f.subcategory ?? undefined,
    region: f.region,
    unit: f.unit,
    co2ePerUnit: f.co2ePerUnit,
    source: f.source,
    year: f.year,
  }));
}
