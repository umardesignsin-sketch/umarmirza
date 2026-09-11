import { cn } from "@/lib/cn";
import {
  CREATOR_STATUS_LABELS,
  WAITLIST_STATUS_LABELS,
  type CreatorStatus,
  type WaitlistStatus,
} from "@/lib/constants";

const waitlistStyles: Record<WaitlistStatus, string> = {
  waitlisted: "bg-neutral-100 text-neutral-700",
  invited: "bg-fnj-soft text-fnj",
  converted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

const creatorStyles: Record<CreatorStatus, string> = {
  new: "bg-neutral-100 text-neutral-700",
  reviewing: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

export function WaitlistStatusBadge({ status }: { status: WaitlistStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        waitlistStyles[status],
      )}
    >
      {WAITLIST_STATUS_LABELS[status]}
    </span>
  );
}

export function CreatorStatusBadge({ status }: { status: CreatorStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
        creatorStyles[status],
      )}
    >
      {CREATOR_STATUS_LABELS[status]}
    </span>
  );
}
