"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate, formatINR } from "@/lib/format";
import type { EventCategory, Photographer } from "@/lib/types";

export interface BookingDraft {
  ref: string;
  photographerSlug: string;
  photographerName: string;
  packageTitle: string;
  price: number;
  advance: number;
  event: string;
  date: string;
  startTime: string;
  durationHours: number;
  locality: string;
  address: string;
  name: string;
  phone: string;
  createdAt: string;
}

export const DRAFT_KEY = "booking-request";

/** Demo-only reference; the server will issue real booking IDs. */
const makeRef = () => `BK${Date.now().toString(36).toUpperCase().slice(-6)}`;

interface Props {
  p: Photographer;
  categories: EventCategory[];
  localities: string[];
  minDate: string;
  advancePercent: number;
  acceptWindowHours: number;
  initial: { packageId?: string; event?: string; date?: string };
}

export function BookingForm({ p, categories, localities, minDate, advancePercent, acceptWindowHours, initial }: Props) {
  const router = useRouter();
  const [packageId, setPackageId] = useState(initial.packageId ?? p.packages[0].id);
  const [event, setEvent] = useState(initial.event && p.categories.includes(initial.event) ? initial.event : "");
  const [date, setDate] = useState(initial.date ?? "");
  const [startTime, setStartTime] = useState("18:00");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const pkg = p.packages.find((k) => k.id === packageId) ?? p.packages[0];
  const advance = Math.round((pkg.price * advancePercent) / 100);
  const blocked = date !== "" && p.blockedDates.includes(date);
  const eventOptions = useMemo(() => categories.filter((c) => p.categories.includes(c.slug)), [categories, p.categories]);

  function validate() {
    const e: Record<string, string> = {};
    if (!event) e.event = "Choose the event type";
    if (!date) e.date = "Choose a date";
    else if (date < minDate) e.date = "Date can't be in the past";
    else if (blocked) e.date = "Photographer is not available on this date";
    if (!startTime) e.startTime = "Choose a start time";
    if (!locality) e.locality = "Choose the area";
    if (address.trim().length < 10) e.address = "Enter the full venue address";
    if (name.trim().length < 2) e.name = "Enter your name";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a valid 10-digit mobile number";
    if (!agree) e.agree = "Please accept the cancellation policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // TODO(Stage 4): POST /api/booking-requests — the server recalculates price.
    const draft: BookingDraft = {
      ref: makeRef(),
      photographerSlug: p.slug,
      photographerName: p.name,
      packageTitle: pkg.title,
      price: pkg.price,
      advance,
      event: categories.find((c) => c.slug === event)?.name ?? event,
      date,
      startTime,
      durationHours: pkg.durationHours,
      locality,
      address,
      name,
      phone,
      createdAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable — success page shows a generic message */
    }
    router.push(`/book/success?ref=${draft.ref}`);
  }

  const input = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
  const label = "block text-sm font-medium";
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <fieldset className="rounded-2xl bg-white p-5 ring-1 ring-line">
          <legend className="px-1 font-semibold">1. Package</legend>
          <div className="mt-2 space-y-2">
            {p.packages.map((k) => (
              <label key={k.id} className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ${k.id === packageId ? "bg-brand-50 ring-brand-500" : "ring-line hover:ring-stone-400"}`}>
                <input type="radio" name="package" value={k.id} checked={k.id === packageId} onChange={() => setPackageId(k.id)} className="mt-1 accent-brand-600" />
                <span className="flex-1">
                  <span className="flex justify-between gap-2 font-medium"><span>{k.title}</span><span>{formatINR(k.price)}</span></span>
                  <span className="block text-xs text-muted">
                    {k.durationHours} hrs · {k.editedPhotos} edited photos{k.video ? ` · ${k.video.kind}` : ""} · delivery in {k.deliveryDays} days
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-line sm:grid-cols-2">
          <legend className="px-1 font-semibold">2. Event details</legend>
          <label className={label}>
            Event type
            <select className={input} value={event} onChange={(e) => setEvent(e.target.value)}>
              <option value="">Select</option>
              {eventOptions.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            {err("event")}
          </label>
          <label className={label}>
            Date
            <input type="date" min={minDate} className={input} value={date} onChange={(e) => setDate(e.target.value)} />
            {blocked ? <p className="mt-1 text-xs text-red-600">Not available on {formatDate(date)}</p> : err("date")}
          </label>
          <label className={label}>
            Start time
            <input type="time" className={input} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <span className="mt-1 block text-xs text-muted">Coverage: {pkg.durationHours} hours from start</span>
            {err("startTime")}
          </label>
          <label className={label}>
            Area / locality
            <select className={input} value={locality} onChange={(e) => setLocality(e.target.value)}>
              <option value="">Select</option>
              {localities.map((l) => <option key={l}>{l}</option>)}
              <option value="Other">Other (outside list)</option>
            </select>
            {err("locality")}
          </label>
          <label className={`${label} sm:col-span-2`}>
            Venue address
            <textarea rows={2} className={input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / hall name, street, landmark" />
            {err("address")}
          </label>
          <label className={`${label} sm:col-span-2`}>
            Anything the photographer should know? <span className="text-muted">(optional)</span>
            <textarea rows={2} className={input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Must-have shots, guest count, theme, rituals…" />
          </label>
        </fieldset>

        <fieldset className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-line sm:grid-cols-2">
          <legend className="px-1 font-semibold">3. Your details</legend>
          <label className={label}>
            Full name
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            {err("name")}
          </label>
          <label className={label}>
            Mobile number (WhatsApp)
            <div className="mt-1 flex rounded-xl border border-line bg-white focus-within:border-brand-500">
              <span className="grid place-items-center px-3 text-sm text-muted">+91</span>
              <input className="w-full rounded-r-xl px-2 py-2.5 text-sm outline-none" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} autoComplete="tel-national" />
            </div>
            {err("phone")}
          </label>
          <label className="flex items-start gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-brand-600" />
            <span>
              I agree to the <a href="/policies/cancellation" target="_blank" className="font-medium text-brand-600 underline">cancellation &amp; refund policy</a> and to receive booking updates on WhatsApp.
              {err("agree")}
            </span>
          </label>
        </fieldset>
      </div>

      <aside>
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-line lg:sticky lg:top-24">
          <h2 className="font-semibold">Price summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>{pkg.title}</dt><dd>{formatINR(pkg.price)}</dd></div>
            <div className="flex justify-between text-muted"><dt>Travel</dt><dd className="max-w-[55%] text-right text-xs">{pkg.travel}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold"><dt>Package total</dt><dd>{formatINR(pkg.price)}</dd></div>
            <div className="flex justify-between text-brand-700"><dt>Advance after acceptance ({advancePercent}%)</dt><dd>{formatINR(advance)}</dd></div>
            <div className="flex justify-between text-muted"><dt>Balance before event</dt><dd>{formatINR(pkg.price - advance)}</dd></div>
          </dl>
          <button type="submit" disabled={submitting} className="w-full rounded-full bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {submitting ? "Sending…" : "Send booking request"}
          </button>
          <p className="text-xs text-muted">
            You won&apos;t be charged now. {p.name.split(" ")[0]} will accept or decline within {acceptWindowHours} hours, then we&apos;ll send you a secure payment link for the advance.
          </p>
        </div>
      </aside>
    </form>
  );
}
