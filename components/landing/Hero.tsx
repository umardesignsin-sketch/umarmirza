"use client";

import { Button } from "@/components/ui/Button";

const benefits = [
  "Free conversion credits",
  "Early marketplace access",
  "Free template listing",
];

export function Hero({ onWaitlist }: { onWaitlist: () => void }) {
  return (
    <section className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="w-full max-w-[640px] text-center">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#9a9a9a]">
          Coming soon
        </p>

        <h1 className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#111] sm:text-[52px]">
          FNJ&apos;s Marketplace is launching soon.
        </h1>

        <p className="mx-auto mt-5 max-w-[34rem] text-[16px] leading-7 text-[#444] sm:text-[17px]">
          Get early access, claim free conversion credits, and list your
          Framer templates for{" "}
          <span className="relative whitespace-nowrap font-medium text-fnj">
            absolutely free
            <span className="absolute inset-x-0 -bottom-0.5 h-px bg-fnj/35" />
          </span>
          .
        </p>

        <div className="mt-9 flex justify-center">
          <Button
            size="lg"
            onClick={onWaitlist}
            className="w-full max-w-[260px] sm:w-auto sm:min-w-[200px]"
          >
            Join the Waitlist
          </Button>
        </div>

        <ul className="mx-auto mt-12 flex max-w-lg flex-col items-center gap-2.5 text-[13px] text-[#666] sm:flex-row sm:justify-center sm:gap-6">
          {benefits.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-fnj" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
