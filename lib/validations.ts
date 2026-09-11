import { z } from "zod";
import { USER_TYPES } from "@/lib/constants";
import { normalizeUrl } from "@/lib/utils";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .max(120, "Name is too long.");

const emailSchema = z
  .email("Please enter a valid email address.")
  .max(254)
  .transform((value) => value.trim().toLowerCase());

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value, ctx) => {
    if (!value) return null;
    const url = normalizeUrl(value);
    if (!url) {
      ctx.addIssue({ code: "custom", message: "Enter a valid http(s) URL." });
      return z.NEVER;
    }
    return url;
  });

const requiredUrl = z
  .string()
  .trim()
  .min(4, "Please add a portfolio URL.")
  .max(500)
  .transform((value, ctx) => {
    const url = normalizeUrl(value);
    if (!url) {
      ctx.addIssue({ code: "custom", message: "Enter a valid http(s) URL." });
      return z.NEVER;
    }
    return url;
  });

export const waitlistSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  user_type: z.enum(USER_TYPES, {
    error: "Please select who you are.",
  }),
  marketing_consent: z.boolean(),
  referral_code: z.string().trim().max(32).optional().nullable(),
  honeypot: z.string().optional(),
  source: z.literal("waitlist").default("waitlist"),
});

export const creatorSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  portfolio_url: requiredUrl,
  framer_profile_url: optionalUrl,
  template_count: z
    .union([z.number(), z.string()])
    .transform((value, ctx) => {
      if (value === "" || value === null || value === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "How many templates do you currently have?",
        });
        return z.NEVER;
      }
      const parsed = typeof value === "number" ? value : Number(value);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 10000) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a whole number between 0 and 10,000.",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  description: z
    .string()
    .trim()
    .min(8, "Tell us a little more about your templates.")
    .max(800, "Keep it under 800 characters."),
  marketing_consent: z.boolean(),
  referral_code: z.string().trim().max(32).optional().nullable(),
  honeypot: z.string().optional(),
  source: z.literal("creator").default("creator"),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type CreatorInput = z.infer<typeof creatorSchema>;

export const waitlistPatchSchema = z
  .object({
    status: z
      .enum(["waitlisted", "invited", "converted", "rejected"])
      .optional(),
    creator_status: z
      .enum(["new", "reviewing", "approved", "rejected"])
      .optional()
      .nullable(),
  })
  .refine(
    (value) => value.status !== undefined || value.creator_status !== undefined,
    { message: "Nothing to update." },
  );
