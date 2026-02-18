"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Save } from "lucide-react";

const INDUSTRIES = [
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "PROFESSIONAL_SERVICES", label: "Professional Services" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "RETAIL", label: "Retail" },
  { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "ENERGY", label: "Energy" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "OTHER", label: "Other" },
];

const EMPLOYEE_RANGES = [
  { value: "10", label: "1–50" },
  { value: "75", label: "51–100" },
  { value: "175", label: "101–250" },
  { value: "375", label: "251–500" },
  { value: "750", label: "500+" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface OrgData {
  id: string;
  name: string;
  industry: string | null;
  employeeCount: number | null;
  country: string | null;
  city: string | null;
  website: string | null;
  fiscalYearStartMonth: number | null;
}

export default function GeneralSettingsPage() {
  const router = useRouter();
  const [org, setOrg] = useState<OrgData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [fiscalMonth, setFiscalMonth] = useState("0");

  // Delete confirmation
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch("/api/organization");
        if (res.ok) {
          const data = await res.json();
          setOrg(data);
          setName(data.name || "");
          setIndustry(data.industry || "");
          setEmployeeCount(String(data.employeeCount || ""));
          setCountry(data.country || "");
          setCity(data.city || "");
          setWebsite(data.website || "");
          setFiscalMonth(String(data.fiscalYearStartMonth ?? 0));
        }
      } catch (err) {
        console.error("Failed to fetch org:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrg();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess(false);
    setIsSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industry: industry || undefined,
          employeeCount: employeeCount ? parseInt(employeeCount) : undefined,
          country: country || undefined,
          city: city || undefined,
          website: website || undefined,
          fiscalYearStartMonth: parseInt(fiscalMonth),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!org || deleteConfirm !== org.name) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/organization", { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      }
    } catch (_err) {
      setError("Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="General Settings" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="General Settings"
        description="Manage your organization profile"
      />

      {/* Company profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Employees</Label>
              <Select value={employeeCount} onValueChange={setEmployeeCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_RANGES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States"
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., San Francisco"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Fiscal Year Start</Label>
              <Select value={fiscalMonth} onValueChange={setFiscalMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-600">Settings saved.</p>
          )}

          <Button
            onClick={handleSave}
            disabled={isSaving || !name}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          {!showDelete ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Organization</p>
                <p className="text-xs text-slate-500">
                  Permanently delete this organization and all its data.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setShowDelete(true)}
              >
                Delete Organization
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">
                  This action cannot be undone. All users, documents, reports,
                  emissions data, and suppliers will be permanently deleted.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  Type <strong>{org?.name}</strong> to confirm
                </Label>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={org?.name}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || deleteConfirm !== org?.name}
                >
                  {isDeleting ? "Deleting..." : "Permanently Delete"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDelete(false);
                    setDeleteConfirm("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
