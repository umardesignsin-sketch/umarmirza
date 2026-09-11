import { NextResponse } from "next/server";
import { creatorSchema, waitlistSchema } from "@/lib/validations";
import { generateReferralCode, getClientIp } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import {
  getWaitlistUrl,
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from "@/lib/env";
import { isEmailConfigured, sendSignupEmail } from "@/lib/email";
import type { WaitlistInsert } from "@/lib/types";

export async function POST(request: Request) {
  const canSave = isSupabaseConfigured() && isServiceRoleConfigured();
  const canEmail = isEmailConfigured();

  if (!canSave && !canEmail) {
    return NextResponse.json(
      { error: "Waitlist is not configured yet." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request.headers);
  const limited = rateLimit(`waitlist:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const payload = (body ?? {}) as { source?: string; honeypot?: string };
  if (payload.honeypot) {
    return NextResponse.json({
      ok: true,
      position: 1,
      referralCode: "ok",
      shareUrl: getWaitlistUrl(),
    });
  }

  const parsed =
    payload.source === "creator"
      ? creatorSchema.safeParse(body)
      : waitlistSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Please check the form.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const userType = data.source === "creator" ? "creator" : data.user_type;
  const referralCode = generateReferralCode();
  let position: number | null = null;

  if (canSave) {
    const db = createServiceRoleClient();

    let referredBy: string | null = null;
    const incomingRef = data.referral_code?.trim();
    if (incomingRef) {
      const { data: referrer } = await db
        .from("waitlist_users")
        .select("referral_code")
        .eq("referral_code", incomingRef)
        .maybeSingle();
      if (referrer?.referral_code) referredBy = referrer.referral_code;
    }

    const insert: WaitlistInsert = {
      full_name: data.full_name,
      email: data.email,
      user_type: userType,
      marketing_consent: data.marketing_consent,
      source: data.source,
      referral_code: referralCode,
      referred_by: referredBy,
      status: "waitlisted",
      creator_status: data.source === "creator" ? "new" : null,
    };

    if (data.source === "creator") {
      insert.portfolio_url = data.portfolio_url;
      insert.framer_profile_url = data.framer_profile_url;
      insert.template_count = data.template_count;
      insert.description = data.description;
    }

    async function insertRow(row: WaitlistInsert) {
      return db
        .from("waitlist_users")
        .insert(row)
        .select("id, referral_code, created_at")
        .single();
    }

    let { data: created, error } = await insertRow(insert);

    if (
      error?.code === "23505" &&
      /referral/i.test(`${error.message} ${error.details}`)
    ) {
      insert.referral_code = generateReferralCode();
      ({ data: created, error } = await insertRow(insert));
    }

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "This email is already on the waitlist.",
            code: "duplicate",
          },
          { status: 409 },
        );
      }
      console.error("waitlist insert failed", error);
      if (/does not exist|schema cache/i.test(error.message)) {
        return NextResponse.json(
          {
            error:
              "Database is not set up yet. Run supabase/schema.sql in the Supabase SQL editor.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Could not save your spot. Please try again." },
        { status: 500 },
      );
    }

    if (created) {
      const { count } = await db
        .from("waitlist_users")
        .select("id", { count: "exact", head: true })
        .lte("created_at", created.created_at);
      position = count ?? 1;
    }
  }

  if (canEmail) {
    try {
      await sendSignupEmail({
        full_name: data.full_name,
        email: data.email,
        user_type: userType,
        marketing_consent: data.marketing_consent,
        source: data.source,
        portfolio_url: data.source === "creator" ? data.portfolio_url : null,
        framer_profile_url:
          data.source === "creator" ? data.framer_profile_url : null,
        template_count:
          data.source === "creator" ? data.template_count : null,
        description: data.source === "creator" ? data.description : null,
      });
    } catch (error) {
      console.error("waitlist email failed", error);
      if (!canSave) {
        return NextResponse.json(
          { error: "Could not send your signup. Please try again." },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({
    ok: true,
    position,
    referralCode,
    shareUrl: `${getWaitlistUrl()}?ref=${referralCode}`,
  });
}
