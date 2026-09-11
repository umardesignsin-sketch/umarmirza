import { ExportButtons } from "@/components/admin/ExportButtons";
import { WaitlistFilters } from "@/components/admin/Filters";
import { Pagination } from "@/components/admin/Pagination";
import { UsersTable } from "@/components/admin/UsersTable";
import { listWaitlistUsers } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import {
  PAGE_SIZE,
  USER_TYPES,
  WAITLIST_STATUSES,
  type UserType,
  type WaitlistStatus,
} from "@/lib/constants";

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const type = typeof params.type === "string" ? params.type : "all";
  const status = typeof params.status === "string" ? params.status : "all";
  const sort = params.sort === "oldest" ? "oldest" : "newest";
  const page = Number(params.page || 1) || 1;

  const data = await listWaitlistUsers(db, {
    q,
    userType: USER_TYPES.includes(type as UserType)
      ? (type as UserType)
      : "all",
    status: WAITLIST_STATUSES.includes(status as WaitlistStatus)
      ? (status as WaitlistStatus)
      : "all",
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Waitlist</h1>
          <p className="mt-1 text-sm text-muted">
            Search, filter, and manage everyone who reserved a spot.
          </p>
        </div>
        <ExportButtons source="all" />
      </div>
      <WaitlistFilters mode="waitlist" />
      <UsersTable rows={data.rows} mode="waitlist" />
      <Pagination page={data.page} pageSize={data.pageSize} total={data.total} />
    </div>
  );
}
