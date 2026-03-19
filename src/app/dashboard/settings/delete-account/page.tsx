"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  async function handleDelete() {
    if (!password || !confirmEmail) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gdpr/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Deletion failed");
      }

      // Success — redirect to home
      window.location.href = "/?deleted=true";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Delete Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Deleting your account will permanently remove:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                <li>Your user profile and account credentials</li>
                <li>All uploaded documents and files</li>
                <li>All emission entries and calculations</li>
                <li>All generated compliance reports</li>
                <li>All supplier ESG assessments</li>
                <li>All audit logs and activity history</li>
              </ul>
            </div>

            <div className="space-y-2 border-t pt-4">
              <p className="text-sm text-gray-600">
                <strong>Data Retention:</strong> Per GDPR requirements, all personal data will be
                deleted. Some anonymized audit records may be retained for legal compliance.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setStep(2)}>
                I Understand, Proceed to Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Confirm Account Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Confirm Your Email</Label>
            <Input
              id="email"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Confirm Your Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || !password || !confirmEmail}
            >
              {loading ? "Deleting..." : "Permanently Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
