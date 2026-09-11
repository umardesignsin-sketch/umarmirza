"use client";

import { useState } from "react";
import { Hero } from "@/components/landing/Hero";
import { WaitlistModal } from "@/components/landing/WaitlistModal";

export function LandingPage({ referralCode }: { referralCode?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-svh bg-white">
      <Hero onWaitlist={() => setOpen(true)} />
      <WaitlistModal
        open={open}
        onClose={() => setOpen(false)}
        referralCode={referralCode}
      />
    </div>
  );
}
