"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  plan: string;
  trialEndsAt: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  _count: { users: number; documents: number; emissionEntries: number };
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

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (planFilter) params.set("plan", planFilter);
    params.set("page", page.toString());

    const res = await fetch(`/api/admin/tenants?${params}`);
    const data = await res.json();
    setTenants(data.tenants || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setLoading(false);
  }, [search, planFilter, page]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Tenant Management</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name or slug..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
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

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">Docs</TableHead>
                  <TableHead className="text-center">Emissions</TableHead>
                  <TableHead>Onboarded</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No tenants found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Link
                          href={`/admin/tenants/${t.id}`}
                          className="font-medium text-emerald-600 hover:underline"
                        >
                          {t.name}
                        </Link>
                        <p className="text-xs text-slate-500">{t.slug}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={planColors[t.plan] || "bg-slate-100"}>
                          {planLabels[t.plan] || t.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{t._count.users}</TableCell>
                      <TableCell className="text-center">{t._count.documents}</TableCell>
                      <TableCell className="text-center">{t._count.emissionEntries}</TableCell>
                      <TableCell>
                        <Badge variant={t.onboardingComplete ? "default" : "outline"}>
                          {t.onboardingComplete ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
