"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding-store";
import { FRAMEWORKS, EU_COUNTRIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function IndustryPicker() {
  const router = useRouter();
  const { country, setSelectedFrameworks, setStep } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(() => {
    // Auto-select recommended frameworks
    return FRAMEWORKS.filter((fw) => fw.recommended(country)).map((fw) => fw.id);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleFramework(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  async function handleContinue() {
    if (selected.length === 0) {
      setError("Please select at least one framework");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "select-frameworks",
          frameworks: selected,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to save framework selection");
        return;
      }

      setSelectedFrameworks(selected);
      setStep(3);
      router.push("/onboarding/integrations");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const isRecommended = (fw: (typeof FRAMEWORKS)[number]) => {
    return fw.recommended(country);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        {FRAMEWORKS.map((fw) => {
          const isSelected = selected.includes(fw.id);
          const recommended = isRecommended(fw);

          return (
            <Card
              key={fw.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "border-emerald-600 ring-1 ring-emerald-600"
              )}
              onClick={() => toggleFramework(fw.id)}
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors",
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300"
                  )}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{fw.name}</CardTitle>
                    {recommended && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700"
                      >
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {fw.description}
                  </CardDescription>
                  <p className="text-xs text-slate-400">
                    Regions: {fw.regions.join(", ")}
                  </p>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {country && EU_COUNTRIES.includes(country as typeof EU_COUNTRIES[number]) && (
        <p className="text-sm text-slate-500">
          Based on your EU location, we recommend CSRD/ESRS reporting.
        </p>
      )}

      <Button
        onClick={handleContinue}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading || selected.length === 0}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue
      </Button>
    </div>
  );
}
