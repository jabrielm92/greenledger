"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  FileText,
  BarChart3,
  Clock,
  AlertTriangle,
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
  recentOrgs: Array<{
    id: string;
    name: string;
    slug: string;
    plan: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    organization: { name: string } | null;
  }>;
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
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

  if (!stats) return <p>Failed to load stats.</p>;

  const { overview, planCounts, recentOrgs, recentUsers } = stats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-50 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview.totalOrgs}</p>
              <p className="text-xs text-slate-500">Organizations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-50 p-2">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview.totalUsers}</p>
              <p className="text-xs text-slate-500">Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-purple-50 p-2">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview.totalDocuments}</p>
              <p className="text-xs text-slate-500">Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-50 p-2">
              <BarChart3 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview.totalEmissions}</p>
              <p className="text-xs text-slate-500">Emission Entries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-green-50 p-2">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview.activeTrials}</p>
              <p className="text-xs text-slate-500">Active Trials</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-red-50 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview.expiredTrials}</p>
              <p className="text-xs text-slate-500">Expired Trials</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(planCounts).map(([plan, count]) => (
              <div
                key={plan}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                <Badge className={planColors[plan] || "bg-slate-100"}>
                  {planLabels[plan] || plan}
                </Badge>
                <span className="text-lg font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Organizations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Organizations</CardTitle>
            <Link
              href="/admin/tenants"
              className="text-sm text-emerald-600 hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/admin/tenants/${org.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{org.name}</p>
                    <p className="text-xs text-slate-500">{org.slug}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={planColors[org.plan] || "bg-slate-100"}>
                      {planLabels[org.plan] || org.plan}
                    </Badge>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
              {recentOrgs.length === 0 && (
                <p className="text-sm text-slate-500">No organizations yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Users</CardTitle>
            <Link
              href="/admin/users"
              className="text-sm text-emerald-600 hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {user.name || "Unnamed"}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                    <p className="mt-1 text-xs text-slate-500">
                      {user.organization?.name || "No org"}
                    </p>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-slate-500">No users yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
