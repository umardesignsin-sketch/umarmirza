"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatWaitlistPosition } from "@/lib/utils";

export function SuccessState({
  title,
  body,
  position,
  shareUrl,
  creator,
}: {
  title: string;
  body: string;
  position?: number | null;
  shareUrl: string;
  creator?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const tweet = creator
    ? `I just reserved creator access on FNJ Marketplace. List Framer templates for free at launch.`
    : `I just joined the FNJ Marketplace waitlist. Get early access and free conversion credits.`;

  return (
    <div className="px-6 pb-7 pt-10 sm:px-8">
      <div className="animate-check-pop mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-fnj">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            className="animate-draw-check"
            d="M5.5 11.5 9 15l7.5-8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="text-center text-[22px] font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm leading-6 text-muted">{body}</p>

      {position ? (
        <p className="mt-5 text-center text-sm text-foreground">
          You&apos;re{" "}
          <span className="font-semibold text-fnj">
            {formatWaitlistPosition(position)}
          </span>{" "}
          on the list.
        </p>
      ) : null}

      <div className="mt-6 rounded-[12px] border border-border bg-background px-4 py-4">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-subtle">
          Your early-access benefits
        </p>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-center gap-2">
            <Check /> Free conversion credits
          </li>
          <li className="flex items-center gap-2">
            <Check /> Early marketplace access
          </li>
          <li className="flex items-center gap-2">
            <Check /> Free template listing for creators
          </li>
        </ul>
      </div>

      <p className="mt-6 text-center text-[13px] text-muted">
        Share FNJ with your friends to get early access.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-[10px] border border-border-strong bg-surface text-sm font-medium transition-colors hover:bg-neutral-50"
        >
          Share on X
        </a>
        <Button variant="secondary" onClick={copy}>
          {copied ? "Copied" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.2 6.4 11l6.1-7"
        stroke="#0066FF"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
