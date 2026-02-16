"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ReportWizard } from "@/components/reports/report-wizard";

interface Period {
  id: string;
  name: string;
}

export default function NewReportPage() {
  const [periods, setPeriods] = useState<Period[]>([]);

  useEffect(() => {
    async function fetchPeriods() {
      try {
        const res = await fetch("/api/reporting-periods");
        if (res.ok) {
          const data = await res.json();
          setPeriods(data.items || data);
        }
      } catch (err) {
        console.error("Failed to fetch reporting periods:", err);
      }
    }
    fetchPeriods();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate New Report"
        description="Create a sustainability report using AI-powered content generation"
      />
      <ReportWizard reportingPeriods={periods} />
    </div>
  );
}
