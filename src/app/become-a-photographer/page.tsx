import type { Metadata } from "next";
import { JoinForm } from "@/components/JoinForm";
import { getCategories, getMarkets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Join as a photographer",
  description: "Get confirmed photography bookings in your city with full event details upfront.",
};

const benefits = [
  { t: "Confirmed jobs, not leads", d: "You see the event, date, hours, venue and package before you accept. No haggling calls." },
  { t: "Fill your weekdays", d: "Birthdays, poojas and shop openings happen all year — not just in wedding season." },
  { t: "Clear payouts", d: "See exactly what you earn on each job after commission. Paid after delivery is confirmed." },
  { t: "You stay in control", d: "Set your own packages, service area and blocked dates. Accept only what suits you." },
];

const steps = ["Apply with your basic details", "Short call + portfolio review", "ID and phone verification", "Set packages and go live"];

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-brand-600">For photographers &amp; videographers</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">Get more bookings in your city.</h1>
          <p className="mt-4 text-lg text-stone-600">
            Join a curated group of verified photographers. No joining fee during launch. We only earn a small commission when you complete a booking.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.t}>
                <h3 className="font-semibold">{b.t}</h3>
                <p className="mt-1 text-sm text-muted">{b.d}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-10 font-semibold">How joining works</h2>
          <ol className="mt-3 space-y-2">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <JoinForm markets={getMarkets()} categories={getCategories()} />
        </div>
      </div>
    </div>
  );
}
