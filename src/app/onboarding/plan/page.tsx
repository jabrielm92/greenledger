"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Stepper } from "@/components/onboarding/stepper";
import { useOnboardingStore } from "@/store/onboarding-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    tier: "FREE_TRIAL",
    name: "Free Trial",
    price: "$0",
    period: "14 days",
    description: "Try all Professional features free for 14 days",
    features: [
      "Full Professional plan features",
      "Up to 300 employees",
      "3 compliance frameworks",
      "200 AI extractions/month",
      "No credit card required",
    ],
    highlighted: false,
  },
  {
    tier: "BASE",
    name: "Base",
    price: "$249",
    period: "/month",
    description: "For small teams getting started with ESG reporting",
    features: [
      "Up to 100 employees",
      "1 compliance framework",
      "50 documents/month",
      "50 AI extractions/month",
      "2 reports/year",
    ],
    highlighted: false,
  },
  {
    tier: "PROFESSIONAL",
    name: "Professional",
    price: "$399",
    period: "/month",
    description: "For growing companies with multiple reporting needs",
    badge: "Most Popular",
    features: [
      "Up to 300 employees",
      "3 compliance frameworks",
      "200 documents/month",
      "200 AI extractions/month",
      "12 reports/year",
      "QuickBooks integration",
    ],
    highlighted: true,
  },
  {
    tier: "ENTERPRISE",
    name: "Enterprise",
    price: "$699",
    period: "/month",
    description: "For organizations needing full-scale compliance",
    features: [
      "Up to 500 employees",
      "Unlimited frameworks",
      "Unlimited documents",
      "Unlimited AI extractions",
      "Unlimited reports",
      "Audit assistance",
    ],
    highlighted: false,
  },
];

function PlanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setStep } = useOnboardingStore();
  const [selectedTier, setSelectedTier] = useState("FREE_TRIAL");
  const [isLoading, setIsLoading] = useState(false);
  const upgraded = searchParams.get("upgraded") === "true";

  // If returning from Stripe success, proceed to integrations
  if (upgraded) {
    return (
      <div className="space-y-8">
        <Stepper currentStep={3} />
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-brand-secondary">
              Plan activated!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your subscription is now active. Let&apos;s continue setting up.
            </p>
            <Button
              onClick={() => {
                setStep(4);
                router.push("/onboarding/integrations");
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleContinue() {
    setIsLoading(true);

    if (selectedTier === "FREE_TRIAL") {
      // Continue without payment
      setStep(4);
      router.push("/onboarding/integrations");
      return;
    }

    // Initiate Stripe Checkout
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedTier, returnTo: "onboarding" }),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }

      // If checkout fails, let them continue on free trial
      setStep(4);
      router.push("/onboarding/integrations");
    } catch {
      setStep(4);
      router.push("/onboarding/integrations");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Stepper currentStep={3} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Choose your plan</CardTitle>
          <CardDescription>
            Start with a free trial or pick the plan that fits your needs.
            You can change plans anytime from settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.tier}
                onClick={() => setSelectedTier(plan.tier)}
                className={cn(
                  "relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md",
                  selectedTier === plan.tier
                    ? "border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300",
                  plan.highlighted && selectedTier !== plan.tier && "border-emerald-200"
                )}
              >
                {plan.badge && (
                  <Badge className="absolute -top-2.5 right-3 bg-emerald-600 text-white">
                    {plan.badge}
                  </Badge>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-brand-secondary flex items-center gap-1.5">
                      {plan.tier === "FREE_TRIAL" && (
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                      )}
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-brand-secondary">
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 mt-1",
                      selectedTier === plan.tier
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300"
                    )}
                  >
                    {selectedTier === plan.tier && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {plan.description}
                </p>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedTier === "FREE_TRIAL"
              ? "Start Free Trial"
              : `Subscribe to ${plans.find((p) => p.tier === selectedTier)?.name}`}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPlanPage() {
  return (
    <Suspense>
      <PlanPageContent />
    </Suspense>
  );
}
