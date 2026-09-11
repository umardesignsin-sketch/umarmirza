import { ExportButtons } from "@/components/admin/ExportButtons";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminEmail,
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from "@/lib/env";

export default async function SettingsPage() {
  const { user } = await requireAdmin();

  const rows = [
    ["Signed in as", user.email ?? "—"],
    ["Admin email (env)", getAdminEmail() || "Not set"],
    [
      "Supabase URL / anon key",
      isSupabaseConfigured() ? "Configured" : "Missing",
    ],
    [
      "Service role key",
      isServiceRoleConfigured() ? "Configured" : "Missing",
    ],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Admin access is controlled by Supabase Auth. Credentials are never
          stored in the frontend.
        </p>
      </div>

      <section className="rounded-[12px] border border-border bg-surface">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 border-b border-border px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-muted">{label}</p>
            <p className="text-sm font-medium">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Exports</h2>
        <ExportButtons />
      </section>

      <section className="rounded-[12px] border border-border bg-surface p-5 text-sm leading-7 text-muted">
        <h2 className="mb-2 text-sm font-medium text-foreground">
          Add another admin
        </h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Create the user in Supabase → Authentication → Users.</li>
          <li>
            Set <code className="text-foreground">app_metadata.role</code> to{" "}
            <code className="text-foreground">admin</code> via the Auth Admin
            API, or run <code className="text-foreground">npm run seed:admin</code>{" "}
            with a different <code className="text-foreground">ADMIN_EMAIL</code>.
          </li>
          <li>
            Anyone whose email matches{" "}
            <code className="text-foreground">ADMIN_EMAIL</code> is promoted
            automatically on login.
          </li>
        </ol>
      </section>
    </div>
  );
}
