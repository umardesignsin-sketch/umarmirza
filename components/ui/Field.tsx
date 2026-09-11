import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[12px] text-danger">{error}</span>
      ) : null}
    </label>
  );
}

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-5 text-muted">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-[4px] border border-border-strong bg-surface",
          "checked:border-fnj checked:bg-fnj",
          "checked:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22M3.5 8.5 6.5 11.5 12.5 4.5%22 stroke=%22white%22 stroke-width=%221.75%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fnj/15",
          className,
        )}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
