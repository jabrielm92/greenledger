"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  shortTitle: string;
}

const steps: Step[] = [
  { number: 1, title: "Company Profile", shortTitle: "Company" },
  { number: 2, title: "Frameworks", shortTitle: "Frameworks" },
  { number: 3, title: "Plan", shortTitle: "Plan" },
  { number: 4, title: "Integrations", shortTitle: "Integrate" },
  { number: 5, title: "Complete", shortTitle: "Done" },
];

interface StepperProps {
  currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <nav aria-label="Onboarding progress" className="w-full overflow-x-auto">
      <ol className="flex items-center justify-between min-w-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li key={step.number} className="flex items-center min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-colors shrink-0",
                    isCompleted &&
                      "border-emerald-600 bg-emerald-600 text-white",
                    isCurrent &&
                      "border-emerald-600 bg-white text-emerald-600",
                    !isCompleted &&
                      !isCurrent &&
                      "border-slate-300 bg-white text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[10px] sm:text-xs font-medium text-center truncate max-w-[56px] sm:max-w-none",
                    isCurrent ? "text-emerald-600" : "text-slate-500"
                  )}
                >
                  <span className="sm:hidden">{step.shortTitle}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-1 sm:mx-2 h-0.5 w-6 sm:w-14 md:w-20 shrink-0",
                    isCompleted ? "bg-emerald-600" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
