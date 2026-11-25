"use client";

import { useState } from "react";
import type { EventCategory, Market } from "@/lib/types";

export function JoinForm({ markets, categories }: { markets: Market[]; categories: EventCategory[] }) {
  const [sent, setSent] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-line">
        <p className="text-3xl">🎉</p>
        <h3 className="mt-3 font-display text-2xl font-semibold">Thanks! We&apos;ll call you within 48 hours.</h3>
        <p className="mt-2 text-sm text-muted">Keep 10–15 of your best photos ready for portfolio review. (Demo: nothing was submitted.)</p>
      </div>
    );
  }

  const input = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true); // TODO(Stage 2): real onboarding with phone OTP
      }}
      className="grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-line sm:grid-cols-2"
    >
      <label className="text-sm font-medium">Full name<input required className={input} autoComplete="name" /></label>
      <label className="text-sm font-medium">Studio name <span className="text-muted">(optional)</span><input className={input} /></label>
      <label className="text-sm font-medium">Mobile (WhatsApp)<input required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} className={input} placeholder="10-digit number" /></label>
      <label className="text-sm font-medium">City
        <select required className={input} defaultValue="">
          <option value="" disabled>Select</option>
          {markets.map((m) => <option key={m.slug} value={m.slug}>{m.city}{m.status !== "active" ? " (waitlist)" : ""}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium">Years of experience<input required type="number" min={0} max={50} className={input} /></label>
      <label className="text-sm font-medium">Instagram / portfolio link<input type="url" className={input} placeholder="https://" /></label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium">Events you cover</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = picked.includes(c.slug);
            return (
              <button
                type="button"
                key={c.slug}
                aria-pressed={on}
                onClick={() => setPicked(on ? picked.filter((x) => x !== c.slug) : [...picked, c.slug])}
                className={`rounded-full px-3 py-1.5 text-sm ring-1 ${on ? "bg-ink text-white ring-ink" : "ring-line hover:ring-stone-400"}`}
              >
                {c.emoji} {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>
      <button className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 sm:col-span-2">Apply to join</button>
    </form>
  );
}
