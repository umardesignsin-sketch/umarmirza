import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PAGE_SIZE,
  type CreatorStatus,
  type DateRangeValue,
  type Source,
  type UserType,
  type WaitlistStatus,
} from "@/lib/constants";
import type {
  DashboardStats,
  PaginatedWaitlist,
  SignupPoint,
  UserTypeBreakdown,
  WaitlistUser,
} from "@/lib/types";
import { daysAgoUtc, sanitizeSearch, startOfUtcDay } from "@/lib/utils";

export function rangeStart(range: DateRangeValue): string | null {
  if (range === "all") return null;
  const days = Number(range);
  return daysAgoUtc(days).toISOString();
}

export async function getDashboardStats(
  db: SupabaseClient,
): Promise<DashboardStats> {
  const today = startOfUtcDay().toISOString();
  const week = daysAgoUtc(7).toISOString();

  const [totalRes, creatorsRes, todayRes, weekRes, convertedRes] =
    await Promise.all([
      db.from("waitlist_users").select("id", { count: "exact", head: true }),
      db
        .from("waitlist_users")
        .select("id", { count: "exact", head: true })
        .eq("source", "creator"),
      db
        .from("waitlist_users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today),
      db
        .from("waitlist_users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", week),
      db
        .from("waitlist_users")
        .select("id", { count: "exact", head: true })
        .eq("status", "converted"),
    ]);

  const total = totalRes.count ?? 0;
  const converted = convertedRes.count ?? 0;

  return {
    total,
    creators: creatorsRes.count ?? 0,
    today: todayRes.count ?? 0,
    week: weekRes.count ?? 0,
    converted,
    conversionRate: total === 0 ? 0 : (converted / total) * 100,
  };
}

export async function getAnalytics(
  db: SupabaseClient,
  range: DateRangeValue,
): Promise<{ series: SignupPoint[]; breakdown: UserTypeBreakdown[] }> {
  const from = rangeStart(range);

  let query = db
    .from("waitlist_users")
    .select("created_at, user_type, source")
    .order("created_at", { ascending: true });

  if (from) query = query.gte("created_at", from);

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const byDay = new Map<string, { total: number; creators: number }>();
  const byType = new Map<UserType, number>();

  for (const row of rows) {
    const day = row.created_at.slice(0, 10);
    const current = byDay.get(day) ?? { total: 0, creators: 0 };
    current.total += 1;
    if (row.source === "creator") current.creators += 1;
    byDay.set(day, current);

    const type = row.user_type as UserType;
    byType.set(type, (byType.get(type) ?? 0) + 1);
  }

  const series: SignupPoint[] = [];
  const start = from ? new Date(from) : firstDay(byDay);
  const end = startOfUtcDay();

  if (start) {
    for (
      let cursor = new Date(start);
      cursor.getTime() <= end.getTime();
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      const key = cursor.toISOString().slice(0, 10);
      const point = byDay.get(key) ?? { total: 0, creators: 0 };
      series.push({ day: key, ...point });
    }
  }

  const types: UserType[] = [
    "builder",
    "creator",
    "freelancer",
    "agency",
    "developer",
    "other",
  ];
  const breakdown: UserTypeBreakdown[] = types.map((type) => ({
    type,
    count: byType.get(type) ?? 0,
  }));

  return { series, breakdown };
}

function firstDay(map: Map<string, unknown>): Date | null {
  const keys = [...map.keys()].sort();
  if (keys.length === 0) return null;
  return new Date(`${keys[0]}T00:00:00.000Z`);
}

export type WaitlistQuery = {
  q?: string;
  userType?: UserType | "all";
  status?: WaitlistStatus | "all";
  creatorStatus?: CreatorStatus | "all";
  source?: Source | "all";
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
};

export async function listWaitlistUsers(
  db: SupabaseClient,
  options: WaitlistQuery,
): Promise<PaginatedWaitlist> {
  const pageSize = options.pageSize ?? PAGE_SIZE;
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = db
    .from("waitlist_users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: options.sort === "oldest" })
    .range(from, to);

  const q = options.q ? sanitizeSearch(options.q) : "";
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  }
  if (options.userType && options.userType !== "all") {
    query = query.eq("user_type", options.userType);
  }
  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }
  if (options.creatorStatus && options.creatorStatus !== "all") {
    query = query.eq("creator_status", options.creatorStatus);
  }
  if (options.source && options.source !== "all") {
    query = query.eq("source", options.source);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    rows: (data ?? []) as WaitlistUser[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function exportWaitlistUsers(
  db: SupabaseClient,
  source: "all" | "creator" | "waitlist" = "all",
): Promise<WaitlistUser[]> {
  const pageSize = 1000;
  const rows: WaitlistUser[] = [];
  let from = 0;

  while (true) {
    let query = db
      .from("waitlist_users")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (source !== "all") query = query.eq("source", source);

    const { data, error } = await query;
    if (error) throw error;
    const batch = (data ?? []) as WaitlistUser[];
    rows.push(...batch);
    if (batch.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}
