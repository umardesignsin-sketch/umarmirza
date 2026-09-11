import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How waitlist information is collected and used.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-white">
      <main className="mx-auto max-w-[560px] px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-4 text-muted">Last updated {new Date().getFullYear()}</p>
        <div className="mt-10 space-y-6 text-[15px] leading-7 text-muted">
          <p>
            FNJ collects the information you submit on the Marketplace waitlist
            and creator forms — typically your name, email, role, optional
            portfolio links, and a short description of your templates.
          </p>
          <p>
            We use this information to notify you about launch, early access,
            conversion credits, and creator listing. If you opt in, we may send
            product updates about FNJ Marketplace.
          </p>
          <p>
            We do not sell your data. Access to waitlist records is limited to
            authenticated FNJ admins. You can request deletion of your waitlist
            entry by emailing the address you used to sign up, via the FNJ team.
          </p>
        </div>
        <Link href="/" className="mt-12 inline-block text-sm text-[#111] hover:underline">
          ← Back
        </Link>
      </main>
    </div>
  );
}
