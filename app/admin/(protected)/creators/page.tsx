import { ExportButtons } from "@/components/admin/ExportButtons";
import { WaitlistFilters } from "@/components/admin/Filters";
import { Pagination } from "@/components/admin/Pagination";
import { UsersTable } from "@/components/admin/UsersTable";
import { listWaitlistUsers } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import {
  CREATOR_STATUSES,
  PAGE_SIZE,
  WAITLIST_STATUSES,
  type CreatorStatus,
  type WaitlistStatus,
} from "@/lib/constants";

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "all";
  const creatorStatus =
    typeof params.creatorStatus === "string" ? params.creatorStatus : "all";
  const sort = params.sort === "oldest" ? "oldest" : "newest";
  const page = Number(params.page || 1) || 1;

  const data = await listWaitlistUsers(db, {
    q,
    source: "creator",
    status: WAITLIST_STATUSES.includes(status as WaitlistStatus)
      ? (status as WaitlistStatus)
      : "all",
    creatorStatus: CREATOR_STATUSES.includes(creatorStatus as CreatorStatus)
      ? (creatorStatus as CreatorStatus)
      : "all",
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Creators</h1>
          <p className="mt-1 text-sm text-muted">
            Review Framer template creators who want to list at launch.
          </p>
        </div>
        <ExportButtons source="creator" />
      </div>
      <WaitlistFilters mode="creators" />
      <UsersTable rows={data.rows} mode="creators" />
      <Pagination page={data.page} pageSize={data.pageSize} total={data.total} />
    </div>
  );
}
