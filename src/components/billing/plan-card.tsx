"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface PlanFeatures {
  employees: string;
  frameworks: string;
  adminUsers: string;
  suppliers: string;
  documents: string;
  reports: string;
  aiExtractions: string;
  quickbooks: boolean;
  auditAssistance: boolean;
  support: string;
}

interface PlanCardProps {
  name: string;
  price: number;
  tier: string;
  features: PlanFeatures;
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect?: (tier: string) => void;
}

export function PlanCard({
  name,
  price,
  tier,
  features,
  isCurrent,
  isPopular,
  onSelect,
}: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    if (!onSelect || isCurrent) return;
    setIsLoading(true);
    try {
      onSelect(tier);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`relative ${
        isPopular ? "border-emerald-500 shadow-md" : ""
      } ${isCurrent ? "border-blue-500" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-emerald-600">Most Popular</Badge>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-blue-600">Current Plan</Badge>
        </div>
      )}
      <CardHeader className="pt-6 text-center">
        <CardTitle className="text-lg">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-sm text-slate-500">/mo</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          <FeatureRow label={`Up to ${features.employees} employees`} included />
          <FeatureRow label={`${features.frameworks} framework(s)`} included />
          <FeatureRow label={`${features.adminUsers} admin user(s)`} included />
          <FeatureRow label={`${features.suppliers} suppliers`} included />
          <FeatureRow label={`${features.documents} documents/mo`} included />
          <FeatureRow label={`${features.reports} reports/year`} included />
          <FeatureRow label={`${features.aiExtractions} AI extractions/mo`} included />
          <FeatureRow
            label="QuickBooks integration"
            included={features.quickbooks}
          />
          <FeatureRow
            label="Audit assistance"
            included={features.auditAssistance}
          />
          <FeatureRow label={`${features.support} support`} included />
        </ul>

        <Button
          className={`w-full ${
            isCurrent
              ? "bg-slate-100 text-slate-500"
              : isPopular
              ? "bg-emerald-600 hover:bg-emerald-700"
              : ""
          }`}
          variant={isCurrent ? "ghost" : isPopular ? "default" : "outline"}
          disabled={isCurrent || isLoading}
          onClick={handleSelect}
        >
          {isCurrent
            ? "Current Plan"
            : isLoading
            ? "Redirecting..."
            : "Select Plan"}
        </Button>
      </CardContent>
    </Card>
  );
}

function FeatureRow({
  label,
  included,
}: {
  label: string;
  included: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      {included ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <X className="h-4 w-4 text-slate-300" />
      )}
      <span className={included ? "" : "text-slate-400"}>{label}</span>
    </li>
  );
}
