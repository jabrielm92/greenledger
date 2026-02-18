"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Send, Trash2 } from "lucide-react";

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  MEMBER: "bg-emerald-100 text-emerald-700",
  VIEWER: "bg-slate-100 text-slate-500",
};

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string | null;
}

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Invite form
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [isSending, setIsSending] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.items || data);
      }
    } catch (err) {
      console.error("Failed to fetch team:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInvite = async () => {
    setInviteError("");
    setInviteSuccess(false);
    setIsSending(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send invite");
      }
      setInviteSuccess(true);
      setInviteEmail("");
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setIsSending(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/team/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleRemove = async (userId: string, userName: string | null) => {
    if (!confirm(`Remove ${userName || "this user"} from the team?`)) return;
    try {
      const res = await fetch(`/api/team/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== userId));
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage team members and their roles"
      >
        <Button
          onClick={() => setShowInvite(!showInvite)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </PageHeader>

      {/* Invite form */}
      {showInvite && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invite Team Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto]">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleInvite}
                  disabled={isSending || !inviteEmail}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSending ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </div>
            {inviteError && (
              <p className="text-sm text-red-600">{inviteError}</p>
            )}
            {inviteSuccess && (
              <p className="text-sm text-emerald-600">Invitation sent!</p>
            )}

            <div className="text-xs text-slate-500">
              <p><strong>Admin</strong> — Can manage team, upload docs, generate reports, manage suppliers</p>
              <p><strong>Member</strong> — Can upload docs, create emissions entries, view reports</p>
              <p><strong>Viewer</strong> — Read-only access to dashboards and reports</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading team...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-slate-500">No team members yet.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm font-medium">
                        {m.name || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {m.email}
                      </TableCell>
                      <TableCell>
                        {m.role === "OWNER" ? (
                          <Badge
                            variant="secondary"
                            className={ROLE_STYLES.OWNER}
                          >
                            Owner
                          </Badge>
                        ) : (
                          <Select
                            value={m.role}
                            onValueChange={(v) => handleRoleChange(m.id, v)}
                          >
                            <SelectTrigger className="h-7 w-[110px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                              <SelectItem value="VIEWER">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {format(new Date(m.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {m.role !== "OWNER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleRemove(m.id, m.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
