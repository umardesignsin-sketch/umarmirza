"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Checkbox, Field } from "@/components/ui/Field";
import { SuccessState } from "@/components/landing/SuccessState";

type FormState = {
  full_name: string;
  email: string;
  portfolio_url: string;
  framer_profile_url: string;
  template_count: string;
  description: string;
  marketing_consent: boolean;
  honeypot: string;
};

const empty: FormState = {
  full_name: "",
  email: "",
  portfolio_url: "",
  framer_profile_url: "",
  template_count: "",
  description: "",
  marketing_consent: true,
  honeypot: "",
};

export function CreatorModal({
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
    position: number;
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
          source: "creator",
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
    <Modal open={open} onClose={close} title="List your template" className="sm:max-w-[480px]">
      {result ? (
        <SuccessState
          title="You're on the creator list."
          body="Marketplace creators will be able to list their templates for free at launch."
          position={result.position}
          shareUrl={result.shareUrl}
          creator
        />
      ) : (
        <form onSubmit={onSubmit} className="px-6 pb-7 pt-8 sm:px-8">
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-subtle">
            Creators
          </p>
          <h2 className="mt-2 text-[22px] font-semibold tracking-tight">
            Reserve creator access
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            List your Framer templates on FNJ Marketplace for free at launch.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Full name" htmlFor="creator-name" error={errors.full_name}>
              <Input
                id="creator-name"
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Jordan Lee"
              />
            </Field>
            <Field label="Email" htmlFor="creator-email" error={errors.email}>
              <Input
                id="creator-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jordan@studio.com"
              />
            </Field>
            <Field
              label="Portfolio URL"
              htmlFor="creator-portfolio"
              error={errors.portfolio_url}
            >
              <Input
                id="creator-portfolio"
                value={form.portfolio_url}
                onChange={(e) =>
                  setForm({ ...form, portfolio_url: e.target.value })
                }
                placeholder="https://your.site"
              />
            </Field>
            <Field
              label="Framer profile URL"
              htmlFor="creator-framer"
              error={errors.framer_profile_url}
            >
              <Input
                id="creator-framer"
                value={form.framer_profile_url}
                onChange={(e) =>
                  setForm({ ...form, framer_profile_url: e.target.value })
                }
                placeholder="https://framer.com/@you"
              />
            </Field>
            <Field
              label="Number of Framer templates you currently have"
              htmlFor="creator-count"
              error={errors.template_count}
            >
              <Input
                id="creator-count"
                inputMode="numeric"
                value={form.template_count}
                onChange={(e) =>
                  setForm({ ...form, template_count: e.target.value })
                }
                placeholder="12"
              />
            </Field>
            <Field
              label="What type of templates do you want to list?"
              htmlFor="creator-desc"
              error={errors.description}
            >
              <Textarea
                id="creator-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="SaaS dashboards, agency sites, and portfolio templates."
              />
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
              label="I want to be notified when FNJ Marketplace creator submissions open."
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
            {submitting ? "Reserving…" : "Reserve Creator Access"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
