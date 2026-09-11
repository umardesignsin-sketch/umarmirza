# FNJ Marketplace Waitlist

Production waitlist landing page and admin dashboard for FNJ Marketplace.

Users can join the waitlist or reserve creator access. Submissions persist in Supabase. The FNJ team manages them at `/admin`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Auth (admin only)
- Recharts

## 1. Install

```bash
cd fnj-marketplace
npm install
cp .env.example .env.local
```

## 2. Environment variables

Create a project at [supabase.com](https://supabase.com). Then in **Project Settings → API** copy the values into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FNJ_APP_URL=https://fnj.dev

ADMIN_EMAIL=you@fnj.dev
ADMIN_PASSWORD=change-me-to-a-strong-password
```

| Variable | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser auth + session refresh |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Waitlist writes, admin reads, CSV export, admin seeding. **Never expose this in the client.** |
| `NEXT_PUBLIC_SITE_URL` | SEO, Open Graph, share links |
| `NEXT_PUBLIC_FNJ_APP_URL` | Navbar “Go to FNJ” |
| `ADMIN_EMAIL` | First admin. Used by `npm run seed:admin` and auto-promoted on login. |
| `ADMIN_PASSWORD` | Seed script only. Not read by the Next.js app. |

## 3. Database schema

In Supabase: **SQL Editor → New query**. Paste and run the entire file:

[`supabase/schema.sql`](supabase/schema.sql)

That creates:

- `waitlist_users` with constraints, unique email (case-insensitive), unique referral codes
- `status`: `waitlisted` · `invited` · `converted` · `rejected`
- `creator_status`: `new` · `reviewing` · `approved` · `rejected` (required when `source = creator`)
- Row Level Security: anon cannot read or write. Authenticated admins (`app_metadata.role = admin`) can manage rows. Public inserts go through `/api/waitlist` using the service-role key after server-side validation.

## 4. Create the first admin

```bash
npm run seed:admin
```

This creates (or promotes) the user in Supabase Auth with `app_metadata.role = "admin"` using `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Manual alternative:

1. Supabase → Authentication → Users → Add user (`ADMIN_EMAIL`).
2. Log in at `/admin/login`. If the email matches `ADMIN_EMAIL`, the app promotes the account automatically (requires the service-role key).

Do not hardcode credentials in the frontend.

## 5. Run locally

```bash
npm run dev
```

- Landing page: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Unauthenticated visits to `/admin` redirect to `/admin/login`.

## 6. Deploy to Vercel

1. Push this repo and import it in Vercel.
2. Add the same environment variables (use your production `NEXT_PUBLIC_SITE_URL`).
3. Deploy.
4. Run `npm run seed:admin` locally against the production Supabase project, or create the admin user in the Supabase dashboard.

## Product routes

| Route | Purpose |
| --- | --- |
| `/` | Waitlist landing page |
| `/privacy` | Privacy copy |
| `/admin/login` | Admin login |
| `/admin` | Dashboard + charts |
| `/admin/waitlist` | Search, filter, status, delete, CSV |
| `/admin/creators` | Creator review (approve / reject) |
| `/admin/settings` | Admin account + exports |
| `POST /api/waitlist` | Public signup |
| `PATCH/DELETE /api/admin/waitlist/[id]` | Admin mutations |
| `GET /api/admin/export` | CSV (`source=all\|waitlist\|creator`) |

## Security model

- Service-role key is server-only.
- Public users can only submit the waitlist/creator form. Duplicate emails are rejected (`409`).
- Inputs are validated with Zod on the server. URLs must be `http`/`https`.
- Admin routes require a Supabase session **and** `app_metadata.role === "admin"`.
- Rate limiting (best-effort, per instance) on public signup.
- Honeypot field on both forms.

## Referral links

Each signup gets a `referral_code`. The success state share URL is `/?ref=CODE`. If a later visitor submits with that code, `referred_by` is stored. This is a lightweight referral tracker, not a full reward system.
