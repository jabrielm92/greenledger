"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Target,
  Brain,
  Scale,
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FRAMEWORK_GUIDES,
  getRelevanceLevel,
  getUKComplianceBanner,
  getRegulatorySummary,
  type OrgContext,
  type FrameworkGuide,
} from "@/components/dashboard/frameworks/framework-data";

interface ActiveFramework {
  id: string;
  frameworkName: string;
  displayName: string;
  status: string;
  completionPct: number;
  targetYear: number;
}

interface GuideData {
  country: string | null;
  industry: string | null;
  employeeCount: number | null;
  companyName: string | null;
  activeFrameworks: ActiveFramework[];
}

function relevanceBadge(level: "mandatory" | "recommended" | "optional") {
  switch (level) {
    case "mandatory":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Mandatory
        </Badge>
      );
    case "recommended":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Recommended
        </Badge>
      );
    case "optional":
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
          Optional
        </Badge>
      );
  }
}

function FrameworkCard({
  guide,
  ctx,
  isActive,
}: {
  guide: FrameworkGuide;
  ctx: OrgContext;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const relevance = getRelevanceLevel(guide.id, ctx.country, ctx.industry);
  const industryNote =
    ctx.industry && guide.industryNotes[ctx.industry]
      ? guide.industryNotes[ctx.industry]
      : null;

  return (
    <Card
      className={cn(
        "transition-all",
        isActive && "border-emerald-300 ring-1 ring-emerald-200",
        relevance === "mandatory" && !isActive && "border-red-200"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{guide.name}</CardTitle>
              {relevanceBadge(relevance)}
              {isActive && (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  Active
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">
              {guide.fullName}
            </CardDescription>
            <p className="text-xs text-slate-400 italic">{guide.tagline}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* WHAT */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
            <BookOpen className="h-4 w-4 text-blue-600" />
            What is it?
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">{guide.what}</p>
        </div>

        {/* WHY — personalised */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
            <Target className="h-4 w-4 text-amber-600" />
            Why does it matter to {ctx.companyName || "your company"}?
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {guide.why(ctx)}
          </p>
        </div>

        {/* Industry-specific note */}
        {industryNote && (
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Industry insight: </span>
              {industryNote}
            </p>
          </div>
        )}

        {/* HOW — expandable */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-between text-slate-700 hover:text-slate-900"
        >
          <span className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-purple-600" />
            <span className="font-semibold text-sm">
              How to comply — step by step
            </span>
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expanded && (
          <div className="space-y-4 pl-1">
            {/* Steps */}
            <ol className="space-y-2">
              {guide.how.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-700">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            {/* Key Topics */}
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Key Disclosure Topics
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {guide.keyTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Deadlines */}
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Key Deadlines
              </h5>
              <ul className="space-y-1">
                {guide.deadlines.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* How GreenLedger helps */}
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-2">
                <Sparkles className="h-4 w-4" />
                How GreenLedger helps
              </h5>
              <ul className="space-y-1.5">
                {guide.greenledgerHelps.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-emerald-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applicability */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Mandatory for
                </h5>
                <ul className="space-y-0.5">
                  {guide.mandatoryFor.map((m, i) => (
                    <li key={i} className="text-xs text-slate-600">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Voluntary for
                </h5>
                <ul className="space-y-0.5">
                  {guide.voluntaryFor.map((v, i) => (
                    <li key={i} className="text-xs text-slate-600">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function FrameworksGuidePage() {
  const [data, setData] = useState<GuideData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/frameworks-guide");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch frameworks guide data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const ctx: OrgContext = {
    country: data?.country ?? null,
    industry: data?.industry ?? null,
    employeeCount: data?.employeeCount ?? null,
    companyName: data?.companyName ?? null,
  };

  const ukBanner = getUKComplianceBanner(ctx.country);
  const regulatorySummary = getRegulatorySummary(ctx.country);

  // Map active framework names to our guide IDs
  const activeFrameworkIds = new Set(
    (data?.activeFrameworks ?? []).map((af) => {
      // Normalise: ISSB_S1 / ISSB_S2 → ISSB
      if (af.frameworkName.startsWith("ISSB")) return "ISSB";
      return af.frameworkName;
    })
  );

  // Sort: mandatory first, then recommended, then optional. Active ones bubble up within each group.
  const sortedGuides = [...FRAMEWORK_GUIDES].sort((a, b) => {
    const order = { mandatory: 0, recommended: 1, optional: 2 };
    const aLevel = getRelevanceLevel(a.id, ctx.country, ctx.industry);
    const bLevel = getRelevanceLevel(b.id, ctx.country, ctx.industry);
    const aActive = activeFrameworkIds.has(a.id) ? 0 : 1;
    const bActive = activeFrameworkIds.has(b.id) ? 0 : 1;
    if (order[aLevel] !== order[bLevel]) return order[aLevel] - order[bLevel];
    return aActive - bActive;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Frameworks Guide"
          description="Loading your personalised compliance guidance..."
        />
        <div className="grid gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-72 animate-pulse rounded bg-slate-100 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frameworks Guide"
        description="Your ESG consultant — understand what frameworks apply, why they matter, and how to comply"
      />

      {/* Regulatory overview card */}
      <Card className="bg-slate-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">
              Your Regulatory Landscape
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 leading-relaxed">
            {regulatorySummary}
          </p>
          {data?.activeFrameworks && data.activeFrameworks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.activeFrameworks.map((af) => (
                <Badge
                  key={af.id}
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                >
                  {af.displayName} — {Math.round(af.completionPct)}% complete
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* UK compliance alert */}
      {ukBanner && (
        <Alert className="border-amber-300 bg-amber-50">
          <Shield className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">
            UK Compliance — Mandatory Reporting Ahead
          </AlertTitle>
          <AlertDescription className="text-amber-700 text-sm leading-relaxed mt-1">
            {ukBanner}
          </AlertDescription>
        </Alert>
      )}

      {/* AI consultant value prop */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <Brain className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Your AI-Powered ESG Consultant
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              GreenLedger acts as your in-house ESG compliance team. We
              automatically map your uploaded documents and emissions data to the
              right framework requirements, track your progress, flag gaps, and
              generate audit-ready reports — all included in your monthly plan.
              No expensive consultants needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Framework guides */}
      <div className="grid gap-6">
        {sortedGuides.map((guide) => (
          <FrameworkCard
            key={guide.id}
            guide={guide}
            ctx={ctx}
            isActive={activeFrameworkIds.has(guide.id)}
          />
        ))}
      </div>
    </div>
  );
}
