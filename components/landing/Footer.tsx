import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:px-8">
        <p>© {new Date().getFullYear()} FNJ. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <span className="text-subtle">Marketplace waitlist</span>
        </div>
      </div>
    </footer>
  );
}
