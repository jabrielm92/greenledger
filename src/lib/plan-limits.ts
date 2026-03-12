/**
 * Plan limit enforcement re-exports.
 * The canonical implementation lives in src/lib/stripe.ts.
 * This module maps friendlier resource names to the stripe utility.
 */
import { checkPlanLimits as stripePlanCheck } from "@/lib/stripe";

type FriendlyResource = "documents" | "reports" | "suppliers" | "teamMembers" | "emissions";

const RESOURCE_MAP: Record<FriendlyResource, "documents" | "reports" | "suppliers" | "users" | "extractions" | "frameworks"> = {
  documents: "documents",
  reports: "reports",
  suppliers: "suppliers",
  teamMembers: "users",
  emissions: "documents", // emissions map to document extractions as a proxy
};

export async function checkPlanLimit(
  organizationId: string,
  resource: FriendlyResource
): Promise<{ allowed: boolean; current: number; limit: number; resource: string }> {
  const mappedResource = RESOURCE_MAP[resource];
  const result = await stripePlanCheck(organizationId, mappedResource);
  return { ...result, resource };
}
