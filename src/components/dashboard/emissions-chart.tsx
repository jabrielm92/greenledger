"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EmissionsDataPoint {
  month: string;
  scope1: number;
  scope2: number;
  scope3: number;
}

interface EmissionsChartProps {
  data: EmissionsDataPoint[];
  className?: string;
}

const SCOPE_LABELS: Record<string, string> = {
  scope1: "Scope 1 — Direct",
  scope2: "Scope 2 — Energy",
  scope3: "Scope 3 — Value Chain",
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Format "YYYY-MM" → "Mon 'YY" (e.g. "Sep '25"). Falls through for short names. */
function formatMonth(month: string): string {
  if (month.includes("-")) {
    const [y, m] = month.split("-");
    return `${MONTH_NAMES[parseInt(m, 10) - 1]} '${y.slice(2)}`;
  }
  return month;
}

const defaultData: EmissionsDataPoint[] = MONTH_NAMES.map((m) => ({
  month: m,
  scope1: 0,
  scope2: 0,
  scope3: 0,
}));

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
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
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-600">
              {SCOPE_LABELS[entry.dataKey] || entry.dataKey}
            </span>
          </div>
          <span className="text-xs font-semibold tabular-nums text-slate-900">
            {entry.value.toFixed(1)} tCO2e
          </span>
        </div>
      ))}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-xs font-medium text-slate-500">Total</span>
        <span className="text-xs font-bold tabular-nums text-slate-900">
          {total.toFixed(1)} tCO2e
        </span>
      </div>
    </div>
  );
}

export function EmissionsChart({ data, className }: EmissionsChartProps) {
  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Emissions Over Time</CardTitle>
        <CardDescription className="text-xs">
          Monthly Scope 1, 2 & 3 emissions (tCO2e)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gradScope1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradScope2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradScope3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
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
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                }
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs font-medium text-slate-600">
                    {SCOPE_LABELS[value] || value}
                  </span>
                )}
                wrapperStyle={{ paddingTop: 12 }}
              />
              <Area
                type="monotone"
                dataKey="scope1"
                stackId="1"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#gradScope1)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#10b981" }}
              />
              <Area
                type="monotone"
                dataKey="scope2"
                stackId="1"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#gradScope2)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#3b82f6" }}
              />
              <Area
                type="monotone"
                dataKey="scope3"
                stackId="1"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fill="url(#gradScope3)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#f59e0b" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
