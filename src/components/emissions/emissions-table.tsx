"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEmissions, formatEnumValue } from "@/lib/utils";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface EmissionEntryRow {
  id: string;
  scope: string;
  category: string;
  source: string;
  activityValue: number;
  activityUnit: string;
  co2e: number;
  startDate: string | Date;
  endDate: string | Date;
  document?: { id: string; fileName: string } | null;
}

interface EmissionsTableProps {
  entries: EmissionEntryRow[];
  isLoading?: boolean;
}

export function EmissionsTable({ entries, isLoading }: EmissionsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-slate-500">
        Loading emissions data...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-slate-500">
        No emission entries yet. Add your first entry above.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Activity</TableHead>
            <TableHead className="text-right">Emissions</TableHead>
            <TableHead>Document</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-sm">
                {format(new Date(entry.startDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    entry.scope === "SCOPE_1"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }
                >
                  {entry.scope === "SCOPE_1" ? "Scope 1" : "Scope 2"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {formatEnumValue(entry.category)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm">
                {entry.source}
              </TableCell>
              <TableCell className="text-right text-sm">
                {entry.activityValue.toLocaleString()} {entry.activityUnit}
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {formatEmissions(entry.co2e)}
              </TableCell>
              <TableCell>
                {entry.document ? (
                  <Link
                    href={`/dashboard/documents/${entry.document.id}`}
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                  >
                    <FileText className="h-3 w-3" />
                    {entry.document.fileName}
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400">Manual</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
