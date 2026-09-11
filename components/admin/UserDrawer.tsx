"use client";

import {
  CREATOR_STATUS_LABELS,
  CREATOR_STATUSES,
  USER_TYPE_LABELS,
  WAITLIST_STATUS_LABELS,
  WAITLIST_STATUSES,
  type CreatorStatus,
  type WaitlistStatus,
} from "@/lib/constants";
import type { WaitlistUser } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import {
  CreatorStatusBadge,
  WaitlistStatusBadge,
} from "@/components/admin/StatusBadge";

export function UserDrawer({
  user,
  onClose,
  onStatus,
  onCreatorStatus,
  onDelete,
}: {
  user: WaitlistUser;
  onClose: () => void;
  onStatus: (status: WaitlistStatus) => void;
  onCreatorStatus?: (status: CreatorStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 animate-overlay-in"
        onClick={onClose}
        aria-label="Close details"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-[-12px_0_40px_rgba(0,0,0,0.08)] animate-drawer-in">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{user.full_name}</h2>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-subtle hover:bg-black/[0.04] hover:text-foreground"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-sm">
          <Row label="User type">{USER_TYPE_LABELS[user.user_type]}</Row>
          <Row label="Source" className="capitalize">
            {user.source}
          </Row>
          <Row label="Status">
            <WaitlistStatusBadge status={user.status} />
          </Row>
          {user.creator_status ? (
            <Row label="Creator status">
              <CreatorStatusBadge status={user.creator_status} />
            </Row>
          ) : null}
          <Row label="Portfolio">
            {user.portfolio_url ? (
              <a
                href={user.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-fnj hover:underline"
              >
                {user.portfolio_url}
              </a>
            ) : (
              "—"
            )}
          </Row>
          <Row label="Framer profile">
            {user.framer_profile_url ? (
              <a
                href={user.framer_profile_url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-fnj hover:underline"
              >
                {user.framer_profile_url}
              </a>
            ) : (
              "—"
            )}
          </Row>
          <Row label="Template count">{user.template_count ?? "—"}</Row>
          <Row label="Description">
            <span className="whitespace-pre-wrap text-foreground">
              {user.description || "—"}
            </span>
          </Row>
          <Row label="Marketing consent">
            {user.marketing_consent ? "Yes" : "No"}
          </Row>
          <Row label="Referral code">{user.referral_code}</Row>
          <Row label="Referred by">{user.referred_by || "—"}</Row>
          <Row label="Joined">{formatDateTime(user.created_at)}</Row>
        </div>

        <div className="space-y-3 border-t border-border px-6 py-5">
          <label className="block text-[12px] font-medium text-muted">
            Waitlist status
            <Select
              className="mt-1.5"
              value={user.status}
              onChange={(e) => onStatus(e.target.value as WaitlistStatus)}
            >
              {WAITLIST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {WAITLIST_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </label>
          {user.source === "creator" && onCreatorStatus ? (
            <label className="block text-[12px] font-medium text-muted">
              Creator status
              <Select
                className="mt-1.5"
                value={user.creator_status ?? "new"}
                onChange={(e) =>
                  onCreatorStatus(e.target.value as CreatorStatus)
                }
              >
                {CREATOR_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {CREATOR_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
            </label>
          ) : null}
          <Button variant="danger" className="w-full" onClick={onDelete}>
            Delete user
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-subtle">
        {label}
      </p>
      <div className={`mt-1 text-foreground ${className ?? ""}`}>{children}</div>
    </div>
  );
}
