"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    searchParams.get("error") === "forbidden"
      ? "This account does not have admin access."
      : "",
  );
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      const next = searchParams.get("next") || "/admin";
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Check your environment variables.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-5 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-[16px] border border-border bg-surface p-8 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
      >
        <Logo />
        <h1 className="mt-6 text-[22px] font-semibold tracking-tight">
          Admin login
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Sign in to the FNJ Marketplace dashboard.
        </p>
        <div className="mt-6 space-y-4">
          <Field label="Email" htmlFor="admin-email">
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Password" htmlFor="admin-password">
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
