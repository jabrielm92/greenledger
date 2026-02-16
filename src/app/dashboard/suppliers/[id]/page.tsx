"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { RiskBadge } from "@/components/suppliers/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import {
  Building2,
  Globe,
  Mail,
  User,
  ExternalLink,
  Edit3,
  Trash2,
  Info,
} from "lucide-react";

interface SupplierDetail {
  id: string;
  name: string;
  contactName?: string | null;
  contactEmail?: string | null;
  industry?: string | null;
  country?: string | null;
  website?: string | null;
  esgRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
  esgScore?: number | null;
  lastAssessment?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const supplierId = params.id as string;

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/suppliers/${supplierId}`);
        if (res.ok) {
          setSupplier(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch supplier:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetch_();
  }, [supplierId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard/suppliers");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading supplier...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Supplier not found.
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <PageHeader title={`Edit: ${supplier.name}`} />
        <SupplierForm
          supplier={supplier}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={supplier.name}>
        <RiskBadge level={supplier.esgRiskLevel} />
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit3 className="mr-1 h-3 w-3" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supplier.industry && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>{formatEnumValue(supplier.industry)}</span>
              </div>
            )}
            {supplier.country && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-slate-400" />
                <span>{supplier.country}</span>
              </div>
            )}
            {supplier.contactName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-slate-400" />
                <span>{supplier.contactName}</span>
              </div>
            )}
            {supplier.contactEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <a
                  href={`mailto:${supplier.contactEmail}`}
                  className="text-emerald-600 hover:underline"
                >
                  {supplier.contactEmail}
                </a>
              </div>
            )}
            {supplier.website && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  {supplier.website}
                </a>
              </div>
            )}
            <div className="pt-2 text-xs text-slate-400">
              Added {format(new Date(supplier.createdAt), "MMM d, yyyy")}
            </div>
          </CardContent>
        </Card>

        {/* ESG card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ESG Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Risk Level</span>
              <RiskBadge level={supplier.esgRiskLevel} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">ESG Score</span>
              {supplier.esgScore != null ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${supplier.esgScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {supplier.esgScore}/100
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Not assessed</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Assessment</span>
              <span className="text-sm">
                {supplier.lastAssessment
                  ? format(new Date(supplier.lastAssessment), "MMM d, yyyy")
                  : "Never"}
              </span>
            </div>

            {supplier.notes && (
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {supplier.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future features */}
      <Card>
        <CardContent className="flex items-center gap-3 py-6">
          <Info className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-600">
              Automated ESG Data Collection
            </p>
            <p className="text-xs text-slate-400">
              Automated supplier ESG data collection and scoring coming in a
              future release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
