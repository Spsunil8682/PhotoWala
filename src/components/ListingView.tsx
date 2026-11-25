import { Suspense } from "react";
import Link from "next/link";
import { Filters } from "./Filters";
import { PhotographerCard } from "./PhotographerCard";
import { getCategories, getCategory, getMarket, getMarkets, searchPhotographers } from "@/lib/data";
import { formatDate, todayIST } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import type { SearchFilters, ServiceType } from "@/lib/types";

type RawParams = { [key: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

/** Parse URL search params into validated filters. */
export function parseFilters(sp: RawParams, fixed: Partial<SearchFilters> = {}): SearchFilters {
  const sort = one(sp.sort);
  const service = one(sp.service);
  const date = one(sp.date);
  const budget = Number(one(sp.budget));
  return {
    city: fixed.city ?? (getMarket(one(sp.city))?.slug),
    event: fixed.event ?? (getCategory(one(sp.event))?.slug),
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    maxBudget: Number.isFinite(budget) && budget > 0 ? budget : undefined,
    service: service === "video" || service === "drone" ? (service as ServiceType) : undefined,
    sort: sort === "rating" || sort === "price_asc" || sort === "price_desc" ? sort : "recommended",
  };
}

export function ListingView({
  filters,
  heading,
  intro,
  lockCity,
  lockEvent,
}: {
  filters: SearchFilters;
  heading: string;
  intro?: string;
  lockCity?: boolean;
  lockEvent?: boolean;
}) {
  const results = searchPhotographers(filters);
  const market = getMarket(filters.city);
  const category = getCategory(filters.event);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        {market && <> / <Link href={`/${market.slug}`} className="hover:text-ink">{market.city}</Link></>}
        {category && <> / {category.name}</>}
      </nav>
      <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{heading}</h1>
      {intro && <p className="mt-2 max-w-3xl text-stone-600">{intro}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <Suspense>
            <Filters markets={getMarkets()} categories={getCategories()} minDate={todayIST()} lockCity={lockCity} lockEvent={lockEvent} />
          </Suspense>
        </aside>
        <section className="min-w-0">
          <p className="text-sm text-muted">
            {results.length} photographer{results.length === 1 ? "" : "s"}
            {filters.date ? ` available on ${formatDate(filters.date)}` : ""}
          </p>
          {results.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {results.map((p) => (
                <PhotographerCard key={p.slug} p={p} event={filters.event} date={filters.date} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-white p-10 text-center ring-1 ring-line">
              <p className="font-semibold">No photographers match these filters.</p>
              <p className="mt-2 text-sm text-muted">Try another date or budget, or message us and we&apos;ll find someone for you.</p>
              <a
                href={whatsappLink(`Hi, I need a photographer${category ? ` for a ${category.name}` : ""}${market ? ` in ${market.city}` : ""}${filters.date ? ` on ${filters.date}` : ""}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Ask on WhatsApp
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
