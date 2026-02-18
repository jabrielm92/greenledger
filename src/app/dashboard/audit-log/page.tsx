"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { formatEnumValue } from "@/lib/utils";
import { Search, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
}

const ACTION_STYLES: Record<string, string> = {
  entity_created: "bg-emerald-100 text-emerald-700",
  field_changed: "bg-blue-100 text-blue-700",
  entity_deleted: "bg-red-100 text-red-700",
  status_changed: "bg-amber-100 text-amber-700",
};

const ENTITY_TYPES = [
  "Document",
  "EmissionEntry",
  "Report",
  "Supplier",
  "User",
  "Organization",
  "QuickBooksSync",
  "QuickBooksConnection",
];

const ACTIONS = [
  "entity_created",
  "field_changed",
  "entity_deleted",
  "status_changed",
];

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "25" });
      if (search) params.set("search", search);
      if (actionFilter && actionFilter !== "all")
        params.set("action", actionFilter);
      if (entityTypeFilter && entityTypeFilter !== "all")
        params.set("entityType", entityTypeFilter);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/audit-log?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch audit log:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, actionFilter, entityTypeFilter, startDate, endDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleExportCSV = () => {
    const params = new URLSearchParams({ pageSize: "10000" });
    if (actionFilter && actionFilter !== "all")
      params.set("action", actionFilter);
    if (entityTypeFilter && entityTypeFilter !== "all")
      params.set("entityType", entityTypeFilter);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    // Build CSV client-side from current data
    const header = "Timestamp,User,Action,Entity Type,Entity ID\n";
    const rows = entries
      .map(
        (e) =>
          `${e.createdAt},${e.user?.name || e.user?.email || "System"},${e.action},${e.entityType},${e.entityId}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Track all changes and actions across your organization"
      >
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={actionFilter}
          onValueChange={(v) => {
            setActionFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {formatEnumValue(a)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={entityTypeFilter}
          onValueChange={(v) => {
            setEntityTypeFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            {ENTITY_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
          className="w-[150px]"
          placeholder="From"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
          className="w-[150px]"
          placeholder="To"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-slate-500">
            No audit log entries found.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {format(
                      new Date(entry.createdAt),
                      "MMM d, yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {entry.user?.name || entry.user?.email || "System"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        ACTION_STYLES[entry.action] || "bg-slate-100"
                      }
                    >
                      {formatEnumValue(entry.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="text-slate-500">{entry.entityType}</span>
                    <span className="ml-1 text-xs text-slate-400">
                      {entry.entityId.slice(0, 8)}...
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] text-xs text-slate-500">
                    {entry.newValue && (
                      <details>
                        <summary className="cursor-pointer hover:text-slate-700">
                          View changes
                        </summary>
                        <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-2 text-[10px]">
                          {JSON.stringify(entry.newValue, null, 2)}
                        </pre>
                      </details>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {total} total entries
          </p>
          <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
}
