import type { WaitlistUser } from "@/lib/types";
import { csvEscape } from "@/lib/utils";

const HEADERS = [
  "id",
  "full_name",
  "email",
  "user_type",
  "portfolio_url",
  "framer_profile_url",
  "template_count",
  "description",
  "marketing_consent",
  "source",
  "status",
  "creator_status",
  "referral_code",
  "referred_by",
  "created_at",
  "updated_at",
] as const;

export function waitlistToCsv(rows: WaitlistUser[]): string {
  const lines = [
    HEADERS.join(","),
    ...rows.map((row) =>
      HEADERS.map((key) => csvEscape(row[key])).join(","),
    ),
  ];
  return `\uFEFF${lines.join("\n")}`;
}
