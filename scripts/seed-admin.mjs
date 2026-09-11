import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: created, error: createError } =
  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });

if (!createError && created.user) {
  console.log(`Admin created: ${email}`);
  console.log("Sign in at /admin/login");
  process.exit(0);
}

if (createError && !/already|registered|exists/i.test(createError.message)) {
  console.error("Could not create admin:", createError.message);
  process.exit(1);
}

const { data: list, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (listError) {
  console.error("Could not list users:", listError.message);
  process.exit(1);
}

const existing = list.users.find((user) => user.email?.toLowerCase() === email);

if (!existing) {
  console.error(
    "User already exists but could not be found to promote. Create it in the Supabase dashboard, then re-run this script.",
  );
  process.exit(1);
}

const { error: updateError } = await admin.auth.admin.updateUserById(
  existing.id,
  {
    password,
    email_confirm: true,
    app_metadata: { ...existing.app_metadata, role: "admin" },
  },
);

if (updateError) {
  console.error("Could not promote admin:", updateError.message);
  process.exit(1);
}

console.log(`Admin promoted: ${email}`);
console.log("Sign in at /admin/login");
