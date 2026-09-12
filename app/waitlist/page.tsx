import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Umar Mirza",
  description:
    "Umar Mirza is a builder, designer, and creator. Web design, development, and growth for businesses and individuals.",
  alternates: {
    canonical: "/waitlist",
  },
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
