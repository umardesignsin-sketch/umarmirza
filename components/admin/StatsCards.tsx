import { formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "waitlist users",
      value: formatNumber(stats.total),
    },
    {
      label: "creators",
      value: formatNumber(stats.creators),
    },
    {
      label: "this week",
      value: `+${formatNumber(stats.week)}`,
    },
    {
      label: "today",
      value: formatNumber(stats.today),
    },
    {
      label: "conversion rate",
      value:
        stats.total === 0 ? "—" : `${stats.conversionRate.toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[12px] border border-border bg-surface p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-transform duration-150 hover:-translate-y-0.5"
        >
          <p className="text-[32px] font-semibold tracking-tight">{card.value}</p>
          <p className="mt-1 text-[13px] text-muted">{card.label}</p>
        </article>
      ))}
    </div>
  );
}
