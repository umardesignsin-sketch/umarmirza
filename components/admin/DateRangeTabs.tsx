"use client";

import Link from "next/link";
import { DATE_RANGES, type DateRangeValue } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function DateRangeTabs({ value }: { value: DateRangeValue }) {
  return (
    <div className="inline-flex rounded-[10px] border border-border bg-surface p-1">
      {DATE_RANGES.map((range) => (
        <Link
          key={range.value}
          href={`/admin?range=${range.value}`}
          className={cn(
            "rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors",
            value === range.value
              ? "bg-foreground text-white"
              : "text-muted hover:text-foreground",
          )}
        >
          {range.label}
        </Link>
      ))}
    </div>
  );
}
