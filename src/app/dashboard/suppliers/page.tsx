"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierCard } from "@/components/suppliers/supplier-card";
import { SupplierForm } from "@/components/suppliers/supplier-form";
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
import { RiskBadge } from "@/components/suppliers/risk-badge";
import { formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplierItem {
  id: string;
  name: string;
  industry?: string | null;
  country?: string | null;
  contactEmail?: string | null;
  contactName?: string | null;
  esgRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
  esgScore?: number | null;
  lastAssessment?: string | null;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [riskFilter, setRiskFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, [riskFilter, search]);

  async function fetchSuppliers() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (riskFilter && riskFilter !== "all")
        params.set("riskLevel", riskFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/suppliers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.items);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage supply chain partners and ESG risk assessments"
      >
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </PageHeader>

      {showForm && (
        <SupplierForm onCancel={() => setShowForm(false)} />
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All risk levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk levels</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="UNKNOWN">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded" />
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="rounded-md border p-12 text-center text-sm text-slate-500">
          No suppliers found.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>ESG Risk</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Last Assessment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/dashboard/suppliers/${s.id}`}
                      className="font-medium text-slate-900 hover:text-emerald-600"
                    >
                      {s.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {s.industry ? formatEnumValue(s.industry) : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {s.country || "—"}
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={s.esgRiskLevel} />
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {s.esgScore != null ? `${s.esgScore}/100` : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {s.lastAssessment
                      ? format(new Date(s.lastAssessment), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
