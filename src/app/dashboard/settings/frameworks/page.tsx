"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AvailableFramework {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  regions: string[];
}

interface ActiveFramework {
  id: string;
  frameworkId: string;
  name: string;
  displayName: string;
  status: string;
  completionPct: number;
  targetYear: number;
}

export default function FrameworksSettingsPage() {
  const [available, setAvailable] = useState<AvailableFramework[]>([]);
  const [active, setActive] = useState<ActiveFramework[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchFrameworks() {
      try {
        const res = await fetch("/api/organization/frameworks");
        if (res.ok) {
          const data = await res.json();
          setAvailable(data.available);
          setActive(data.active);
          setSelected(data.active.map((a: ActiveFramework) => a.name));
        }
      } catch (err) {
        console.error("Failed to fetch frameworks:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFrameworks();
  }, []);

  function toggleFramework(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
    setSuccess(false);
  }

  async function handleSave() {
    if (selected.length === 0) {
      setError("Please select at least one framework");
      return;
    }

    setError("");
    setSuccess(false);
    setIsSaving(true);

    try {
      const res = await fetch("/api/organization/frameworks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frameworks: selected }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save");
      }

      const data = await res.json();
      setActive(data.active);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  const hasChanges =
    !isLoading &&
    JSON.stringify([...selected].sort()) !==
      JSON.stringify([...active.map((a) => a.name)].sort());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance Frameworks</CardTitle>
          <CardDescription>
            Select the reporting frameworks your organization is targeting.
            This determines your compliance score and dashboard metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {available.length === 0 ? (
            <p className="text-sm text-slate-500">
              No frameworks available. Please contact support.
            </p>
          ) : (
            <div className="grid gap-3">
              {available.map((fw) => {
                const isSelected = selected.includes(fw.name);
                const activeRecord = active.find((a) => a.name === fw.name);

                return (
                  <div
                    key={fw.id}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm",
                      isSelected
                        ? "border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/30"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    onClick={() => toggleFramework(fw.name)}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors mt-0.5",
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300"
                      )}
                    >
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-900">
                          {fw.displayName}
                        </span>
                        {activeRecord && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 text-xs"
                          >
                            {Math.round(activeRecord.completionPct)}% complete
                          </Badge>
                        )}
                      </div>
                      {fw.description && (
                        <p className="text-sm text-slate-500 mt-0.5">
                          {fw.description}
                        </p>
                      )}
                      {fw.regions.length > 0 && (
                        <p className="text-xs text-slate-400 mt-1">
                          Regions: {fw.regions.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-600">Frameworks updated successfully.</p>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving || selected.length === 0 || !hasChanges}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/frameworks">
                View Framework Guide
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
