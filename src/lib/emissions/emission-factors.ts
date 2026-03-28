import { prisma } from "@/lib/prisma";
import type { EmissionFactorLookup } from "@/types";

interface FactorQuery {
  category: string;
  subcategory?: string;
  region: string;
  unit: string;
  year?: number;
}

// In-memory cache for emission factor lookups (1-hour TTL).
// Emission factors change rarely, so caching avoids repeated DB queries.
const factorCache = new Map<string, { data: EmissionFactorLookup | null; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function buildCacheKey(query: FactorQuery): string {
  return `${query.category}:${query.subcategory || ""}:${query.region}:${query.unit}:${query.year || "latest"}`;
}

/**
 * Look up an emission factor from the database.
 * Falls back to GLOBAL region if specific region not found.
 * Results are cached in-memory for 1 hour.
 */
export async function lookupEmissionFactor(
  query: FactorQuery
): Promise<EmissionFactorLookup | null> {
  // Check cache first
  const cacheKey = buildCacheKey(query);
  const cached = factorCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const result = await lookupEmissionFactorUncached(query);

  // Store in cache
  factorCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

  // Periodic cache cleanup (keep size bounded)
  if (factorCache.size > 500) {
    const now = Date.now();
    for (const [key, entry] of factorCache) {
      if (entry.expiresAt < now) factorCache.delete(key);
    }
  }

  return result;
}

async function lookupEmissionFactorUncached(
  query: FactorQuery
): Promise<EmissionFactorLookup | null> {
  // Build year filter: find the most recent factor up to the requested year
  const yearFilter = query.year ? { year: { lte: query.year } } : {};

  // Try exact match first
  let factor = await prisma.emissionFactor.findFirst({
    where: {
      category: query.category,
      subcategory: query.subcategory || undefined,
      region: query.region,
      unit: query.unit,
      isActive: true,
      ...yearFilter,
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
        ...yearFilter,
      },
      orderBy: { year: "desc" },
    });
  }

  // Fallback: ignore subcategory and try any matching factor for this category
  if (!factor) {
    factor = await prisma.emissionFactor.findFirst({
      where: {
        category: query.category,
        region: { in: [query.region, "GLOBAL"] },
        unit: query.unit,
        isActive: true,
        ...yearFilter,
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
