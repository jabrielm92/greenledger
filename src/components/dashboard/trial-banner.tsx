"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TrialBanner() {
  const { user } = useCurrentUser();

  if (!user || user.plan !== "FREE_TRIAL") return null;

  const trialEndsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;

  let daysRemaining = 14;
  if (trialEndsAt) {
    daysRemaining = Math.max(
      0,
      Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000)
    );
  }

  const expired = daysRemaining <= 0;
  const urgent = daysRemaining <= 3 && !expired;

  // Don't show banner if more than 3 days remaining
  if (!expired && !urgent) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3",
        expired
          ? "bg-red-50 border border-red-200"
          : "bg-amber-50 border border-amber-200"
      )}
    >
      {expired ? (
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
      ) : (
        <Clock className="h-5 w-5 shrink-0 text-amber-600" />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            expired ? "text-red-800" : "text-amber-800"
          )}
        >
          {expired
            ? "Your free trial has expired"
            : `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`}
        </p>
        <p
          className={cn(
            "text-xs",
            expired ? "text-red-600" : "text-amber-600"
          )}
        >
          {expired
            ? "You can view your data, but creating or editing is disabled. Upgrade to restore full access."
            : "Upgrade now to keep uninterrupted access to all features."}
        </p>
      </div>

      <Button
        asChild
        size="sm"
        className={cn(
          "shrink-0",
          expired
            ? "bg-red-600 hover:bg-red-700"
            : "bg-amber-600 hover:bg-amber-700"
        )}
      >
        <Link href="/dashboard/settings/billing">
          Upgrade
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}
