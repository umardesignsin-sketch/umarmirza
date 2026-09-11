import { cn } from "@/lib/cn";

export function Logo({
  className,
  wordmark = true,
}: {
  className?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="7" fill="#0A0A0A" />
        <path d="M9 8h10v2.4H11.6v2.7H18v2.35H11.6V20H9V8Z" fill="white" />
        <rect x="18.2" y="18.2" width="4.4" height="4.4" rx="1" fill="#0066FF" />
      </svg>
      {wordmark ? (
        <span className="text-[15px] font-semibold tracking-[-0.03em] text-foreground">
          FNJ
        </span>
      ) : null}
    </span>
  );
}
