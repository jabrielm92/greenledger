"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatEmissions } from "@/lib/utils";
import type { CategoryBreakdown, MonthlyEmission } from "@/types";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonth(v: string): string {
  if (v.includes("-")) {
    const m = parseInt(v.split("-")[1], 10);
    return MONTH_NAMES[m - 1] || v;
  }
  return v;
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#ec4899",
];

const SCOPE_LABELS: Record<string, string> = {
  scope1: "Scope 1 — Direct",
  scope2: "Scope 2 — Energy",
  scope3: "Scope 3 — Value Chain",
};

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label ? formatMonth(label) : ""}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6 py-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-slate-600">{SCOPE_LABELS[entry.dataKey] || entry.dataKey}</span>
          </div>
          <span className="text-xs font-semibold tabular-nums text-slate-900">{formatEmissions(entry.value)}</span>
        </div>
      ))}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-xs font-medium text-slate-500">Total</span>
        <span className="text-xs font-bold tabular-nums text-slate-900">{formatEmissions(total)}</span>
      </div>
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percentage?: number } }> }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold text-slate-700">{entry.name}</p>
      <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">{formatEmissions(entry.value)}</p>
      {entry.payload.percentage != null && (
        <p className="text-xs text-slate-500">{entry.payload.percentage.toFixed(1)}% of total</p>
      )}
    </div>
  );
}

interface ScopeBreakdownProps {
  byCategory: CategoryBreakdown[];
  byMonth: MonthlyEmission[];
  className?: string;
}

export function ScopeBreakdown({
  byCategory,
  byMonth,
  className,
}: ScopeBreakdownProps) {
  return (
    <div className={`grid gap-6 lg:grid-cols-2 ${className || ""}`}>
      {/* Monthly stacked bar chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Monthly Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] sm:h-[320px]">
            {byMonth.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMonth} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barScope1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="barScope2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="barScope3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatMonth}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}t` : `${v}kg`
                    }
                    dx={-4}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "#f8fafc", radius: 4 }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span className="text-xs font-medium text-slate-600">{SCOPE_LABELS[v] || v}</span>
                    )}
                    wrapperStyle={{ paddingTop: 12 }}
                  />
                  <Bar
                    dataKey="scope1"
                    stackId="a"
                    fill="url(#barScope1)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="scope2"
                    stackId="a"
                    fill="url(#barScope2)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="scope3"
                    stackId="a"
                    fill="url(#barScope3)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category donut chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Emissions by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] sm:h-[320px]">
            {byCategory.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    dataKey="totalCo2e"
                    nameKey="category"
                    paddingAngle={2}
                    cornerRadius={4}
                    label={({ category, percentage }) =>
                      `${category} ${percentage.toFixed(0)}%`
                    }
                    labelLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                  >
                    {byCategory.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
