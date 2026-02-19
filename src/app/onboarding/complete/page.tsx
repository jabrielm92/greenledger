"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { CheckCircle, ArrowRight, FileText, BarChart3, Upload } from "lucide-react";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const { companyName, selectedFrameworks, reset } = useOnboardingStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function completeOnboarding() {
      if (isCompleting || completed) return;
      setIsCompleting(true);

      try {
        await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete" }),
        });
        setCompleted(true);
      } catch (err) {
        console.error("Failed to complete onboarding:", err);
      } finally {
        setIsCompleting(false);
      }
    }

    completeOnboarding();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleGoToDashboard() {
    updateSession({});
    reset();
    router.push("/dashboard");
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      <Stepper currentStep={4} />

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">
            Your GreenLedger workspace is ready!
          </CardTitle>
          <CardDescription>
            {companyName
              ? `${companyName} is all set for ESG compliance tracking.`
              : "Your organization is all set for ESG compliance tracking."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4 space-y-3">
            {selectedFrameworks.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">
                  Frameworks: {selectedFrameworks.join(", ")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <BarChart3 className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">
                Reporting period: FY{currentYear}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Upload className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">
                Next step: Upload your first utility bill
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoToDashboard}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
