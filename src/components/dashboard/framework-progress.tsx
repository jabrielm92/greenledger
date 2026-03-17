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
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrameworkItem {
  id: string;
  name: string;
  completionPct: number;
  coveredDataPoints: number;
  totalDataPoints: number;
  status: string;
  targetYear: number;
  dueDate: string | null;
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Framework Progress</CardTitle>
        <CardDescription className="text-xs">
          Compliance completion across active frameworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {frameworks.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            No frameworks selected yet.{" "}
            <Link href="/dashboard/settings/frameworks" className="text-emerald-600 hover:underline">
              Add frameworks
            </Link>
          </p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {frameworks.map((fw) => (
              <Link
                key={fw.id}
                href={`/dashboard/compliance?framework=${fw.id}`}
                className="block"
              >
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 transition-all hover:bg-slate-100/80 hover:border-slate-200 hover:shadow-sm cursor-pointer group">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{fw.name}</span>
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px] px-1.5 py-0 shrink-0 whitespace-nowrap", statusColor(fw.status))}
                      >
                        {statusLabel(fw.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <span className="text-xs sm:text-sm font-bold tabular-nums text-slate-700">
                        {Math.round(fw.completionPct)}%
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                  <Progress value={fw.completionPct} className="h-2" />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {fw.coveredDataPoints}/{fw.totalDataPoints} data points covered
                    </span>
                    {fw.dueDate && (
                      <span>
                        Due {new Date(fw.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
