import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/env";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

function isAdminUser(user: User): boolean {
  return user.app_metadata?.role === "admin";
}

async function promoteIfSeedAdmin(user: User): Promise<User> {
  if (isAdminUser(user)) return user;

  const seedEmail = getAdminEmail();
  if (!seedEmail || user.email?.toLowerCase() !== seedEmail) {
    return user;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return user;
  }

  const admin = createServiceRoleClient();
  const { data, error } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: "admin" },
  });

  if (error || !data.user) return user;

  const supabase = await createServerSupabaseClient();
  await supabase.auth.refreshSession();
  return data.user;
}

export async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/admin/login");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const promoted = await promoteIfSeedAdmin(user);

  if (!isAdminUser(promoted)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  return { user: promoted, db: createServiceRoleClient() };
}

export async function requireAdminApi() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const promoted = await promoteIfSeedAdmin(user);
    if (!isAdminUser(promoted)) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return { user: promoted, db: createServiceRoleClient() };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Server is not configured." },
        { status: 503 },
      ),
    };
  }
}
