"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PlanCard } from "@/components/billing/plan-card";
import { UsageMeter } from "@/components/billing/usage-meter";
import { InvoiceList } from "@/components/billing/invoice-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Settings } from "lucide-react";

const PLAN_FEATURES = {
  BASE: {
    employees: "100",
    frameworks: "1",
    adminUsers: "1",
    suppliers: "5",
    documents: "50",
    reports: "2",
    aiExtractions: "50",
    quickbooks: false,
    auditAssistance: false,
    support: "Email",
  },
  PROFESSIONAL: {
    employees: "300",
    frameworks: "3",
    adminUsers: "3",
    suppliers: "25",
    documents: "200",
    reports: "12",
    aiExtractions: "200",
    quickbooks: true,
    auditAssistance: false,
    support: "Priority email",
  },
  ENTERPRISE: {
    employees: "500",
    frameworks: "Unlimited",
    adminUsers: "Unlimited",
    suppliers: "Unlimited",
    documents: "Unlimited",
    reports: "Unlimited",
    aiExtractions: "Unlimited",
    quickbooks: true,
    auditAssistance: true,
    support: "Priority + Slack",
  },
};

interface UsageData {
  documents: { current: number; limit: number };
  extractions: { current: number; limit: number };
  reports: { current: number; limit: number };
  users: { current: number; limit: number };
  suppliers: { current: number; limit: number };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl?: string;
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [currentPlan, setCurrentPlan] = useState("FREE_TRIAL");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBillingData() {
      try {
        const res = await fetch("/api/billing");
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.plan || "FREE_TRIAL");
          setUsage(data.usage || null);
          setInvoices(data.invoices || []);
        }
      } catch (err) {
        console.error("Failed to fetch billing data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBillingData();
  }, []);

  const handleSelectPlan = async (tier: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    } catch (err) {
      console.error("Portal failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription and view usage"
      >
        {currentPlan !== "FREE_TRIAL" && (
          <Button variant="outline" onClick={handleManageBilling}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>
        )}
      </PageHeader>

      {success && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="py-4">
            <p className="text-sm text-emerald-700">
              Your subscription has been activated successfully.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current plan summary */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Plan</CardTitle>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700"
            >
              {currentPlan === "FREE_TRIAL"
                ? "Free Trial"
                : currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            {currentPlan === "FREE_TRIAL"
              ? "You are on the 14-day free trial with Professional features. Upgrade to continue after the trial."
              : `You are subscribed to the ${currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase()} plan.`}
          </p>
        </CardContent>
      </Card>

      {/* Usage meters */}
      {usage && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700">
            Current Usage
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <UsageMeter
              label="Documents"
              current={usage.documents.current}
              limit={usage.documents.limit}
              unit="this month"
            />
            <UsageMeter
              label="AI Extractions"
              current={usage.extractions.current}
              limit={usage.extractions.limit}
              unit="this month"
            />
            <UsageMeter
              label="Reports"
              current={usage.reports.current}
              limit={usage.reports.limit}
              unit="this year"
            />
            <UsageMeter
              label="Team Members"
              current={usage.users.current}
              limit={usage.users.limit}
            />
            <UsageMeter
              label="Suppliers"
              current={usage.suppliers.current}
              limit={usage.suppliers.limit}
            />
          </div>
        </div>
      )}

      {/* Plan comparison */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-700">
          Available Plans
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          <PlanCard
            name="Base"
            price={249}
            tier="BASE"
            features={PLAN_FEATURES.BASE}
            isCurrent={currentPlan === "BASE"}
            onSelect={handleSelectPlan}
          />
          <PlanCard
            name="Professional"
            price={399}
            tier="PROFESSIONAL"
            features={PLAN_FEATURES.PROFESSIONAL}
            isCurrent={currentPlan === "PROFESSIONAL"}
            isPopular
            onSelect={handleSelectPlan}
          />
          <PlanCard
            name="Enterprise"
            price={699}
            tier="ENTERPRISE"
            features={PLAN_FEATURES.ENTERPRISE}
            isCurrent={currentPlan === "ENTERPRISE"}
            onSelect={handleSelectPlan}
          />
        </div>
      </div>

      {/* Invoices */}
      <InvoiceList invoices={invoices} isLoading={isLoading} />
    </div>
  );
}
