import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingView, parseFilters } from "@/components/ListingView";
import { getActiveMarkets, getCategories, getCategoryBySeoSlug, getMarket } from "@/lib/data";

// SEO landing pages, e.g. /indore/birthday-photographer
export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveMarkets().flatMap((m) => getCategories().map((c) => ({ city: m.slug, event: c.seoSlug })));
}

export async function generateMetadata({ params }: PageProps<"/[city]/[event]">): Promise<Metadata> {
  const { city, event } = await params;
  const market = getMarket(city);
  const category = getCategoryBySeoSlug(event);
  if (!market || !category) return {};
  return {
    title: `${category.name} photographer in ${market.city}`,
    description: `Book a verified ${category.name.toLowerCase()} photographer in ${market.city}. ${category.blurb} Compare packages from local photographers.`,
  };
}

export default async function CityEventPage({ params, searchParams }: PageProps<"/[city]/[event]">) {
  const { city, event } = await params;
  const market = getMarket(city);
  const category = getCategoryBySeoSlug(event);
  if (!market || market.status !== "active" || !category) notFound();
  const filters = parseFilters(await searchParams, { city: market.slug, event: category.slug });

  return (
    <ListingView
      filters={filters}
      lockCity
      lockEvent
      heading={`${category.name} photographers in ${market.city}`}
      intro={`${category.blurb} Most ${category.name.toLowerCase()} bookings in ${market.city} are ${category.typicalHours}. Compare packages, check availability and send a request in minutes.`}
    />
  );
}
