import { DateRangeTabs } from "@/components/admin/DateRangeTabs";
import { SignupCharts } from "@/components/admin/Charts";
import { StatsCards } from "@/components/admin/StatsCards";
import { requireAdmin } from "@/lib/auth";
import { getAnalytics, getDashboardStats } from "@/lib/admin-data";
import { DATE_RANGES, type DateRangeValue } from "@/lib/constants";

function parseRange(value: string | undefined): DateRangeValue {
  return DATE_RANGES.some((range) => range.value === value)
    ? (value as DateRangeValue)
    : "30";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const range = parseRange(params.range);
  const [stats, analytics] = await Promise.all([
    getDashboardStats(db),
    getAnalytics(db, range),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-subtle">
            FNJ Marketplace
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <DateRangeTabs value={range} />
      </div>
      <StatsCards stats={stats} />
      <SignupCharts series={analytics.series} breakdown={analytics.breakdown} />
    </div>
  );
}
