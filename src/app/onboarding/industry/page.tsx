"use client";

import { Stepper } from "@/components/onboarding/stepper";
import { IndustryPicker } from "@/components/onboarding/industry-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingStep2Page() {
  return (
    <div className="space-y-8">
      <Stepper currentStep={2} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Select compliance frameworks
          </CardTitle>
          <CardDescription>
            Choose the reporting frameworks relevant to your business.
            We&apos;ve pre-selected recommendations based on your location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IndustryPicker />
        </CardContent>
      </Card>
    </div>
  );
}
