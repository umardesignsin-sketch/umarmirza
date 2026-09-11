export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-md bg-black/[0.04]" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-[12px] border border-border bg-surface"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-[12px] border border-border bg-surface" />
    </div>
  );
}
