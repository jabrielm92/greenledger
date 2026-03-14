"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  slug: string;
  plan: string;
  trialEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: string | null;
  createdAt: string;
  _count: { users: number };
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

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (planFilter) params.set("plan", planFilter);
    params.set("page", page.toString());

    const res = await fetch(`/api/admin/subscriptions?${params}`);
    const data = await res.json();
    setSubscriptions(data.subscriptions || []);
    setSummary(data.summary || {});
    setTotalPages(data.pagination?.totalPages || 1);
    setLoading(false);
  }, [planFilter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalOrgs = Object.values(summary).reduce((a, b) => a + b, 0);
  const paidOrgs = (summary.BASE || 0) + (summary.PROFESSIONAL || 0) + (summary.ENTERPRISE || 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Subscription Management</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Organizations</p>
            <p className="text-2xl font-bold">{totalOrgs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Paid Subscriptions</p>
            <p className="text-2xl font-bold text-emerald-600">{paidOrgs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Free Trials</p>
            <p className="text-2xl font-bold text-amber-600">{summary.FREE_TRIAL || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Conversion Rate</p>
            <p className="text-2xl font-bold">
              {totalOrgs > 0 ? ((paidOrgs / totalOrgs) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Breakdown */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(planLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2 rounded-lg border p-3">
            <Badge className={planColors[key]}>{label}</Badge>
            <span className="font-semibold">{summary[key] || 0}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" /> Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v === "ALL" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Plans</SelectItem>
                <SelectItem value="FREE_TRIAL">Free Trial</SelectItem>
                <SelectItem value="BASE">Base</SelectItem>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Trial Ends</TableHead>
                  <TableHead>Stripe ID</TableHead>
                  <TableHead>Period End</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Link href={`/admin/tenants/${s.id}`} className="font-medium text-emerald-600 hover:underline">
                          {s.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={planColors[s.plan]}>{planLabels[s.plan]}</Badge>
                      </TableCell>
                      <TableCell>{s._count.users}</TableCell>
                      <TableCell className="text-sm">
                        {s.trialEndsAt ? new Date(s.trialEndsAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {s.stripeCustomerId ? s.stripeCustomerId.slice(0, 16) + "..." : "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.stripeCurrentPeriodEnd
                          ? new Date(s.stripeCurrentPeriodEnd).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
