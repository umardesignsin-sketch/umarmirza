"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Checkbox, Field } from "@/components/ui/Field";
import { SuccessState } from "@/components/landing/SuccessState";
import { USER_TYPE_LABELS, USER_TYPES } from "@/lib/constants";

type FormState = {
  full_name: string;
  email: string;
  user_type: string;
  marketing_consent: boolean;
  honeypot: string;
};

const empty: FormState = {
  full_name: "",
  email: "",
  user_type: "",
  marketing_consent: true,
  honeypot: "",
};

export function WaitlistModal({
  open,
  onClose,
  referralCode,
}: {
  open: boolean;
  onClose: () => void;
  referralCode?: string;
}) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    position?: number | null;
    shareUrl: string;
  } | null>(null);

  function close() {
    onClose();
    setTimeout(() => {
      setForm(empty);
      setErrors({});
      setSubmitting(false);
      setResult(null);
    }, 180);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "waitlist",
          referral_code: referralCode || undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrors(payload.fieldErrors ?? { form: payload.error });
        return;
      }
      setResult({ position: payload.position, shareUrl: payload.shareUrl });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={close} title="Join the waitlist">
      {result ? (
        <SuccessState
          title="You're on the list."
          body="You're officially on the FNJ Marketplace waitlist. We'll email you when we're ready."
          position={result.position}
          shareUrl={result.shareUrl}
        />
      ) : (
        <form onSubmit={onSubmit} className="px-6 pb-7 pt-8 sm:px-8">
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-subtle">
            Waitlist
          </p>
          <h2 className="mt-2 text-[22px] font-semibold tracking-tight">
            Reserve your spot
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Early access, free conversion credits, and a seat at launch.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Full name" htmlFor="waitlist-name" error={errors.full_name}>
              <Input
                id="waitlist-name"
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Ada Lovelace"
              />
            </Field>
            <Field label="Email" htmlFor="waitlist-email" error={errors.email}>
              <Input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ada@studio.com"
              />
            </Field>
            <Field label="I am a:" htmlFor="waitlist-type" error={errors.user_type}>
              <Select
                id="waitlist-type"
                value={form.user_type}
                onChange={(e) => setForm({ ...form, user_type: e.target.value })}
              >
                <option value="">Select one</option>
                {USER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {USER_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
            </Field>
            <input
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
              aria-hidden="true"
            />
            <Checkbox
              label="Send me updates about FNJ Marketplace."
              checked={form.marketing_consent}
              onChange={(e) =>
                setForm({ ...form, marketing_consent: e.target.checked })
              }
            />
          </div>

          {errors.form ? (
            <p className="mt-4 text-sm text-danger">{errors.form}</p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting ? "Reserving…" : "Reserve My Spot"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
