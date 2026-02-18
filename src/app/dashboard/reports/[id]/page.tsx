"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SectionEditor } from "@/components/reports/section-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnumValue } from "@/lib/utils";
import { Download, FileText } from "lucide-react";
import type { GeneratedSection } from "@/types";

interface ReportDetail {
  id: string;
  title: string;
  frameworkType: string;
  status: string;
  version: number;
  generatedContent: Record<string, GeneratedSection> | null;
  manualEdits: Record<string, string> | null;
  finalContent: Record<string, GeneratedSection> | null;
  createdAt: string;
  updatedAt: string;
  reportingPeriod?: { name: string } | null;
  exports: { id: string; format: string; createdAt: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  GENERATING: "bg-amber-100 text-amber-700",
  REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  PUBLISHED: "bg-purple-100 text-purple-700",
};

export default function ReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const reportId = params.id as string;

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/reports/${reportId}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
          setEdits(data.manualEdits || {});
        }
      } catch (err) {
        console.error("Failed to fetch report:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetch_();
  }, [reportId]);

  const handleStatusChange = async (status: string) => {
    if (!report) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReport({ ...report, ...updated });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdits = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manualEdits: edits }),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = (format: string) => {
    window.open(`/api/reports/${reportId}/export?format=${format}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Report not found.
      </div>
    );
  }

  const content = report.finalContent || report.generatedContent;
  const sections = content ? Object.values(content) : [];

  return (
    <div className="space-y-6">
      <PageHeader title={report.title}>
        <Badge
          variant="secondary"
          className={STATUS_STYLES[report.status] || ""}
        >
          {formatEnumValue(report.status)}
        </Badge>
        <Select value={report.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
        <span>{report.frameworkType}</span>
        {report.reportingPeriod && (
          <span>Period: {report.reportingPeriod.name}</span>
        )}
        <span>Version {report.version}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionEditor
              key={section.code}
              code={section.code}
              title={section.title}
              content={edits[section.code] ?? section.content}
              isAIGenerated={!edits[section.code]}
              confidence={section.confidence}
              onEdit={(content) =>
                setEdits((prev) => ({ ...prev, [section.code]: content }))
              }
            />
          ))}

          {sections.length === 0 && (
            <div className="rounded-md border p-8 text-center text-sm text-slate-500">
              No content generated yet.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                size="sm"
                onClick={handleSaveEdits}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Edits"}
              </Button>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="sm"
                onClick={() => handleExport("html")}
              >
                <Download className="mr-1 h-3 w-3" />
                Export PDF
              </Button>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => handleExport("csv")}
              >
                <FileText className="mr-1 h-3 w-3" />
                Export CSV
              </Button>
            </CardContent>
          </Card>

          {sections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {sections.map((s) => (
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
          )}

          {report.exports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Export History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {report.exports.map((exp) => (
                    <p key={exp.id} className="text-xs text-slate-500">
                      {exp.format.toUpperCase()} —{" "}
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
