import { Resend } from "resend";
import { USER_TYPE_LABELS, type UserType } from "@/lib/constants";

const NOTIFY_EMAIL = "umardesignsin@gmail.com";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getNotifyEmail(): string {
  return (process.env.WAITLIST_NOTIFY_EMAIL || NOTIFY_EMAIL).trim();
}

type SignupEmail = {
  full_name: string;
  email: string;
  user_type: string;
  marketing_consent: boolean;
  source: string;
  portfolio_url?: string | null;
  framer_profile_url?: string | null;
  template_count?: number | null;
  description?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendSignupEmail(signup: SignupEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const typeLabel =
    USER_TYPE_LABELS[signup.user_type as UserType] ?? signup.user_type;
  const from =
    process.env.WAITLIST_FROM_EMAIL ||
    "FNJ Marketplace <beth.t@example.com>";

  const rows = [
    ["Name", signup.full_name],
    ["Email", signup.email],
    ["Type", typeLabel],
    ["Source", signup.source],
    ["Updates", signup.marketing_consent ? "Yes" : "No"],
  ];

  if (signup.portfolio_url) rows.push(["Portfolio", signup.portfolio_url]);
  if (signup.framer_profile_url) {
    rows.push(["Framer profile", signup.framer_profile_url]);
  }
  if (signup.template_count != null) {
    rows.push(["Templates", String(signup.template_count)]);
  }
  if (signup.description) rows.push(["Description", signup.description]);

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `
    <div style="font-family:Geist,Inter,sans-serif;color:#111;line-height:1.5">
      <h2 style="margin:0 0 16px;font-size:18px">New waitlist signup</h2>
      <table style="border-collapse:collapse;width:100%;max-width:520px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:#888;width:140px;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:8px 0">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: getNotifyEmail(),
    replyTo: signup.email,
    subject: `New waitlist signup: ${signup.full_name}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
