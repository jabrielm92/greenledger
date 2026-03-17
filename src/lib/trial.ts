import { prisma } from "@/lib/prisma";

const TRIAL_DAYS = 14;
const GRACE_DAYS = 7;

export interface TrialStatus {
  isTrial: boolean;
  expired: boolean;
  graceExpired: boolean;
  daysRemaining: number;
  trialEndsAt: Date | null;
}

/**
 * Check trial access for an organization.
 * Returns trial status including whether the trial is expired,
 * in grace period, or fully locked.
 */
export async function checkTrialAccess(
  organizationId: string
): Promise<TrialStatus> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { plan: true, trialEndsAt: true, createdAt: true },
  });

  if (!org || org.plan !== "FREE_TRIAL") {
    return {
      isTrial: false,
      expired: false,
      graceExpired: false,
      daysRemaining: 0,
      trialEndsAt: null,
    };
  }

  const trialEndsAt = org.trialEndsAt ?? new Date(org.createdAt.getTime() + TRIAL_DAYS * 86400000);
  const now = Date.now();
  const msRemaining = trialEndsAt.getTime() - now;
  const daysRemaining = Math.ceil(msRemaining / 86400000);
  const expired = msRemaining <= 0;
  const graceEnd = trialEndsAt.getTime() + GRACE_DAYS * 86400000;
  const graceExpired = now > graceEnd;

  return {
    isTrial: true,
    expired,
    graceExpired,
    daysRemaining: Math.max(0, daysRemaining),
    trialEndsAt,
  };
}

/**
 * Lightweight check for API endpoints. Returns a 403 response if trial
 * is expired, or null if access is allowed.
 */
export async function enforceTrialWriteAccess(
  organizationId: string
): Promise<{ error: string; upgradeUrl: string } | null> {
  const status = await checkTrialAccess(organizationId);

  if (!status.isTrial || !status.expired) {
    return null; // Paid plan or trial still active
  }

  if (status.graceExpired) {
    return {
      error: "Your free trial has ended. Upgrade to continue using GreenLedger.",
      upgradeUrl: "/dashboard/upgrade",
    };
  }

  return {
    error: "Your free trial has expired. You can still view your data, but creating or editing is disabled until you upgrade.",
    upgradeUrl: "/dashboard/settings/billing",
  };
}
