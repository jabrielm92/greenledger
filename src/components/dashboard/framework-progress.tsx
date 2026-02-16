"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FrameworkItem {
  id: string;
  name: string;
  completionPct: number;
  status: string;
  targetYear: number;
}

interface FrameworkProgressProps {
  frameworks: FrameworkItem[];
  className?: string;
}

function statusLabel(status: string) {
  switch (status) {
    case "NOT_STARTED":
      return "Not Started";
    case "IN_PROGRESS":
      return "In Progress";
    case "REVIEW":
      return "Under Review";
    case "SUBMITTED":
      return "Submitted";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "REVIEW":
      return "bg-yellow-100 text-yellow-700";
    case "SUBMITTED":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function FrameworkProgress({
  frameworks,
  className,
}: FrameworkProgressProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Framework Progress</CardTitle>
        <CardDescription>
          Compliance completion across active frameworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {frameworks.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            No frameworks selected yet.{" "}
            <Link href="/dashboard/settings" className="text-emerald-600 hover:underline">
              Add frameworks
            </Link>
          </p>
        ) : (
          <div className="space-y-5">
            {frameworks.map((fw) => (
              <div key={fw.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{fw.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", statusColor(fw.status))}
                    >
                      {statusLabel(fw.status)}
                    </Badge>
                  </div>
                  <span className="text-sm text-slate-500">
                    {Math.round(fw.completionPct)}%
                  </span>
                </div>
                <Progress value={fw.completionPct} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
