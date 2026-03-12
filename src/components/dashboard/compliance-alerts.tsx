"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ComplianceAlert {
  id: string;
  frameworkName: string;
  dueDate: string;
  daysRemaining: number;
  completionPercentage: number;
  urgency: string;
}

export function ComplianceAlerts() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/compliance-alerts")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setAlerts(data.items || []))
      .catch(() => setAlerts([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4" />
            Compliance Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 rounded bg-slate-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4" />
            Compliance Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            No upcoming deadlines. Set due dates on your frameworks in settings.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4" />
            Compliance Deadlines
          </CardTitle>
          <Link
            href="/dashboard/frameworks"
            className="text-xs text-emerald-600 hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              {alert.urgency === "critical" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : alert.urgency === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <Calendar className="h-4 w-4 text-blue-500" />
              )}
              <div>
                <p className="text-sm font-medium">{alert.frameworkName}</p>
                <p className="text-xs text-slate-500">
                  {alert.daysRemaining > 0
                    ? `${alert.daysRemaining} days remaining`
                    : `${Math.abs(alert.daysRemaining)} days overdue`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(100, alert.completionPercentage)}%`,
                  }}
                />
              </div>
              <Badge
                variant="secondary"
                className={
                  alert.urgency === "critical"
                    ? "bg-red-100 text-red-700"
                    : alert.urgency === "warning"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }
              >
                {alert.completionPercentage}%
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
