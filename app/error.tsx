"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium text-fnj">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        We couldn&apos;t load this page.
      </h1>
      <button
        type="button"
        onClick={reset}
        className="mt-6 h-10 rounded-[10px] bg-foreground px-4 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
