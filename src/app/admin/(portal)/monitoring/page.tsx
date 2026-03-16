"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Building2,
  FileText,
  Users,
  BarChart3,
  TrendingUp,
  Database,
  Clock,
} from "lucide-react";

interface Stats {
  overview: {
    totalOrgs: number;
    totalUsers: number;
    totalDocuments: number;
    totalEmissions: number;
    activeTrials: number;
    expiredTrials: number;
  };
  planCounts: Record<string, number>;
}

const planLabels: Record<string, string> = {
  FREE_TRIAL: "Free Trial",
  BASE: "Base",
  PROFESSIONAL: "Professional",
  ENTERPRISE: "Enterprise",
};

const planColors: Record<string, string> = {
  FREE_TRIAL: "bg-slate-100 text-slate-700",
  BASE: "bg-blue-100 text-blue-700",
  PROFESSIONAL: "bg-purple-100 text-purple-700",
  ENTERPRISE: "bg-emerald-100 text-emerald-700",
};

export default function MonitoringPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refresh = () => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLastRefresh(new Date());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Usage Monitoring</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 animate-pulse rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <p>Failed to load monitoring data.</p>;

  const { overview, planCounts } = stats;
  const totalOrgs = overview.totalOrgs;
  const paidOrgs = (planCounts.BASE || 0) + (planCounts.PROFESSIONAL || 0) + (planCounts.ENTERPRISE || 0);
  const conversionRate = totalOrgs > 0 ? ((paidOrgs / totalOrgs) * 100).toFixed(1) : "0";
  const avgUsersPerOrg = totalOrgs > 0 ? (overview.totalUsers / totalOrgs).toFixed(1) : "0";
  const avgDocsPerOrg = totalOrgs > 0 ? (overview.totalDocuments / totalOrgs).toFixed(1) : "0";
  const avgEmissionsPerOrg = totalOrgs > 0 ? (overview.totalEmissions / totalOrgs).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Usage Monitoring</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Activity className="h-4 w-4 text-emerald-500" />
          <span>Auto-refreshing every 30s</span>
          <span className="text-slate-400">|</span>
          <Clock className="h-3 w-3" />
          <span>Last: {lastRefresh.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-3xl font-bold">{overview.totalOrgs}</p>
                <p className="text-sm text-slate-500">Total Organizations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-3xl font-bold">{overview.totalUsers}</p>
                <p className="text-sm text-slate-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-3xl font-bold">{overview.totalDocuments}</p>
                <p className="text-sm text-slate-500">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-3xl font-bold">{overview.totalEmissions}</p>
                <p className="text-sm text-slate-500">Emission Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Averages */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xl font-bold">{avgUsersPerOrg}</p>
              <p className="text-xs text-slate-500">Avg Users per Org</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Database className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xl font-bold">{avgDocsPerOrg}</p>
              <p className="text-xs text-slate-500">Avg Documents per Org</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <BarChart3 className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xl font-bold">{avgEmissionsPerOrg}</p>
              <p className="text-xs text-slate-500">Avg Emissions per Org</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trial & Conversion Metrics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trial Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-slate-600">Active Trials</span>
              <span className="text-lg font-bold text-emerald-600">
                {overview.activeTrials}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-slate-600">Expired Trials</span>
              <span className="text-lg font-bold text-red-600">
                {overview.expiredTrials}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-slate-600">Conversion Rate</span>
              <span className="text-lg font-bold text-blue-600">
                {conversionRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(planLabels).map(([key, label]) => {
              const count = planCounts[key] || 0;
              const pct = totalOrgs > 0 ? ((count / totalOrgs) * 100).toFixed(0) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={planColors[key]}>{label}</Badge>
                    <span className="font-medium">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
