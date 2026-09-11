import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await connection();
  if (isSupabaseConfigured()) {
    let alreadyAdmin = false;
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      alreadyAdmin = user?.app_metadata?.role === "admin";
    } catch {
      alreadyAdmin = false;
    }
    if (alreadyAdmin) redirect("/admin");
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
