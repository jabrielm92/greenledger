"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  FileCheck,
  BarChart3,
  FileText,
  Users,
  Settings,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { AuditLogEntry } from "@/types";

interface RecentActivityProps {
  activities: AuditLogEntry[];
  className?: string;
}

function getActivityIcon(entityType: string) {
  switch (entityType.toLowerCase()) {
    case "document":
      return Upload;
    case "emissionentry":
      return BarChart3;
    case "report":
      return FileText;
    case "supplier":
      return Users;
    case "organization":
      return Settings;
    default:
      return Activity;
  }
}

function formatAction(action: string, entityType: string): string {
  const entity = entityType.toLowerCase().replace(/([A-Z])/g, " $1").trim();
  switch (action) {
    case "entity_created":
      return `created a ${entity}`;
    case "entity_updated":
      return `updated a ${entity}`;
    case "entity_deleted":
      return `deleted a ${entity}`;
    case "document_uploaded":
      return "uploaded a document";
    case "document_extracted":
      return "extracted data from a document";
    case "report_generated":
      return "generated a report";
    default:
      return `${action.replace(/_/g, " ")} ${entity}`;
  }
}

export function RecentActivity({
  activities,
  className,
}: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest actions in your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No recent activity. Get started by uploading a document.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.entityType);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.userName || "System"}
                      </span>{" "}
                      {formatAction(activity.action, activity.entityType)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
