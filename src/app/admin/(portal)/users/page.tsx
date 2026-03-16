"use client";

import { useEffect, useState, useCallback } from "react";
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
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: string | null;
  createdAt: string;
  organization: { id: string; name: string; plan: string } | null;
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700",
  OWNER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  MEMBER: "bg-slate-100 text-slate-700",
  VIEWER: "bg-gray-100 text-gray-600",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    params.set("page", page.toString());

    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Users ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "ALL" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name || "Unnamed"}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[u.role] || "bg-slate-100"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.organization ? (
                          <Link
                            href={`/admin/tenants/${u.organization.id}`}
                            className="text-emerald-600 hover:underline"
                          >
                            {u.organization.name}
                          </Link>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.emailVerified ? "default" : "destructive"}>
                          {u.emailVerified ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
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
