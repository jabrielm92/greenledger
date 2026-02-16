"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ComplianceScoreProps {
  score: number;
  className?: string;
}

export function ComplianceScore({ score, className }: ComplianceScoreProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score > 70
      ? "text-emerald-600"
      : score > 40
      ? "text-yellow-500"
      : "text-red-500";

  const strokeColor =
    score > 70 ? "#059669" : score > 40 ? "#eab308" : "#ef4444";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Compliance Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg className="h-36 w-36 -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold", color)}>
              {Math.round(score)}%
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {score > 70
            ? "Great progress on compliance"
            : score > 40
            ? "Some areas need attention"
            : "Get started with data entry"}
        </p>
      </CardContent>
    </Card>
  );
}
