import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.LatestApiVersion,
  typescript: true,
});

/**
 * Hardcoded plan definitions — no manual Stripe dashboard setup required.
 * Products and prices are auto-provisioned via the Stripe API on first checkout.
 */

const PLAN_CONFIGS = {
  BASE: {
    name: "GreenLedger Base",
    description: "ESG compliance essentials for small businesses",
    priceAmountCents: 24900, // $249/mo
    lookupKey: "greenledger_base_monthly",
  },
  PROFESSIONAL: {
    name: "GreenLedger Professional",
    description: "Advanced ESG compliance with multi-framework support",
    priceAmountCents: 39900, // $399/mo
    lookupKey: "greenledger_professional_monthly",
  },
  ENTERPRISE: {
    name: "GreenLedger Enterprise",
    description: "Unlimited ESG compliance for growing organizations",
    priceAmountCents: 69900, // $699/mo
    lookupKey: "greenledger_enterprise_monthly",
  },
} as const;

export const PLANS = {
  FREE_TRIAL: {
    name: "Free Trial",
    price: 0,
    limits: {
      documents: 50,
      extractions: 50,
      reports: 2,
      users: 3,
      suppliers: 25,
      frameworks: 3,
    },
  },
  BASE: {
    name: "Base",
    price: 249,
    limits: {
      documents: 50,
      extractions: 50,
      reports: 2,
      users: 1,
      suppliers: 5,
      frameworks: 1,
    },
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 399,
    limits: {
      documents: 200,
      extractions: 200,
      reports: 12,
      users: 3,
      suppliers: 25,
      frameworks: 3,
    },
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 699,
    limits: {
      documents: Infinity,
      extractions: Infinity,
      reports: Infinity,
      users: Infinity,
      suppliers: Infinity,
      frameworks: Infinity,
    },
  },
} as const;

export type PlanTier = keyof typeof PLANS;
export type PaidPlanTier = "BASE" | "PROFESSIONAL" | "ENTERPRISE";
export type ResourceType = keyof (typeof PLANS)["BASE"]["limits"];

// In-memory cache so we only hit Stripe once per cold start
const priceIdCache: Partial<Record<PaidPlanTier, string>> = {};

/**
 * Get or create the Stripe Price ID for a paid plan.
 * Uses lookup_key to find existing prices, creates product + price if missing.
 * Results are cached in memory for the lifetime of the process.
 */
export async function getStripePriceId(tier: PaidPlanTier): Promise<string> {
  // Return cached value if available
  if (priceIdCache[tier]) {
    return priceIdCache[tier]!;
  }

  const config = PLAN_CONFIGS[tier];

  // Try to find an existing price by lookup_key
  const existingPrices = await stripe.prices.list({
    lookup_keys: [config.lookupKey],
    limit: 1,
  });

  if (existingPrices.data.length > 0) {
    priceIdCache[tier] = existingPrices.data[0].id;
    return existingPrices.data[0].id;
  }

  // No existing price — create product and price
  const product = await stripe.products.create({
    name: config.name,
    description: config.description,
    metadata: { tier },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: config.priceAmountCents,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: config.lookupKey,
    metadata: { tier },
  });

  priceIdCache[tier] = price.id;
  return price.id;
}

/**
 * Check whether an organization has capacity for a given resource.
 */
export async function checkPlanLimits(
  organizationId: string,
  resource: ResourceType
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { plan: true, stripeCurrentPeriodEnd: true },
  });

  if (!org) {
    return { allowed: false, current: 0, limit: 0 };
  }

  const plan = PLANS[org.plan as PlanTier] || PLANS.FREE_TRIAL;
  const limit = plan.limits[resource];

  if (limit === Infinity) {
    return { allowed: true, current: 0, limit };
  }

  const current = await getCurrentUsage(organizationId, resource, org.stripeCurrentPeriodEnd);

  return {
    allowed: current < limit,
    current,
    limit,
  };
}

async function getCurrentUsage(
  organizationId: string,
  resource: ResourceType,
  periodEnd: Date | null
): Promise<number> {
  const periodStart = periodEnd
    ? new Date(new Date(periodEnd).setMonth(new Date(periodEnd).getMonth() - 1))
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  switch (resource) {
    case "documents":
      return prisma.document.count({
        where: {
          organizationId,
          createdAt: { gte: periodStart },
        },
      });

    case "extractions":
      return prisma.document.count({
        where: {
          organizationId,
          status: "EXTRACTED",
          createdAt: { gte: periodStart },
        },
      });

    case "reports":
      return prisma.report.count({
        where: {
          organizationId,
          createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      });

    case "users":
      return prisma.user.count({
        where: { organizationId },
      });

    case "suppliers":
      return prisma.supplier.count({
        where: { organizationId },
      });

    case "frameworks":
      const reports = await prisma.report.findMany({
        where: { organizationId },
        select: { frameworkType: true },
        distinct: ["frameworkType"],
      });
      return reports.length;

    default:
      return 0;
  }
}

/**
 * Get usage summary for all resource types for billing display.
 */
export async function getUsageSummary(
  organizationId: string
): Promise<Record<ResourceType, { current: number; limit: number }>> {
  const resources: ResourceType[] = [
    "documents",
    "extractions",
    "reports",
    "users",
    "suppliers",
    "frameworks",
  ];

  const results: Record<string, { current: number; limit: number }> = {};

  for (const resource of resources) {
    const { current, limit } = await checkPlanLimits(organizationId, resource);
    results[resource] = { current, limit };
  }

  return results as Record<ResourceType, { current: number; limit: number }>;
}
