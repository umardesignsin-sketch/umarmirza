"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { WaitlistUser } from "@/lib/types";
import type { CreatorStatus, WaitlistStatus } from "@/lib/constants";
import { USER_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  CreatorStatusBadge,
  WaitlistStatusBadge,
} from "@/components/admin/StatusBadge";
import { UserDrawer } from "@/components/admin/UserDrawer";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";

export function UsersTable({
  rows,
  mode,
}: {
  rows: WaitlistUser[];
  mode: "waitlist" | "creators";
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<WaitlistUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WaitlistUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function patch(id: string, body: Record<string, string>) {
    setError("");
    const response = await fetch(`/api/admin/waitlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Update failed.");
      return;
    }
    setSelected(payload.user);
    router.refresh();
  }

  async function remove() {
    if (!pendingDelete) return;
    setDeleting(true);
    const response = await fetch(`/api/admin/waitlist/${pendingDelete.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Delete failed.");
      return;
    }
    setPendingDelete(null);
    setSelected(null);
    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={mode === "creators" ? "No creators yet" : "No waitlist users yet"}
        body="New submissions will appear here as soon as someone joins."
      />
    );
  }

  return (
    <>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      <div className="overflow-x-auto rounded-[12px] border border-border bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-background text-[12px] font-medium text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              {mode === "waitlist" ? (
                <>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Portfolio</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 font-medium">Portfolio</th>
                  <th className="px-4 py-3 font-medium">Framer</th>
                  <th className="px-4 py-3 font-medium">Templates</th>
                </>
              )}
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-black/[0.015]"
              >
                <td className="px-4 py-3 font-medium">{row.full_name}</td>
                <td className="px-4 py-3 text-muted">{row.email}</td>
                {mode === "waitlist" ? (
                  <>
                    <td className="px-4 py-3 text-muted">
                      {USER_TYPE_LABELS[row.user_type]}
                    </td>
                    <td className="px-4 py-3">
                      {row.portfolio_url ? (
                        <a
                          href={row.portfolio_url}
                          className="text-fnj hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">{row.source}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      {row.portfolio_url ? (
                        <a
                          href={row.portfolio_url}
                          className="text-fnj hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.framer_profile_url ? (
                        <a
                          href={row.framer_profile_url}
                          className="text-fnj hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {row.template_count ?? "—"}
                    </td>
                  </>
                )}
                <td className="px-4 py-3">
                  {mode === "creators" && row.creator_status ? (
                    <CreatorStatusBadge status={row.creator_status} />
                  ) : (
                    <WaitlistStatusBadge status={row.status} />
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(row.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setSelected(row)}>
                      View
                    </Button>
                    {mode === "creators" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => patch(row.id, { creator_status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => patch(row.id, { creator_status: "rejected" })}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPendingDelete(row)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onStatus={(status: WaitlistStatus) => patch(selected.id, { status })}
          onCreatorStatus={(status: CreatorStatus) =>
            patch(selected.id, { creator_status: status })
          }
          onDelete={() => {
            setPendingDelete(selected);
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this user?"
        body={`This permanently removes ${pendingDelete?.full_name ?? "this user"} from the waitlist.`}
        pending={deleting}
        onClose={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </>
  );
}
