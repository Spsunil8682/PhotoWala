import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingView, parseFilters } from "@/components/ListingView";
import { getActiveMarkets, getCategories, getMarket } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveMarkets().map((m) => ({ city: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[city]">): Promise<Metadata> {
  const market = getMarket((await params).city);
  if (!market) return {};
  return {
    title: `Photographers in ${market.city} for birthdays, poojas & events`,
    description: `Book verified photographers in ${market.city} for birthdays, poojas, baby showers, griha pravesh and shop openings. Clear packages and on-time delivery.`,
  };
}

export default async function CityPage({ params, searchParams }: PageProps<"/[city]">) {
  const market = getMarket((await params).city);
  if (!market || market.status !== "active") notFound();
  const filters = parseFilters(await searchParams, { city: market.slug });

  return (
    <>
      <ListingView
        filters={filters}
        lockCity
        heading={`Photographers in ${market.city}`}
        intro={`Verified photographers and videographers serving ${market.localities.slice(0, 4).join(", ")} and the rest of ${market.district} district.`}
      />
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-2xl font-semibold">Popular in {market.city}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {getCategories().map((c) => (
            <Link key={c.slug} href={`/${market.slug}/${c.seoSlug}`} className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-line hover:ring-brand-500">
              {c.name} photographer in {market.city}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
