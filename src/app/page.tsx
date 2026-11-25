import Image from "next/image";
import Link from "next/link";
import { PhotographerCard } from "@/components/PhotographerCard";
import { SearchBar } from "@/components/SearchBar";
import { featuredPhotographers, getCategories, getMarkets } from "@/lib/data";
import { img, todayIST } from "@/lib/format";
import { site } from "@/lib/site";

const steps = [
  { t: "Tell us about your event", d: "Pick the event type, city, date and time. Takes under a minute." },
  { t: "Compare clear packages", d: "Every package shows hours, edited-photo count, video, travel and delivery date — no hidden extras." },
  { t: "Photographer confirms", d: `The photographer accepts within ${site.acceptWindowHours} hours. Only then do you pay a ${site.advancePercent}% advance.` },
  { t: "Enjoy, then get your photos", d: "Your edited gallery arrives by the promised date. Confirm delivery or raise an issue with us." },
];

const promises = [
  { t: "Verified photographers", d: "ID, phone and portfolio checked by our team before they can take bookings." },
  { t: "Fixed, transparent pricing", d: "The price you see is the price you pay. Overtime and travel rules are written upfront." },
  { t: "Backup if anything goes wrong", d: "If your photographer cancels, we arrange a replacement or refund your advance in full." },
  { t: "Delivery-date promise", d: "Every package has a delivery deadline. We follow up so you don't have to." },
];

const faqs = [
  { q: "When do I pay?", a: `Only after the photographer accepts your request. You pay a ${site.advancePercent}% advance online to confirm the booking, and the balance before the event.` },
  { q: "What if the photographer cancels?", a: "We first try to arrange an equally rated replacement. If you don't want the replacement, your advance is refunded in full." },
  { q: "Can I cancel my booking?", a: "Yes. Refunds depend on how close to the event you cancel. See our cancellation and refund policy for the exact slabs." },
  { q: "How will I receive my photos?", a: "Through a private online gallery or Google Drive link shared by the photographer. You confirm delivery in the app." },
  { q: "Do prices include travel?", a: "Each package lists its travel terms, usually free within a set distance of the photographer's base." },
];

export default function Home() {
  const markets = getMarkets();
  const categories = getCategories();
  const featured = featuredPhotographers(6);
  const active = markets.filter((m) => m.status === "active");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-canvas">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div>
            <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              Now live in {active.map((m) => m.city).join(", ")}
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A great photographer for every <span className="text-brand-600">little celebration</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-600">
              Birthdays, poojas, baby showers, griha pravesh and shop openings. Compare verified local
              photographers with clear packages, and get your photos on a promised date.
            </p>
            <div className="mt-8">
              <SearchBar markets={markets} categories={categories} minDate={todayIST()} />
            </div>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div><dt className="text-muted">Starting at</dt><dd className="text-lg font-bold">₹1,999</dd></div>
              <div><dt className="text-muted">Verified pros</dt><dd className="text-lg font-bold">Phone + ID checked</dd></div>
              <div><dt className="text-muted">Pay advance</dt><dd className="text-lg font-bold">Only after confirmation</dd></div>
            </dl>
          </div>
          <div className="relative hidden h-[460px] lg:block">
            {[
              { s: "hero-a", c: "left-0 top-6 h-64 w-52 -rotate-3" },
              { s: "hero-b", c: "right-0 top-0 h-72 w-60 rotate-2" },
              { s: "hero-c", c: "bottom-0 left-16 h-56 w-72 rotate-1" },
            ].map((h) => (
              <div key={h.s} className={`absolute overflow-hidden rounded-2xl border-4 border-white shadow-xl ${h.c}`}>
                <Image src={img(h.s, 600, 600)} alt="" fill sizes="300px" className="object-cover" priority />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl font-semibold">What are you celebrating?</h2>
        <p className="mt-2 text-muted">Short events, done properly. Most bookings are 2–4 hours.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/photographers?event=${c.slug}`}
              className="rounded-2xl bg-white p-4 ring-1 ring-line transition hover:ring-brand-500"
            >
              <span className="text-3xl" aria-hidden>{c.emoji}</span>
              <h3 className="mt-3 font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted">{c.blurb}</p>
              <p className="mt-2 text-xs font-medium text-stone-500">Typically {c.typicalHours}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold">Top-rated near you</h2>
            <p className="mt-2 text-muted">Hand-picked photographers with excellent reviews.</p>
          </div>
          <Link href="/photographers" className="shrink-0 text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <PhotographerCard key={p.slug} p={p} />)}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="font-display text-3xl font-semibold">How it works</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-2xl bg-white p-5 ring-1 ring-line">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">{i + 1}</span>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Promises */}
      <section className="bg-stone-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-semibold">Our promise to you</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p) => (
              <div key={p.t}>
                <div className="h-1 w-10 rounded bg-brand-500" />
                <h3 className="mt-4 font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-stone-400">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-semibold">Cities</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {markets.map((m) =>
            m.status === "active" ? (
              <Link key={m.slug} href={`/${m.slug}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold ring-1 ring-line hover:ring-brand-500">
                {m.city}
              </Link>
            ) : (
              <span key={m.slug} className="rounded-full bg-stone-100 px-5 py-2.5 text-sm text-muted">
                {m.city} · coming soon
              </span>
            ),
          )}
        </div>
      </section>

      {/* Photographer CTA */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-600 p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="font-display text-3xl font-semibold">Are you a photographer?</h2>
            <p className="mt-2 max-w-lg text-brand-100">
              Get confirmed bookings in your area with full event details upfront. No listing fee while we launch.
            </p>
          </div>
          <Link href="/become-a-photographer" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
            Join as a photographer
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
        <h2 className="font-display text-3xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-stone-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
