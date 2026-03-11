"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ComplianceScoreProps {
  score: number;
  className?: string;
}

export function ComplianceScore({ score, className }: ComplianceScoreProps) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score > 70
      ? "text-emerald-600"
      : score > 40
      ? "text-amber-500"
      : score > 0
      ? "text-orange-500"
      : "text-slate-400";

  const strokeColor =
    score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : score > 0 ? "#f97316" : "#cbd5e1";

  const bgGlow =
    score > 70
      ? "shadow-emerald-100"
      : score > 40
      ? "shadow-amber-100"
      : score > 0
      ? "shadow-orange-100"
      : "";

  const label =
    score > 70
      ? "Great progress on compliance"
      : score > 40
      ? "Some areas need attention"
      : score > 0
      ? "Keep uploading documents"
      : "Upload documents to get started";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Compliance Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-5">
        <div className={cn("relative h-40 w-40 rounded-full", bgGlow && `shadow-lg ${bgGlow}`)}>
          <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="12"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: score > 0 ? `drop-shadow(0 0 6px ${strokeColor}40)` : "none" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-extrabold tracking-tight", color)}>
              {Math.round(score)}
            </span>
            <span className={cn("text-sm font-medium -mt-0.5", color)}>%</span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-slate-500">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
