import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[10px] border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition-shadow placeholder:text-subtle",
        "focus:border-fnj focus:ring-4 focus:ring-fnj/10",
        "disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[104px] w-full resize-y rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-subtle",
        "focus:border-fnj focus:ring-4 focus:ring-fnj/10",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-[10px] border border-border bg-surface bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3.5 pr-10 text-sm text-foreground outline-none transition-shadow",
        "bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 viewBox=%220 0 24 24%22%3E%3Cpath stroke=%22%235c5c5c%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.75%22 d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')]",
        "focus:border-fnj focus:ring-4 focus:ring-fnj/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
