"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ArrowLeft, Building2, FileText, Users, BarChart3, ClipboardList, Truck } from "lucide-react";

interface TenantDetail {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  employeeCount: number | null;
  country: string | null;
  city: string | null;
  website: string | null;
  plan: string;
  trialEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
  users: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    emailVerified: string | null;
    createdAt: string;
  }>;
  _count: {
    documents: number;
    emissionEntries: number;
    reports: number;
    suppliers: number;
    complianceFrameworks: number;
    auditLogs: number;
  };
}

const planLabels: Record<string, string> = {
  FREE_TRIAL: "Free Trial",
  BASE: "Base",
  PROFESSIONAL: "Professional",
  ENTERPRISE: "Enterprise",
};

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    fetch(`/api/admin/tenants/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTenant(data);
        setSelectedPlan(data.plan);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handlePlanChange = async () => {
    if (!tenant || selectedPlan === tenant.plan) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTenant((prev) => prev ? { ...prev, plan: updated.plan } : prev);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (!tenant) return <p>Tenant not found.</p>;

  const stats = [
    { label: "Users", value: tenant.users.length, icon: Users },
    { label: "Documents", value: tenant._count.documents, icon: FileText },
    { label: "Emissions", value: tenant._count.emissionEntries, icon: BarChart3 },
    { label: "Reports", value: tenant._count.reports, icon: ClipboardList },
    { label: "Suppliers", value: tenant._count.suppliers, icon: Truck },
    { label: "Audit Logs", value: tenant._count.auditLogs, icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/tenants")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{tenant.name}</h1>
          <p className="text-sm text-slate-500">{tenant.slug}</p>
        </div>
      </div>

      {/* Organization Info */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Industry</span>
              <span>{tenant.industry || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employees</span>
              <span>{tenant.employeeCount || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location</span>
              <span>{[tenant.city, tenant.country].filter(Boolean).join(", ") || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Website</span>
              <span>{tenant.website || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Onboarded</span>
              <Badge variant={tenant.onboardingComplete ? "default" : "outline"}>
                {tenant.onboardingComplete ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Created</span>
              <span>{new Date(tenant.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE_TRIAL">Free Trial</SelectItem>
                  <SelectItem value="BASE">Base</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={saving || selectedPlan === tenant.plan}
                onClick={handlePlanChange}
              >
                {saving ? "Saving..." : "Update Plan"}
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Plan</span>
                <span className="font-medium">{planLabels[tenant.plan]}</span>
              </div>
              {tenant.trialEndsAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Trial Ends</span>
                  <span>{new Date(tenant.trialEndsAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Stripe Customer</span>
                <span className="font-mono text-xs">
                  {tenant.stripeCustomerId || "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stripe Subscription</span>
                <span className="font-mono text-xs">
                  {tenant.stripeSubscriptionId || "None"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users ({tenant.users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenant.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "Unnamed"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.emailVerified ? "default" : "destructive"}>
                        {user.emailVerified ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
