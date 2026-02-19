"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ComplianceScore } from "@/components/dashboard/compliance-score";
import { EmissionsChart } from "@/components/dashboard/emissions-chart";
import { FrameworkProgress } from "@/components/dashboard/framework-progress";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import type { DashboardStats, AuditLogEntry } from "@/types";

interface FrameworkItem {
  id: string;
  name: string;
  completionPct: number;
  status: string;
  targetYear: number;
}

interface DashboardData {
  stats: DashboardStats;
  daysUntilDeadline: number | null;
  frameworks: FrameworkItem[];
  recentActivity: AuditLogEntry[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your ESG compliance overview at a glance"
      />

      <StatsCards
        stats={data?.stats ?? null}
        isLoading={isLoading}
        daysUntilDeadline={data?.daysUntilDeadline}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <EmissionsChart data={[]} />
        <ComplianceScore score={data?.stats.complianceScore ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FrameworkProgress frameworks={data?.frameworks ?? []} />
        <QuickActions />
      </div>

      <RecentActivity activities={data?.recentActivity ?? []} />
    </div>
  );
}
