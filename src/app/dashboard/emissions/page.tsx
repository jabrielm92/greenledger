"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ScopeBreakdown } from "@/components/emissions/scope-breakdown";
import { EmissionsTable } from "@/components/emissions/emissions-table";
import { EmissionsForm } from "@/components/emissions/emissions-form";
import { useEmissions, useEmissionsSummary } from "@/hooks/use-emissions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEmissions } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmissionsPage() {
  const [scopeFilter, setScopeFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const { summary, isLoading: summaryLoading } = useEmissionsSummary();
  const { entries, totalPages, isLoading: entriesLoading } =
    useEmissions({
      page,
      scope: scopeFilter || undefined,
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emissions"
        description="Track and manage your Scope 1 & 2 greenhouse gas emissions"
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/documents">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Scope 1 Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {formatEmissions(summary?.totalScope1 ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Scope 2 Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {formatEmissions(summary?.totalScope2 ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Total Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatEmissions(summary?.totalEmissions ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Data Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {summary?.entryCount ?? 0}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <ScopeBreakdown
        byCategory={summary?.byCategory ?? []}
        byMonth={summary?.byMonth ?? []}
      />

      {/* Add entry form */}
      {showForm && <EmissionsForm />}

      {/* Filters & table */}
      <div className="flex items-center gap-3">
        <Select value={scopeFilter} onValueChange={setScopeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All scopes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All scopes</SelectItem>
            <SelectItem value="SCOPE_1">Scope 1</SelectItem>
            <SelectItem value="SCOPE_2">Scope 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <EmissionsTable entries={entries} isLoading={entriesLoading} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
