"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Key, RefreshCw, Shield } from "lucide-react";

export default function SecuritySettingsPage() {
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // API key
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (apiKey && !confirm("This will revoke your current API key. Continue?")) {
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/auth/api-key", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.apiKey);
        setShowKey(true);
      }
    } catch (err) {
      console.error("Failed to generate API key:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Security & API</h2>
        <p className="text-sm text-slate-500">
          Manage your password, two-factor authentication, and API access
        </p>
      </div>

      {/* Password change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-emerald-600">Password updated.</p>}

          <Button
            onClick={handlePasswordChange}
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Two-factor authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Two-Factor Authentication
            </CardTitle>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Add an extra layer of security to your account by enabling two-factor
            authentication with an authenticator app.
          </p>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">
            Use an API key to access GreenLedger data programmatically. Your key grants
            full access to your organization&apos;s data — treat it like a password.
          </p>

          {apiKey ? (
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={showKey ? apiKey : "gl_" + "•".repeat(32)}
                className="font-mono text-sm bg-slate-50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {copied && (
                <span className="text-xs text-emerald-600">Copied!</span>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No API key generated yet.</p>
          )}

          <Button
            variant="outline"
            onClick={handleGenerateApiKey}
            disabled={isGenerating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            {apiKey ? "Regenerate Key" : "Generate API Key"}
          </Button>

          {apiKey && (
            <p className="text-xs text-amber-600">
              Make sure to copy your API key now. You won&apos;t be able to see it again.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Current Session</p>
              <p className="text-xs text-slate-500">This device — active now</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
