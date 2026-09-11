import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "FNJ Marketplace — Coming Soon",
  description:
    "FNJ Marketplace is launching soon. Join the waitlist to claim free conversion credits and list your Framer templates for free.",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const referralCode = params.ref?.trim().slice(0, 32) || undefined;
  return <LandingPage referralCode={referralCode} />;
}
