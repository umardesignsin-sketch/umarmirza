import { connection } from "next/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const { user } = await requireAdmin();
  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
