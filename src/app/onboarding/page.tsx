"use client";

import { Stepper } from "@/components/onboarding/stepper";
import { CompanyForm } from "@/components/onboarding/company-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingStep1Page() {
  return (
    <div className="space-y-8">
      <Stepper currentStep={1} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tell us about your company</CardTitle>
          <CardDescription>
            This information helps us tailor your ESG reporting requirements and
            recommend the right compliance frameworks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm />
        </CardContent>
      </Card>
    </div>
  );
}
