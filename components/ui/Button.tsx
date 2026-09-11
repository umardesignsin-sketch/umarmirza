import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-fnj text-white hover:bg-fnj-hover shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] hover:-translate-y-px",
  secondary:
    "bg-surface text-foreground border border-border-strong hover:bg-neutral-50 hover:border-neutral-300",
  dark: "bg-foreground text-white hover:bg-neutral-800 hover:-translate-y-px",
  ghost: "text-muted hover:text-foreground hover:bg-black/[0.03]",
  danger: "bg-danger text-white hover:bg-rose-700",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-[8px]",
  md: "h-10 px-4 text-sm rounded-[10px]",
  lg: "h-12 px-5 text-[15px] rounded-[12px]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
