"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-border bg-surface p-8">
      <h1 className="text-lg font-semibold tracking-tight">
        Couldn&apos;t load this view
      </h1>
      <p className="mt-2 text-sm text-muted">
        {error.message || "Check your Supabase schema and environment variables."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 h-9 rounded-[8px] bg-foreground px-3 text-sm font-medium text-white"
      >
        Retry
      </button>
    </div>
  );
}
