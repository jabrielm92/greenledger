import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.LatestApiVersion,
  typescript: true,
});

/**
 * Plan definitions with feature limits.
 */
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
    stripePriceId: process.env.STRIPE_BASE_PRICE_ID || "",
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
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
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
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
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
export type ResourceType = keyof (typeof PLANS)["BASE"]["limits"];

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
  // Use the current billing period start (30 days before period end, or first of month)
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
      // Count distinct framework types on reports
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
