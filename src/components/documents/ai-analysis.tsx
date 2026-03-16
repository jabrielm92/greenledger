"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BookOpen, Leaf, BarChart3, Lightbulb } from "lucide-react";

interface DocumentAnalysis {
  summary: string;
  esgRelevance: {
    frameworks: string[];
    scope: string | null;
    category: string | null;
    relevanceLevel: "high" | "medium" | "low";
    explanation: string;
  };
  metricsBreakdown: {
    metric: string;
    value: string;
    unit: string | null;
    calculationMethod: string;
  }[];
  recommendations: string[];
}

interface AIAnalysisProps {
  analysis: DocumentAnalysis;
}

const relevanceColors = {
  high: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

export function AIAnalysis({ analysis }: AIAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Leaf className="h-4 w-4 text-emerald-600" />
          AI Document Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary */}
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <BookOpen className="h-3.5 w-3.5" />
            Summary
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            {analysis.summary}
          </p>
        </div>

        <Separator />

        {/* ESG Relevance */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Leaf className="h-3.5 w-3.5" />
            ESG Compliance Relevance
          </div>
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  relevanceColors[analysis.esgRelevance.relevanceLevel]
                )}
              >
                {analysis.esgRelevance.relevanceLevel.toUpperCase()} relevance
              </Badge>
              {analysis.esgRelevance.scope && (
                <Badge variant="secondary" className="text-xs">
                  {analysis.esgRelevance.scope}
                </Badge>
              )}
              {analysis.esgRelevance.category && (
                <Badge variant="secondary" className="text-xs bg-slate-100">
                  {analysis.esgRelevance.category}
                </Badge>
              )}
            </div>

            {analysis.esgRelevance.frameworks.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {analysis.esgRelevance.frameworks.map((fw) => (
                  <Badge
                    key={fw}
                    variant="outline"
                    className="text-xs border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    {fw}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-sm leading-relaxed text-slate-600">
              {analysis.esgRelevance.explanation}
            </p>
          </div>
        </div>

        {/* Metrics Breakdown */}
        {analysis.metricsBreakdown.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <BarChart3 className="h-3.5 w-3.5" />
                Metrics & Calculation Methods
              </div>
              <div className="space-y-3">
                {analysis.metricsBreakdown.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        {m.metric}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-emerald-700">
                        {m.value}
                        {m.unit ? ` ${m.unit}` : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {m.calculationMethod}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Lightbulb className="h-3.5 w-3.5" />
                Recommendations
              </div>
              <ul className="space-y-1.5">
                {analysis.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
