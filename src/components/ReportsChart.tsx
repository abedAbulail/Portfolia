"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartPoint {
  label: string;
  value: number;
}

interface ReportsChartProps {
  data: ChartPoint[];
  color?: string;
}

export function fillLast14Days(
  data: { date: string; count: number }[],
  formatLabel: (date: string) => string
): ChartPoint[] {
  const map = new Map(data.map((d) => [d.date, d.count]));
  const points: ChartPoint[] = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    points.push({
      label: formatLabel(key),
      value: map.get(key) ?? 0,
    });
  }

  return points;
}

export default function ReportsChart({ data, color = "#7c3aed" }: ReportsChartProps) {
  const hasData = data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div
        className="flex items-center justify-center text-sm rounded-xl border border-dashed"
        style={{
          height: 220,
          color: "var(--app-text-muted)",
          borderColor: "var(--app-border)",
        }}
      >
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "var(--app-text-muted)" }}
          axisLine={{ stroke: "var(--app-border)" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "var(--app-text-muted)" }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          cursor={{ fill: "var(--app-primary-muted)" }}
          contentStyle={{
            background: "var(--app-card-bg)",
            border: "1px solid var(--app-border)",
            borderRadius: 8,
            color: "var(--app-text)",
            fontSize: 12,
          }}
          formatter={(value) => [value ?? 0, "Count"]}
        />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
