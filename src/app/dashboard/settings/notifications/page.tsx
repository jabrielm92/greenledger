"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";

interface NotificationPreferences {
  extractionComplete: boolean;
  extractionFailed: boolean;
  emissionAutoCreated: boolean;
  supplierDetected: boolean;
  complianceMilestone: boolean;
  reportStale: boolean;
  deadlineReminder: boolean;
  emailExtractionFailed: boolean;
  emailDeadlineReminder: boolean;
  emailSupplierHighRisk: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  extractionComplete: true,
  extractionFailed: true,
  emissionAutoCreated: true,
  supplierDetected: true,
  complianceMilestone: true,
  reportStale: true,
  deadlineReminder: true,
  emailExtractionFailed: true,
  emailDeadlineReminder: true,
  emailSupplierHighRisk: true,
};

const IN_APP_NOTIFICATIONS = [
  { key: "extractionComplete" as const, label: "Document extraction complete", description: "When AI finishes extracting data from an uploaded document" },
  { key: "extractionFailed" as const, label: "Document extraction failed", description: "When AI extraction encounters an error" },
  { key: "emissionAutoCreated" as const, label: "Emission entry auto-created", description: "When an emission entry is automatically generated from a document" },
  { key: "supplierDetected" as const, label: "New supplier detected", description: "When a supplier is auto-detected from an invoice or report" },
  { key: "complianceMilestone" as const, label: "Compliance milestone reached", description: "When framework completion crosses 25%, 50%, or 75%" },
  { key: "reportStale" as const, label: "Report has new data available", description: "When new emissions data makes a draft report outdated" },
  { key: "deadlineReminder" as const, label: "Framework deadline approaching", description: "30 and 7 days before a compliance deadline" },
];

const EMAIL_NOTIFICATIONS = [
  { key: "emailExtractionFailed" as const, label: "Extraction failures", description: "Email when document extraction fails" },
  { key: "emailDeadlineReminder" as const, label: "Compliance deadline warnings", description: "Email at 30 and 7 days before deadlines" },
  { key: "emailSupplierHighRisk" as const, label: "High-risk supplier alerts", description: "Email when a supplier is scored as HIGH or CRITICAL risk" },
];

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/notifications/preferences");
        if (res.ok) {
          const data = await res.json();
          setPrefs({ ...DEFAULT_PREFS, ...data });
        }
      } catch {
        // Use defaults on error
      } finally {
        setIsLoading(false);
      }
    }
    loadPrefs();
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // Silently handle — prefs will persist locally
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
        <p className="text-sm text-slate-500">
          Choose which events trigger in-app and email notifications
        </p>
      </div>

      {/* In-app notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">In-App Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {IN_APP_NOTIFICATIONS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-1"
            >
              <div className="min-w-0">
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {EMAIL_NOTIFICATIONS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-1"
            >
              <div className="min-w-0">
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {success && <p className="text-sm text-emerald-600">Preferences saved.</p>}

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}
