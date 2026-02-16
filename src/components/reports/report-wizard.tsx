"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReportWizardStore } from "@/store/report-wizard-store";
import { CSRD_TEMPLATE, getRequiredSectionCodes, getAllSectionCodes } from "@/lib/reports/csrd-template";
import { GRI_TEMPLATE } from "@/lib/reports/gri-template";
import { SectionEditor } from "./section-editor";
import { ReportPreview } from "./report-preview";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ReportWizardProps {
  reportingPeriods: { id: string; name: string }[];
}

const STEPS = [
  "Configuration",
  "Data Check",
  "Generate",
  "Review & Edit",
  "Export",
];

export function ReportWizard({ reportingPeriods }: ReportWizardProps) {
  const router = useRouter();
  const store = useReportWizardStore();

  const template =
    store.frameworkType === "GRI" ? GRI_TEMPLATE : CSRD_TEMPLATE;

  // Initialize selected sections with required ones
  useEffect(() => {
    if (store.selectedSections.length === 0) {
      store.setSelectedSections(getRequiredSectionCodes(template));
    }
  }, [store.frameworkType]);

  const handleGenerate = async () => {
    store.setIsGenerating(true);
    store.setGenerationProgress(0);

    try {
      // Create report first
      const createRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.title,
          frameworkType: store.frameworkType,
          reportingPeriodId: store.reportingPeriodId || undefined,
        }),
      });

      if (!createRes.ok) throw new Error("Failed to create report");
      const report = await createRes.json();
      store.setReportId(report.id);

      // Generate content
      const genRes = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.id,
          reportingPeriodId: store.reportingPeriodId,
          frameworkType: store.frameworkType,
          sections: store.selectedSections,
        }),
      });

      if (!genRes.ok) throw new Error("Generation failed");
      const result = await genRes.json();

      // Populate generated sections
      const content = result.generatedContent || result.finalContent;
      if (content) {
        for (const [code, data] of Object.entries(content)) {
          store.setGeneratedSection(code, data as never);
        }
      }

      store.setGenerationProgress(100);
      store.nextStep();
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleExport = async (format: "html" | "csv") => {
    if (!store.reportId) return;
    window.open(`/api/reports/${store.reportId}/export?format=${format}`, "_blank");
  };

  const handleSaveDraft = async () => {
    if (!store.reportId) return;
    await fetch(`/api/reports/${store.reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manualEdits: store.manualEdits,
        status: "DRAFT",
      }),
    });
    router.push("/dashboard/reports");
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i <= store.step && store.setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i === store.step
                  ? "bg-emerald-600 text-white"
                  : i < store.step
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < store.step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span
              className={`hidden text-sm sm:inline ${
                i === store.step ? "font-medium" : "text-slate-400"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px w-6 bg-slate-200" />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Configuration */}
      {store.step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Title</Label>
              <Input
                value={store.title}
                onChange={(e) => store.setTitle(e.target.value)}
                placeholder="e.g., CSRD Report FY2025"
              />
            </div>

            <div className="space-y-2">
              <Label>Framework</Label>
              <Select
                value={store.frameworkType}
                onValueChange={store.setFrameworkType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSRD">CSRD / ESRS</SelectItem>
                  <SelectItem value="GRI">GRI Standards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reporting Period</Label>
              <Select
                value={store.reportingPeriodId}
                onValueChange={store.setReportingPeriodId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {reportingPeriods.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Data completeness */}
      {store.step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Sections to Include
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {template.sections.map((section) => (
                <div key={section.code}>
                  <h4 className="mb-2 text-sm font-medium text-slate-700">
                    {section.code} — {section.title}
                  </h4>
                  {section.subsections?.map((sub) => (
                    <label
                      key={sub.code}
                      className="flex items-center gap-2 py-1 pl-4"
                    >
                      <input
                        type="checkbox"
                        checked={store.selectedSections.includes(sub.code)}
                        onChange={() => store.toggleSection(sub.code)}
                        className="accent-emerald-600"
                      />
                      <span className="text-sm">
                        {sub.code} — {sub.title}
                      </span>
                      {sub.required && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                          Required
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Generate */}
      {store.step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              AI will generate content for {store.selectedSections.length}{" "}
              sections using your emissions data and organizational context.
            </p>

            {store.isGenerating ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span className="text-sm">
                    Generating{" "}
                    {store.currentGeneratingSection
                      ? `section ${store.currentGeneratingSection}...`
                      : "..."}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${store.generationProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <Button
                onClick={handleGenerate}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={
                  !store.title || store.selectedSections.length === 0
                }
              >
                Generate Report
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Edit */}
      {store.step === 3 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {Object.values(store.generatedSections).map((section) => (
              <SectionEditor
                key={section.code}
                code={section.code}
                title={section.title}
                content={
                  store.manualEdits[section.code] ?? section.content
                }
                isAIGenerated={!store.manualEdits[section.code]}
                confidence={section.confidence}
                onEdit={(content) =>
                  store.setManualEdit(section.code, content)
                }
              />
            ))}
          </div>
          <div className="hidden lg:block">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-sm">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {Object.values(store.generatedSections).map((s) => (
                    <a
                      key={s.code}
                      href={`#section-${s.code}`}
                      className="block text-xs text-slate-500 hover:text-emerald-600"
                    >
                      {s.code} — {s.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 4: Export */}
      {store.step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReportPreview
              sections={Object.values(store.generatedSections).map((s) => ({
                ...s,
                dataPointsUsed: s.dataPointsUsed,
                methodology: "",
              }))}
            />

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSaveDraft} variant="outline">
                Save as Draft
              </Button>
              <Button
                onClick={() => handleExport("html")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Export PDF (Print)
              </Button>
              <Button
                onClick={() => handleExport("csv")}
                variant="outline"
              >
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={store.prevStep}
          disabled={store.step === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        {store.step < 4 && store.step !== 2 && (
          <Button onClick={store.nextStep}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
