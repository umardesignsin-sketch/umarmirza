export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function getWaitlistUrl(): string {
  return `${getSiteUrl()}/waitlist`;
}

export function getFnjAppUrl(): string {
  return (process.env.NEXT_PUBLIC_FNJ_APP_URL || "https://fnj.dev").replace(
    /\/$/,
    "",
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}
