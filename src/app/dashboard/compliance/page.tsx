"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Circle,
  TrendingUp,
  FileText,
  Truck,
  Flame,
  Zap,
  Leaf,
  ChevronDown,
  ChevronUp,
  Target,
  LayoutGrid,
  Database,
} from "lucide-react";

interface ScoringFactor {
  id: string;
  label: string;
  category: string;
  status: "complete" | "partial" | "missing";
  score: number;
  maxScore: number;
  description: string;
  action?: string;
}

interface FrameworkSection {
  code: string;
  title: string;
  totalPoints: number;
  coveredPoints: number;
  status: "complete" | "partial" | "missing";
  missingItems: string[];
}

interface FrameworkBreakdown {
  frameworkId: string;
  frameworkName: string;
  displayName: string;
  completionPct: number;
  status: string;
  targetYear: number;
  dueDate: string | null;
  totalDataPoints: number;
  coveredDataPoints: number;
  sections: FrameworkSection[];
}

interface Recommendation {
  priority: "high" | "medium" | "low";
  label: string;
  action: string;
  potentialGain: number;
}

interface BreakdownData {
  overallScore: number;
  frameworkScore: number;
  dataReadinessScore: number;
  totalScore: number;
  maxPossibleScore: number;
  factors: ScoringFactor[];
  frameworks: FrameworkBreakdown[];
  recommendations: Recommendation[];
  dataSummary: {
    emissionCategories: number;
    documentsProcessed: number;
    documentsTotal: number;
    documentTypes: string[];
    suppliersScored: number;
    suppliersTotal: number;
    reportsGenerated: number;
    hasScope1: boolean;
    hasScope2: boolean;
    hasScope3: boolean;
  };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  emissions: <Flame className="h-4 w-4 text-orange-500" />,
  documents: <FileText className="h-4 w-4 text-blue-500" />,
  suppliers: <Truck className="h-4 w-4 text-purple-500" />,
  reports: <Target className="h-4 w-4 text-emerald-500" />,
  governance: <Leaf className="h-4 w-4 text-teal-500" />,
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  complete: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  partial: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  missing: <Circle className="h-4 w-4 text-slate-300" />,
};

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : score > 0 ? "#f97316" : "#cbd5e1";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="12"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-extrabold tracking-tight"
          style={{ color }}
        >
          {Math.round(score)}
        </span>
        <span className="text-sm font-medium -mt-0.5" style={{ color }}>
          %
        </span>
      </div>
    </div>
  );
}

function FactorRow({ factor }: { factor: ScoringFactor }) {
  const pct = factor.maxScore > 0 ? (factor.score / factor.maxScore) * 100 : 0;

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div className="mt-0.5">{STATUS_ICON[factor.status]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {CATEGORY_ICONS[factor.category]}
          <span className="text-sm font-medium text-slate-900">
            {factor.label}
          </span>
          <span className="ml-auto text-xs font-mono text-slate-400 whitespace-nowrap">
            {factor.score}/{factor.maxScore}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{factor.description}</p>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              factor.status === "complete"
                ? "bg-emerald-500"
                : factor.status === "partial"
                ? "bg-amber-400"
                : "bg-slate-200"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        {factor.action && (
          <div className="mt-2 flex items-start gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5">
            <Zap className="mt-0.5 h-3 w-3 shrink-0 text-blue-600" />
            <span className="text-xs text-blue-700">{factor.action}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FrameworkDetail({ fw, defaultExpanded }: { fw: FrameworkBreakdown; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const completeSections = fw.sections.filter((s) => s.status === "complete").length;
  const totalSections = fw.sections.filter((s) => s.totalPoints > 0).length;

  return (
    <Card id={`fw-${fw.frameworkId}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{fw.displayName}</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Year: {fw.targetYear}
              {fw.dueDate && (
                <>
                  {" "}
                  &middot; Due:{" "}
                  {new Date(fw.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-600">
              {Math.round(fw.completionPct)}%
            </span>
            <p className="text-[10px] text-slate-400">
              {fw.coveredDataPoints}/{fw.totalDataPoints} data points
            </p>
          </div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${fw.completionPct}%` }}
          />
        </div>
        {fw.totalDataPoints > 0 && (
          <p className="mt-2 text-[11px] text-slate-500">
            This percentage is based on {fw.coveredDataPoints} of {fw.totalDataPoints} required data points being satisfied by your uploaded emissions data, documents, and supplier information.
          </p>
        )}
        {fw.totalDataPoints === 0 && (
          <p className="mt-2 text-[11px] text-amber-600">
            This framework uses estimated progress based on your overall data coverage (emissions, documents, suppliers). Detailed data point tracking is coming soon.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {totalSections > 0 ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full justify-between text-slate-600"
            >
              <span className="text-xs">
                {completeSections}/{totalSections} sections complete
              </span>
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {expanded && (
              <div className="mt-3 space-y-2">
                {fw.sections
                  .filter((s) => s.totalPoints > 0)
                  .map((section) => (
                    <div
                      key={section.code}
                      className="rounded-lg border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        {STATUS_ICON[section.status]}
                        <span className="text-xs font-medium text-slate-800">
                          {section.code} — {section.title}
                        </span>
                        <span className="ml-auto text-[10px] text-slate-400">
                          {section.coveredPoints}/{section.totalPoints}
                        </span>
                      </div>
                      {section.missingItems.length > 0 && (
                        <div className="mt-1.5 pl-6">
                          <p className="text-[10px] font-medium text-slate-400 uppercase mb-0.5">
                            Missing:
                          </p>
                          <ul className="space-y-0.5">
                            {section.missingItems.map((item, i) => (
                              <li
                                key={i}
                                className="text-xs text-slate-500 flex items-center gap-1"
                              >
                                <Circle className="h-1.5 w-1.5 text-red-300" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-400 py-1">
            Detailed section breakdown will be available once framework data points are configured.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ComplianceBreakdownPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <PageHeader
            title="Compliance Score Breakdown"
            description="Loading your compliance analysis..."
          />
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ComplianceBreakdownContent />
    </Suspense>
  );
}

function ComplianceBreakdownContent() {
  const searchParams = useSearchParams();
  const focusFrameworkId = searchParams.get("framework");
  const [data, setData] = useState<BreakdownData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/compliance-breakdown")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Auto-scroll to focused framework
  useEffect(() => {
    if (data && focusFrameworkId) {
      const el = document.getElementById(`fw-${focusFrameworkId}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    }
  }, [data, focusFrameworkId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Compliance Score Breakdown"
          description="Loading your compliance analysis..."
        />
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compliance Score Breakdown" />
        <p className="text-sm text-slate-500">Failed to load compliance data.</p>
      </div>
    );
  }

  const _completeFactors = data.factors.filter((f) => f.status === "complete").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Score Breakdown"
        description="Understand how your score is calculated and what to do next"
      />

      {/* Score overview */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <ScoreRing score={data.overallScore} />
            <p className="mt-3 text-sm font-medium text-slate-700">
              Overall Compliance Score
            </p>

            {/* Score composition */}
            <div className="mt-3 w-full space-y-2">
              <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2">
                <LayoutGrid className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="text-xs text-blue-700 flex-1">Framework Completion</span>
                <span className="text-xs font-bold text-blue-700">{data.frameworkScore}%</span>
                <span className="text-[10px] text-blue-400">x 70%</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2">
                <Database className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs text-emerald-700 flex-1">Data Readiness</span>
                <span className="text-xs font-bold text-emerald-700">{data.dataReadinessScore}%</span>
                <span className="text-[10px] text-emerald-400">x 30%</span>
              </div>
            </div>

            {/* Quick data summary */}
            <div className="mt-4 w-full grid grid-cols-2 gap-2">
              {[
                {
                  label: "Scopes Tracked",
                  value: [data.dataSummary.hasScope1, data.dataSummary.hasScope2, data.dataSummary.hasScope3].filter(Boolean).length + "/3",
                },
                {
                  label: "Documents",
                  value: `${data.dataSummary.documentsProcessed}`,
                },
                {
                  label: "Suppliers",
                  value: `${data.dataSummary.suppliersScored}/${data.dataSummary.suppliersTotal}`,
                },
                {
                  label: "Reports",
                  value: `${data.dataSummary.reportsGenerated}`,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md bg-slate-50 px-2.5 py-2 text-center"
                >
                  <p className="text-lg font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data readiness factors */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-emerald-600" />
              Data Readiness
            </CardTitle>
            <p className="text-xs text-slate-500">
              How complete your uploaded data is across key areas (30% of overall score)
            </p>
          </CardHeader>
          <CardContent>
            {data.factors.map((factor) => (
              <FactorRow key={factor.id} factor={factor} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              How to Improve Your Score
            </CardTitle>
            <p className="text-xs text-slate-500">
              Prioritized actions to improve your compliance score
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border bg-white p-3"
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 mt-0.5 text-[10px]",
                    rec.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : rec.priority === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {rec.priority === "high"
                    ? "High Impact"
                    : rec.priority === "medium"
                    ? "Medium"
                    : "Low"}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {rec.label}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{rec.action}</p>
                </div>
                <span className="shrink-0 text-xs font-mono text-emerald-600">
                  +{rec.potentialGain}pts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Framework breakdowns (70% of overall score) */}
      {data.frameworks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-700">
              Framework Completion (70% of overall score)
            </h3>
          </div>
          <div className="grid gap-4">
            {data.frameworks.map((fw) => (
              <FrameworkDetail
                key={fw.frameworkId}
                fw={fw}
                defaultExpanded={fw.frameworkId === focusFrameworkId}
              />
            ))}
          </div>
        </div>
      )}

      {/* No frameworks */}
      {data.frameworks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-slate-500">
              No compliance frameworks are active yet.
            </p>
            <Link href="/dashboard/settings/frameworks">
              <Button variant="outline" size="sm" className="mt-3">
                <ArrowRight className="mr-2 h-4 w-4" />
                Set Up Frameworks
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
