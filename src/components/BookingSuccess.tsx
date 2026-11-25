"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatDate, formatINR } from "@/lib/format";
import { site } from "@/lib/site";
import { DRAFT_KEY, type BookingDraft } from "./BookingForm";

function readDraft(): string | null {
  try {
    return sessionStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

export function BookingSuccess({ refId }: { refId?: string }) {
  const raw = useSyncExternalStore(() => () => {}, readDraft, () => null);
  let d: BookingDraft | null = null;
  try {
    d = raw ? (JSON.parse(raw) as BookingDraft) : null;
  } catch {
    d = null;
  }
  if (d && refId && d.ref !== refId) d = null;

  const steps = [
    { t: "Request sent", d: "We've shared your event details with the photographer.", done: true },
    { t: "Photographer confirms", d: `Usually within ${site.acceptWindowHours} hours. You'll get a WhatsApp message.`, done: false },
    { t: `Pay ${site.advancePercent}% advance`, d: "Secure payment link — booking is confirmed once payment is verified.", done: false },
    { t: "Event day reminders", d: "We remind you and the photographer 24 hours and 2 hours before.", done: false },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="mt-5 font-display text-3xl font-semibold">Booking request sent!</h1>
        {refId && <p className="mt-2 text-muted">Reference: <b className="text-ink">{refId}</b></p>}
      </div>

      {d && (
        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 text-sm ring-1 ring-line">
          <div><dt className="text-muted">Photographer</dt><dd className="font-medium">{d.photographerName}</dd></div>
          <div><dt className="text-muted">Package</dt><dd className="font-medium">{d.packageTitle}</dd></div>
          <div><dt className="text-muted">Event</dt><dd className="font-medium">{d.event}</dd></div>
          <div><dt className="text-muted">When</dt><dd className="font-medium">{formatDate(d.date)}, {d.startTime} ({d.durationHours} hrs)</dd></div>
          <div className="col-span-2"><dt className="text-muted">Venue</dt><dd className="font-medium">{d.address}, {d.locality}</dd></div>
          <div><dt className="text-muted">Package total</dt><dd className="font-medium">{formatINR(d.price)}</dd></div>
          <div><dt className="text-muted">Advance (after acceptance)</dt><dd className="font-medium">{formatINR(d.advance)}</dd></div>
        </dl>
      )}

      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li key={s.t} className="flex gap-4">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${s.done ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-600"}`}>{i + 1}</span>
            <div>
              <p className="font-semibold">{s.t}</p>
              <p className="text-sm text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/photographers" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-stone-400">Browse more photographers</Link>
        <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Back to home</Link>
      </div>
      <p className="mt-8 text-center text-xs text-muted">Demo build: no request was actually sent.</p>
    </div>
  );
}
