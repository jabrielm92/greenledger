"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText, Database } from "lucide-react";

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
  formats: string[];
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "emissions",
    label: "Emissions Data",
    description: "All emission entries with scope, category, CO2e, activity data, and calculation details",
    icon: <Database className="h-5 w-5 text-emerald-600" />,
    endpoint: "/api/emissions/export",
    formats: ["csv", "json"],
  },
  {
    id: "documents",
    label: "Document Registry",
    description: "Document metadata, classification types, extraction status, and confidence scores",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
    endpoint: "/api/documents/export",
    formats: ["csv", "json"],
  },
  {
    id: "suppliers",
    label: "Supplier Data",
    description: "Supplier names, ESG risk scores, risk levels, and assessment dates",
    icon: <FileSpreadsheet className="h-5 w-5 text-purple-600" />,
    endpoint: "/api/suppliers/export",
    formats: ["csv", "json"],
  },
  {
    id: "audit-log",
    label: "Audit Log",
    description: "Complete audit trail of all actions taken in your organization",
    icon: <FileText className="h-5 w-5 text-amber-600" />,
    endpoint: "/api/audit-log/export",
    formats: ["csv", "json"],
  },
  {
    id: "users",
    label: "Team Members",
    description: "User names, email addresses, roles, and join dates",
    icon: <FileSpreadsheet className="h-5 w-5 text-slate-600" />,
    endpoint: "/api/users/export",
    formats: ["csv"],
  },
];

export default function DataExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [formats, setFormats] = useState<Record<string, string>>({
    emissions: "csv",
    documents: "csv",
    suppliers: "csv",
    "audit-log": "csv",
    users: "csv",
  });

  const handleExport = async (option: ExportOption) => {
    setDownloading(option.id);
    try {
      const format = formats[option.id] || "csv";
      const res = await fetch(`${option.endpoint}?format=${format}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `greenledger-${option.id}-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(`Export failed for ${option.id}:`, err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Data Export</h2>
        <p className="text-sm text-slate-500">
          Download your organization&apos;s data in CSV or JSON format
        </p>
      </div>

      {EXPORT_OPTIONS.map((option) => (
        <Card key={option.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                {option.icon}
              </div>
              <div>
                <CardTitle className="text-base">{option.label}</CardTitle>
                <p className="text-xs text-slate-500">{option.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {option.formats.length > 1 && (
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Format</Label>
                  <Select
                    value={formats[option.id]}
                    onValueChange={(v) =>
                      setFormats((prev) => ({ ...prev, [option.id]: v }))
                    }
                  >
                    <SelectTrigger className="h-9 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {option.formats.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className={option.formats.length > 1 ? "mt-5" : ""}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(option)}
                  disabled={downloading === option.id}
                >
                  <Download className={`mr-2 h-4 w-4 ${downloading === option.id ? "animate-bounce" : ""}`} />
                  {downloading === option.id ? "Downloading..." : "Export"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="py-4">
          <p className="text-xs text-slate-500">
            Exports include all data for your organization. For compliance purposes,
            exported files are logged in the audit trail. Large exports may take a few
            moments to prepare.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
