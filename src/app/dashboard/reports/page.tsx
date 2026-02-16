"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ReportCard } from "@/components/reports/report-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportItem {
  id: string;
  title: string;
  frameworkType: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  reportingPeriod?: { name: string } | null;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState("");

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter && statusFilter !== "all")
          params.set("status", statusFilter);
        if (frameworkFilter && frameworkFilter !== "all")
          params.set("frameworkType", frameworkFilter);

        const res = await fetch(`/api/reports?${params}`);
        if (res.ok) {
          const data = await res.json();
          setReports(data.items);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, [statusFilter, frameworkFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and manage sustainability reports"
      >
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/reports/new">
            <Plus className="mr-2 h-4 w-4" />
            Generate New Report
          </Link>
        </Button>
      </PageHeader>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="GENERATING">Generating</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>

        <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All frameworks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All frameworks</SelectItem>
            <SelectItem value="CSRD">CSRD / ESRS</SelectItem>
            <SelectItem value="GRI">GRI Standards</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-md border p-12 text-center text-sm text-slate-500">
          <p className="mb-4">No reports yet.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/dashboard/reports/new">
              <Plus className="mr-2 h-4 w-4" />
              Generate Your First Report
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
