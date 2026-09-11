import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const appUrl = process.env.NEXT_PUBLIC_FNJ_APP_URL || "https://fnj.dev";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="hidden text-[13px] text-muted sm:block">
            Already building with FNJ?
          </p>
          <a
            href={appUrl}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-fnj"
          >
            Go to FNJ
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
