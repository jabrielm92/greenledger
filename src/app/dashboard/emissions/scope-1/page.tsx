"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmissionsTable } from "@/components/emissions/emissions-table";
import { EmissionsForm } from "@/components/emissions/emissions-form";
import { useEmissions } from "@/hooks/use-emissions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Scope1Page() {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const { entries, totalPages, isLoading } = useEmissions({
    page,
    scope: "SCOPE_1",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scope 1 Emissions"
        description="Direct emissions from owned or controlled sources — fuel combustion, fleet vehicles, refrigerants"
      >
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </PageHeader>

      {showForm && <EmissionsForm />}

      <EmissionsTable entries={entries} isLoading={isLoading} />

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
