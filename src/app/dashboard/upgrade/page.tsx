"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, BarChart3, FileText, Upload, Users } from "lucide-react";

interface OrgStats {
  emissions: number;
  documents: number;
  reports: number;
  suppliers: number;
}

const PLANS = [
  {
    tier: "BASE",
    name: "Base",
    price: 249,
    features: ["100 employees", "1 compliance framework", "50 documents/mo", "Email support"],
  },
  {
    tier: "PROFESSIONAL",
    name: "Professional",
    price: 399,
    popular: true,
    features: ["300 employees", "3 compliance frameworks", "200 documents/mo", "QuickBooks integration", "Priority support"],
  },
  {
    tier: "ENTERPRISE",
    name: "Enterprise",
    price: 699,
    features: ["500 employees", "Unlimited frameworks", "Unlimited documents", "Audit assistance", "Priority + Slack support"],
  },
];

export default function UpgradePage() {
  const [stats, setStats] = useState<OrgStats>({ emissions: 0, documents: 0, reports: 0, suppliers: 0 });
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats({
            emissions: data.stats.totalScope1 + data.stats.totalScope2 + data.stats.totalScope3,
            documents: data.stats.documentsCount,
            reports: data.stats.reportsCount,
            suppliers: data.stats.suppliersCount,
          });
        }
      } catch {
        // Non-critical
      }
    }
    fetchStats();
  }, []);

  const handleUpgrade = async (tier: string) => {
    setUpgrading(tier);
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
    } catch {
      // Fallback
    } finally {
      setUpgrading(null);
    }
  };

  const statItems = [
    { label: "Emission entries", value: stats.emissions, icon: BarChart3, color: "text-emerald-600" },
    { label: "Documents", value: stats.documents, icon: Upload, color: "text-blue-600" },
    { label: "Reports", value: stats.reports, icon: FileText, color: "text-purple-600" },
    { label: "Suppliers", value: stats.suppliers, icon: Users, color: "text-amber-600" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Your free trial has ended
        </h1>
        <p className="mt-2 text-slate-500">
          Upgrade to restore full access to your GreenLedger data and features.
        </p>
      </div>

      {/* What they've built */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your data is safe and waiting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon className={`mx-auto h-6 w-6 ${item.color}`} />
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {typeof item.value === "number" && item.value > 0
                      ? item.value.toLocaleString()
                      : "0"}
                  </p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.tier}
            className={plan.popular ? "border-emerald-300 shadow-lg" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.popular && (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Most Popular
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold text-slate-900">
                ${plan.price}
                <span className="text-sm font-normal text-slate-500">/mo</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-500">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={upgrading !== null}
                className={
                  plan.popular
                    ? "w-full bg-emerald-600 hover:bg-emerald-700"
                    : "w-full"
                }
                variant={plan.popular ? "default" : "outline"}
              >
                {upgrading === plan.tier ? "Redirecting..." : "Upgrade"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400">
        All plans include a 30-day money-back guarantee. Cancel anytime.
      </p>
    </div>
  );
}
