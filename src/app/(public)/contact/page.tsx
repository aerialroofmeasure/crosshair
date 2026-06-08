"use client";

import { useState } from "react";
import { Mail, Clock, MessageSquare, Check, Loader2 } from "lucide-react";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      setState(res.ok ? "ok" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">Contact</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Talk to a human.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            For sample reports, custom volume pricing, integrations or anything else.
            Most replies land within 4 business hours.
          </p>
        </div>
      </section>

      {/* Form/sidebar sits just below the hero with a gentle overlap so it
          doesn't slam into the navy band, but still feels visually connected. */}
      <section className="-mt-12 md:-mt-14 pb-20 relative z-10">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-8 md:p-10">
            {state === "ok" ? (
              <div className="text-center py-14">
                <div className="mx-auto h-12 w-12 rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-600)] flex items-center justify-center">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-display">Message received.</h2>
                <p className="mt-3 text-[color:var(--color-stone)]">
                  We&apos;ll get back to you within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Your name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <Field label="Company (optional)" name="company" />
                <Field label="What can we help with?" name="subject" required />
                <TextareaField label="Message" name="message" rows={6} required />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
                  <p className="text-xs text-[color:var(--color-stone)] max-w-sm">
                    By submitting, you agree we can reply to the email address you
                    provided. We never share details.
                  </p>
                  <Button type="submit" disabled={state === "submitting"} size="lg">
                    {state === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending
                      </>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </div>

                {state === "error" && (
                  <p className="text-sm text-red-600">
                    Couldn&apos;t send the message. Email{" "}
                    <a href={`mailto:${siteConfig.email.support}`} className="underline">
                      {siteConfig.email.support}
                    </a>{" "}
                    instead.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              body={siteConfig.email.support}
              href={`mailto:${siteConfig.email.support}`}
            />
            <ContactCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Orders"
              body={siteConfig.email.orders}
              href={`mailto:${siteConfig.email.orders}`}
            />
            <ContactCard
              icon={<Clock className="h-5 w-5" />}
              title="Hours"
              body="Mon–Fri · 9am–6pm ET"
              sub="Replies within 4 business hours"
            />
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
        {required && <span className="text-[color:var(--color-copper-600)]"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full h-12 px-4 rounded-lg border border-[color:var(--color-border-soft)] bg-[color:var(--color-warm-white)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
        {required && <span className="text-[color:var(--color-copper-600)]"> *</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-[color:var(--color-border-soft)] bg-[color:var(--color-warm-white)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition resize-none"
      />
    </label>
  );
}

function ContactCard({
  icon,
  title,
  body,
  sub,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="h-10 w-10 rounded-lg bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-[0.12em] text-[color:var(--color-stone)] font-medium">
          {title}
        </div>
        <div className="mt-1 text-[color:var(--color-navy-900)] font-medium">{body}</div>
        {sub && <div className="mt-1 text-sm text-[color:var(--color-stone)]">{sub}</div>}
      </div>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-6 hover:border-[color:var(--color-copper-300)] transition"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-6">
      {inner}
    </div>
  );
}
