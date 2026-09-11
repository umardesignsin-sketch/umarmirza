"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/creators", label: "Creators" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function logout() {
    setSigningOut(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo />
              <span className="hidden text-[13px] text-muted sm:inline">
                Marketplace
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-black/[0.04] text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[12px] text-muted sm:inline">{email}</span>
            <button
              type="button"
              onClick={logout}
              disabled={signingOut}
              className="text-[13px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {signingOut ? "…" : "Logout"}
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className="text-lg leading-none">☰</span>
            </button>
          </div>
        </div>
        {open ? (
          <nav className="border-t border-border px-4 py-3 md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2 text-sm text-foreground hover:bg-black/[0.03]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
