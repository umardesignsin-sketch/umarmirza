export const USER_TYPES = [
  "builder",
  "creator",
  "freelancer",
  "agency",
  "developer",
  "other",
] as const;

export type UserType = (typeof USER_TYPES)[number];

export const USER_TYPE_LABELS: Record<UserType, string> = {
  builder: "Website builder / buyer",
  creator: "Framer template creator",
  freelancer: "Freelancer",
  agency: "Agency",
  developer: "Developer",
  other: "Other",
};

export const WAITLIST_STATUSES = [
  "waitlisted",
  "invited",
  "converted",
  "rejected",
] as const;

export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

export const WAITLIST_STATUS_LABELS: Record<WaitlistStatus, string> = {
  waitlisted: "Waitlisted",
  invited: "Invited",
  converted: "Converted",
  rejected: "Rejected",
};

export const CREATOR_STATUSES = [
  "new",
  "reviewing",
  "approved",
  "rejected",
] as const;

export type CreatorStatus = (typeof CREATOR_STATUSES)[number];

export const CREATOR_STATUS_LABELS: Record<CreatorStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  approved: "Approved",
  rejected: "Rejected",
};

export const SOURCES = ["waitlist", "creator"] as const;
export type Source = (typeof SOURCES)[number];

export const PAGE_SIZE = 20;

export const DATE_RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
] as const;

export type DateRangeValue = (typeof DATE_RANGES)[number]["value"];
