"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { USER_TYPE_LABELS } from "@/lib/constants";
import type { SignupPoint, UserTypeBreakdown } from "@/lib/types";
import { EmptyState } from "@/components/admin/EmptyState";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-[12px] shadow-sm">
      <p className="mb-1 text-muted">{label}</p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

export function SignupCharts({
  series,
  breakdown,
}: {
  series: SignupPoint[];
  breakdown: UserTypeBreakdown[];
}) {
  const hasData = series.some((point) => point.total > 0);
  const typeData = breakdown.map((item) => ({
    name: USER_TYPE_LABELS[item.type],
    count: item.count,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Signups over time" className="lg:col-span-2">
        {hasData ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="fnjFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0066FF" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#eee" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#8a8a8a" }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#8a8a8a" }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Signups"
                stroke="#0066FF"
                fill="url(#fnjFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No signups in this range" body="Try a wider date range." />
        )}
      </ChartCard>

      <ChartCard title="User type breakdown">
        {typeData.some((item) => item.count > 0) ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={typeData} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid stroke="#eee" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={118}
                tick={{ fontSize: 11, fill: "#5c5c5c" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Users" fill="#0066FF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No breakdown yet" body="User types will appear after the first signup." />
        )}
      </ChartCard>

      <ChartCard title="Creator signups over time" className="lg:col-span-3">
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={series}>
              <CartesianGrid stroke="#eee" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#8a8a8a" }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#8a8a8a" }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="creators"
                name="Creators"
                stroke="#0A0A0A"
                fill="#0A0A0A10"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No creator signups in this range" body="Creator submissions will plot here." />
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[12px] border border-border bg-surface p-5 ${className ?? ""}`}
    >
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}
