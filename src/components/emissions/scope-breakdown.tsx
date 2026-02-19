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

const COLORS = [
  "#059669",
  "#2563eb",
  "#d97706",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#65a30d",
  "#be185d",
];

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
        <CardHeader>
          <CardTitle className="text-base">Monthly Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {byMonth.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}t` : `${v}kg`
                    }
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatEmissions(value),
                      name === "scope1" ? "Scope 1" : "Scope 2",
                    ]}
                  />
                  <Legend
                    formatter={(v) =>
                      v === "scope1" ? "Scope 1" : "Scope 2"
                    }
                  />
                  <Bar
                    dataKey="scope1"
                    stackId="a"
                    fill="#f97316"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="scope2"
                    stackId="a"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category donut chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emissions by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {byCategory.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="totalCo2e"
                    nameKey="category"
                    label={({ category, percentage }) =>
                      `${category} (${percentage.toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {byCategory.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      formatEmissions(value),
                      "Emissions",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
