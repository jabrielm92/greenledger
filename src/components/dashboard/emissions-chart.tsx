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
}

interface EmissionsChartProps {
  data: EmissionsDataPoint[];
  className?: string;
}

const defaultData: EmissionsDataPoint[] = [
  { month: "Jan", scope1: 0, scope2: 0 },
  { month: "Feb", scope1: 0, scope2: 0 },
  { month: "Mar", scope1: 0, scope2: 0 },
  { month: "Apr", scope1: 0, scope2: 0 },
  { month: "May", scope1: 0, scope2: 0 },
  { month: "Jun", scope1: 0, scope2: 0 },
  { month: "Jul", scope1: 0, scope2: 0 },
  { month: "Aug", scope1: 0, scope2: 0 },
  { month: "Sep", scope1: 0, scope2: 0 },
  { month: "Oct", scope1: 0, scope2: 0 },
  { month: "Nov", scope1: 0, scope2: 0 },
  { month: "Dec", scope1: 0, scope2: 0 },
];

export function EmissionsChart({ data, className }: EmissionsChartProps) {
  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Emissions Over Time</CardTitle>
        <CardDescription>
          Monthly Scope 1 & 2 emissions (tCO2e)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
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
                  name === "scope1" ? "Scope 1" : "Scope 2",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "scope1" ? "Scope 1" : "Scope 2"
                }
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
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
