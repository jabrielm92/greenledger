"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  FileCheck,
  Gauge,
  Clock,
} from "lucide-react";
import { formatEmissions } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
  daysUntilDeadline?: number | null;
}

export function StatsCards({ stats, isLoading, daysUntilDeadline }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-1 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Compliance Score",
      value: stats ? `${Math.round(stats.complianceScore)}%` : "0%",
      subtitle: stats && stats.complianceScore > 70
        ? "On track"
        : stats && stats.complianceScore > 40
        ? "Needs attention"
        : "Action required",
      icon: Gauge,
      color: stats && stats.complianceScore > 70
        ? "text-emerald-600"
        : stats && stats.complianceScore > 40
        ? "text-yellow-600"
        : "text-red-600",
    },
    {
      title: "Total Emissions",
      value: stats ? formatEmissions(stats.totalEmissions) : "0 tCO2e",
      subtitle: `Scope 1: ${stats ? formatEmissions(stats.totalScope1) : "0"} | Scope 2: ${stats ? formatEmissions(stats.totalScope2) : "0"}`,
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      title: "Documents Processed",
      value: stats ? `${stats.documentsCount}` : "0",
      subtitle: stats?.pendingReviews
        ? `${stats.pendingReviews} pending review`
        : "No pending reviews",
      icon: FileCheck,
      color: "text-purple-600",
    },
    {
      title: "Days Until Deadline",
      value: daysUntilDeadline != null ? `${daysUntilDeadline}` : "—",
      subtitle: daysUntilDeadline != null && daysUntilDeadline < 30
        ? "Deadline approaching"
        : "Next compliance deadline",
      icon: Clock,
      color: daysUntilDeadline != null && daysUntilDeadline < 30
        ? "text-red-600"
        : "text-slate-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
              <Icon className={cn("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-slate-500">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
