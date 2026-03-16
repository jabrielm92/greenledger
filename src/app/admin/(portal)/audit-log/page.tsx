"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, ScrollText } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
  organization: { id: string; name: string } | null;
}

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
  EXPORT: "bg-amber-100 text-amber-700",
};

function getActionColor(action: string) {
  const key = Object.keys(actionColors).find((k) =>
    action.toUpperCase().includes(k)
  );
  return key ? actionColors[key] : "bg-slate-100 text-slate-700";
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (actionFilter) params.set("action", actionFilter);
    if (entityFilter) params.set("entityType", entityFilter);
    params.set("page", page.toString());

    const res = await fetch(`/api/admin/audit-log?${params}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [actionFilter, entityFilter, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Audit Log / Troubleshooting
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4" /> System Audit Log ({total} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Filter by action..."
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Filter by entity type..."
                value={entityFilter}
                onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No audit log entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{log.entityType}</p>
                          <p className="font-mono text-xs text-slate-400">
                            {log.entityId.slice(0, 12)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.user ? (
                          <div>
                            <p>{log.user.name || "Unnamed"}</p>
                            <p className="text-xs text-slate-500">{log.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">System</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.organization?.name || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">
                        {log.ipAddress || "-"}
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
