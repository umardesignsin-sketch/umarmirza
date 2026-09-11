import { cn } from "@/lib/cn";

const className =
  "inline-flex h-8 items-center rounded-[8px] border border-border-strong bg-surface px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-neutral-50";

export function ExportButtons({
  source,
}: {
  source?: "waitlist" | "creator" | "all";
}) {
  if (source === "creator") {
    return (
      <a href="/api/admin/export?source=creator" className={className}>
        Export CSV
      </a>
    );
  }
  if (source === "waitlist" || source === "all") {
    return (
      <a
        href={`/api/admin/export?source=${source === "all" ? "all" : "waitlist"}`}
        className={className}
      >
        Export CSV
      </a>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <a href="/api/admin/export?source=all" className={className}>
        Export all waitlist
      </a>
      <a href="/api/admin/export?source=creator" className={cn(className)}>
        Export creators
      </a>
    </div>
  );
}
