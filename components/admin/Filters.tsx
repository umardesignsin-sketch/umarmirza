"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input, Select } from "@/components/ui/Input";
import {
  CREATOR_STATUS_LABELS,
  CREATOR_STATUSES,
  USER_TYPE_LABELS,
  USER_TYPES,
  WAITLIST_STATUS_LABELS,
  WAITLIST_STATUSES,
} from "@/lib/constants";

export function WaitlistFilters({ mode }: { mode: "waitlist" | "creators" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(search);
      const current = params.get("q") ?? "";
      if (q === current) return;
      if (q) params.set("q", q);
      else params.delete("q");
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, 280);
    return () => clearTimeout(timer);
  }, [q, pathname, router, search]);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name or email"
      />
      {mode === "waitlist" ? (
        <Select
          value={searchParams.get("type") ?? "all"}
          onChange={(e) => update("type", e.target.value)}
        >
          <option value="all">All types</option>
          {USER_TYPES.map((type) => (
            <option key={type} value={type}>
              {USER_TYPE_LABELS[type]}
            </option>
          ))}
        </Select>
      ) : (
        <Select
          value={searchParams.get("creatorStatus") ?? "all"}
          onChange={(e) => update("creatorStatus", e.target.value)}
        >
          <option value="all">All creator statuses</option>
          {CREATOR_STATUSES.map((status) => (
            <option key={status} value={status}>
              {CREATOR_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      )}
      <Select
        value={searchParams.get("status") ?? "all"}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="all">All statuses</option>
        {WAITLIST_STATUSES.map((status) => (
          <option key={status} value={status}>
            {WAITLIST_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </Select>
    </div>
  );
}
