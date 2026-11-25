import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityCheck } from "@/components/AvailabilityCheck";
import { TierBadge, VerifiedBadge } from "@/components/Badges";
import { Gallery } from "@/components/Gallery";
import { PackageCard } from "@/components/PackageCard";
import { Stars } from "@/components/Stars";
import { photographers } from "@/data/photographers";
import { getCategory, getMarket, getPhotographer, startingPackage } from "@/lib/data";
import { formatDate, formatINR, formatResponseTime, img, serviceLabel, todayIST } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export function generateStaticParams() {
  return photographers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/photographer/[slug]">): Promise<Metadata> {
  const p = getPhotographer((await params).slug);
  if (!p) return {};
  const market = getMarket(p.market);
  return {
    title: `${p.name}${p.studioName ? ` (${p.studioName})` : ""} — Photographer in ${market?.city}`,
    description: p.bio.slice(0, 155),
  };
}

export default async function PhotographerPage({ params, searchParams }: PageProps<"/photographer/[slug]">) {
  const p = getPhotographer((await params).slug);
  if (!p) notFound();
  const sp = await searchParams;
  const event = getCategory(typeof sp.event === "string" ? sp.event : undefined)?.slug;
  const date = typeof sp.date === "string" ? sp.date : undefined;
  const market = getMarket(p.market);
  const from = startingPackage(p, event);

  // Packages relevant to the chosen event first.
  const packages = [...p.packages].sort(
    (a, b) => Number(!!event && b.eventCategories.includes(event)) - Number(!!event && a.eventCategories.includes(event)) || a.price - b.price,
  );

  const bookHref = (pkgId?: string) => {
    const q = new URLSearchParams();
    if (pkgId) q.set("package", pkgId);
    if (event) q.set("event", event);
    if (date) q.set("date", date);
    return `/book/${p.slug}?${q}`;
  };

  return (
    <div>
      {/* Cover */}
      <div className="relative h-48 bg-stone-200 sm:h-64">
        <Image src={img(p.coverSeed, 1600, 500)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            {/* Header */}
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <Image
                src={img(p.avatarSeed, 240, 240)}
                alt={p.name}
                width={112}
                height={112}
                className="relative rounded-2xl border-4 border-white object-cover shadow-lg"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-3xl font-semibold">{p.name}</h1>
                  {p.verified && <VerifiedBadge />}
                </div>
                <p className="text-muted">
                  {p.studioName ? `${p.studioName} · ` : ""}{p.baseLocality}, {market?.city} · serves up to {p.radiusKm} km
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Stars rating={p.rating} count={p.reviewCount} size="md" />
              <TierBadge years={p.experienceYears} />
              <span><b>{p.completedBookings}</b> bookings completed</span>
              <span>Replies in <b>~{formatResponseTime(p.responseTimeMins)}</b></span>
            </div>

            {/* Portfolio */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Portfolio</h2>
              <div className="mt-4">
                <Gallery items={p.portfolio} />
              </div>
            </section>

            {/* Packages */}
            <section id="packages" className="mt-12 scroll-mt-24">
              <h2 className="font-display text-2xl font-semibold">Packages</h2>
              <p className="mt-1 text-sm text-muted">All prices are fixed. You pay a {site.advancePercent}% advance only after {p.name.split(" ")[0]} accepts your request.</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} bookHref={bookHref(pkg.id)} />)}
              </div>
            </section>

            {/* About */}
            <section className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl font-semibold">About</h2>
                <p className="mt-3 leading-relaxed text-stone-700">{p.bio}</p>
              </div>
              <dl className="space-y-3 rounded-2xl bg-white p-5 text-sm ring-1 ring-line">
                <Row k="Services" v={p.services.map((s) => serviceLabel[s]).join(", ")} />
                <Row k="Events" v={p.categories.map((c) => getCategory(c)?.name).join(", ")} />
                <Row k="Languages" v={p.languages.join(", ")} />
                <Row k="Equipment" v={p.gear.join(", ")} />
                <Row k="Service area" v={`${p.radiusKm} km from ${p.baseLocality}`} />
              </dl>
            </section>

            {/* Reviews */}
            <section className="mt-12">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-semibold">Reviews</h2>
                <Stars rating={p.rating} count={p.reviewCount} />
              </div>
              <p className="mt-1 text-xs text-muted">Only customers with a completed booking can leave a review.</p>
              <ul className="mt-5 space-y-4">
                {p.reviews.map((r) => (
                  <li key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-line">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{r.customerName}</p>
                      <span className="text-xs text-muted">{getCategory(r.eventCategory)?.name} · {formatDate(r.date)}</span>
                    </div>
                    <p className="mt-1 text-amber-500" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}<span className="text-stone-300">{"★".repeat(5 - r.rating)}</span></p>
                    <p className="mt-2 text-sm text-stone-700">{r.comment}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:pt-8">
            <div className="space-y-4 rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-line lg:sticky lg:top-24">
              <div>
                <p className="text-sm text-muted">Packages from</p>
                <p className="text-3xl font-bold">{from ? formatINR(from.price) : "—"}</p>
              </div>
              <AvailabilityCheck blockedDates={p.blockedDates} minDate={todayIST()} initialDate={date} />
              <Link href={bookHref(from?.id)} className="block rounded-full bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-700">
                Request booking
              </Link>
              <a href="#packages" className="block text-center text-sm font-semibold text-brand-600 hover:underline">Compare all packages</a>
              <ul className="space-y-2 border-t border-line pt-4 text-sm text-stone-600">
                <li>✓ No payment until the photographer accepts</li>
                <li>✓ Replacement or full refund if they cancel</li>
                <li>✓ Delivery date written into every package</li>
              </ul>
              <a
                href={whatsappLink(`Hi, I have a question about ${p.name} (${p.slug}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full border border-line px-4 py-2.5 text-center text-sm font-semibold hover:border-emerald-500 hover:text-emerald-700"
              >
                Questions? WhatsApp us
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
      <dd className="mt-0.5">{v}</dd>
    </div>
  );
}
