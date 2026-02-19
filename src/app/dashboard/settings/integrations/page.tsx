"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
  Unplug,
  Upload,
} from "lucide-react";

interface IntegrationStatus {
  quickbooks: {
    connected: boolean;
    companyName?: string;
    lastSync?: string;
    realmId?: string;
  };
}

interface SyncHistoryItem {
  id: string;
  createdAt: string;
  newValue: {
    expensesImported?: number;
    billsImported?: number;
    vendorsImported?: number;
    errors?: number;
  };
}

function IntegrationsPageContent() {
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success");
  const errorParam = searchParams.get("error");

  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string>("");

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/integrations/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          setSyncHistory(data.syncHistory || []);
        }
      } catch (err) {
        console.error("Failed to fetch integration status:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult("");
    try {
      const res = await fetch("/api/quickbooks/sync", { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        setSyncResult(
          `Synced: ${result.expensesImported} expenses, ${result.billsImported} bills, ${result.vendorsImported} vendors`
        );
      } else {
        const err = await res.json();
        setSyncResult(`Error: ${err.error}`);
      }
    } catch (_err) {
      setSyncResult("Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect QuickBooks? This won't delete any imported data."))
      return;
    try {
      await fetch("/api/quickbooks/disconnect", { method: "POST" });
      setStatus((prev) =>
        prev
          ? { ...prev, quickbooks: { connected: false } }
          : prev
      );
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect external services to auto-import data"
      />

      {successParam === "quickbooks_connected" && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="py-4">
            <p className="text-sm text-emerald-700">
              QuickBooks connected successfully!
            </p>
          </CardContent>
        </Card>
      )}

      {errorParam && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-700">
              Connection failed: {errorParam.replace(/_/g, " ")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* QuickBooks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-lg font-bold text-emerald-700">
                QB
              </div>
              <div>
                <CardTitle className="text-base">QuickBooks Online</CardTitle>
                <p className="text-xs text-slate-500">
                  Auto-import utility expenses, fuel purchases, travel costs, and
                  supplier spend
                </p>
              </div>
            </div>
            {status?.quickbooks.connected ? (
              <Badge className="bg-emerald-100 text-emerald-700">
                <Check className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">Not Connected</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : status?.quickbooks.connected ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                {status.quickbooks.companyName && (
                  <p>
                    Connected as{" "}
                    <strong>{status.quickbooks.companyName}</strong>
                  </p>
                )}
                {status.quickbooks.lastSync && (
                  <p className="text-xs text-slate-400">
                    Last synced:{" "}
                    {format(
                      new Date(status.quickbooks.lastSync),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 h-3 w-3" />
                  )}
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={handleDisconnect}
                >
                  <Unplug className="mr-1 h-3 w-3" />
                  Disconnect
                </Button>
              </div>

              {syncResult && (
                <p className="text-xs text-slate-600">{syncResult}</p>
              )}

              {/* Sync history */}
              {syncHistory.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Recent Syncs
                  </p>
                  <div className="space-y-1">
                    {syncHistory.slice(0, 10).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between rounded bg-slate-50 px-3 py-1.5 text-xs"
                      >
                        <span className="text-slate-500">
                          {format(
                            new Date(entry.createdAt),
                            "MMM d, h:mm a"
                          )}
                        </span>
                        <span className="text-slate-600">
                          {entry.newValue.expensesImported ?? 0} expenses,{" "}
                          {entry.newValue.vendorsImported ?? 0} vendors
                          {(entry.newValue.errors ?? 0) > 0 && (
                            <span className="text-red-500">
                              {" "}
                              ({entry.newValue.errors} errors)
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href="/api/quickbooks/connect">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect QuickBooks
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Xero — Coming Soon */}
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-700">
                X
              </div>
              <div>
                <CardTitle className="text-base">Xero</CardTitle>
                <p className="text-xs text-slate-500">
                  Import accounting data from Xero
                </p>
              </div>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Manual upload */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Upload className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-base">Manual Upload</CardTitle>
                <p className="text-xs text-slate-500">
                  Upload documents directly — always available
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">Available</Badge>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense>
      <IntegrationsPageContent />
    </Suspense>
  );
}
