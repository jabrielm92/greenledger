"use client";

import { useRouter } from "next/navigation";
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
import { ArrowRight, BookOpen, FileUp, Link2 } from "lucide-react";

const integrations = [
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    description:
      "Auto-import financial data for emissions calculation. Syncs invoices, expenses, and vendor data.",
    icon: BookOpen,
    available: true,
    dataPoints: [
      "Purchase invoices",
      "Utility expenses",
      "Travel expenses",
      "Vendor information",
    ],
  },
  {
    id: "xero",
    name: "Xero",
    description:
      "Import accounting data from Xero for automated ESG data collection.",
    icon: Link2,
    available: false,
    dataPoints: ["Coming soon"],
  },
  {
    id: "manual",
    name: "Manual Upload",
    description:
      "Skip integrations for now. You can upload documents manually and connect integrations later.",
    icon: FileUp,
    available: true,
    dataPoints: [
      "Upload utility bills",
      "Upload fuel receipts",
      "Upload invoices",
      "Upload any ESG document",
    ],
  },
];

export default function OnboardingStep3Page() {
  const router = useRouter();
  const { setStep } = useOnboardingStore();

  function handleSkip() {
    setStep(4);
    router.push("/onboarding/complete");
  }

  function handleConnectQuickBooks() {
    // In production, this would initiate QuickBooks OAuth
    // For now, skip to completion
    setStep(4);
    router.push("/onboarding/complete");
  }

  return (
    <div className="space-y-8">
      <Stepper currentStep={3} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connect your tools</CardTitle>
          <CardDescription>
            Connect your accounting software to automatically import data, or
            skip and upload documents manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <div
                key={integration.id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{integration.name}</h3>
                    {!integration.available && (
                      <Badge variant="secondary">Coming soon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {integration.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-1 text-xs text-slate-400">
                    {integration.dataPoints.map((point) => (
                      <li key={point} className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1">
                    {integration.id === "quickbooks" && (
                      <Button
                        size="sm"
                        onClick={handleConnectQuickBooks}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Connect
                      </Button>
                    )}
                    {integration.id === "manual" && (
                      <Button size="sm" variant="outline" onClick={handleSkip}>
                        Skip for now
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                    {integration.id === "xero" && (
                      <Button size="sm" variant="outline" disabled>
                        Coming soon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
