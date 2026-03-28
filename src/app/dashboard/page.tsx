"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ComplianceScore } from "@/components/dashboard/compliance-score";
import dynamic from "next/dynamic";
const EmissionsChart = dynamic(
  () => import("@/components/dashboard/emissions-chart").then((m) => m.EmissionsChart),
  { ssr: false }
);
import { FrameworkProgress } from "@/components/dashboard/framework-progress";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ComplianceAlerts } from "@/components/dashboard/compliance-alerts";
import { useEmissionsSummary } from "@/hooks/use-emissions";
import type { DashboardStats, AuditLogEntry } from "@/types";

interface FrameworkItem {
  id: string;
  name: string;
  completionPct: number;
  coveredDataPoints: number;
  totalDataPoints: number;
  status: string;
  targetYear: number;
  dueDate: string | null;
}

interface DashboardData {
  stats: DashboardStats;
  daysUntilDeadline: number | null;
  nextDeadlineFramework: string | null;
  frameworks: FrameworkItem[];
  recentActivity: AuditLogEntry[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { summary } = useEmissionsSummary();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your ESG compliance overview at a glance"
      />

      <StatsCards
        stats={data?.stats ?? null}
        isLoading={isLoading}
        daysUntilDeadline={data?.daysUntilDeadline}
        nextDeadlineFramework={data?.nextDeadlineFramework}
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <EmissionsChart data={summary?.byMonth ?? []} />
        <ComplianceScore score={data?.stats.complianceScore ?? 0} />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <FrameworkProgress frameworks={data?.frameworks ?? []} />
        <QuickActions />
      </div>

      <ComplianceAlerts />

      <RecentActivity activities={data?.recentActivity ?? []} />
    </div>
  );
}
