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
  scope1: "Scope 1",
  scope2: "Scope 2",
  scope3: "Scope 3",
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

export function EmissionsChart({ data, className }: EmissionsChartProps) {
  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Emissions Over Time</CardTitle>
        <CardDescription>
          Monthly Scope 1, 2 & 3 emissions (tCO2e)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={formatMonth}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} tCO2e`,
                  SCOPE_LABELS[name] || name,
                ]}
              />
              <Legend
                formatter={(value) => SCOPE_LABELS[value] || value}
              />
              <Area
                type="monotone"
                dataKey="scope1"
                stackId="1"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="scope2"
                stackId="1"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="scope3"
                stackId="1"
                stroke="#d97706"
                fill="#d97706"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
