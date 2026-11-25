import type { Metadata } from "next";
import { ListingView, parseFilters } from "@/components/ListingView";
import { getCategory, getMarket } from "@/lib/data";

export const metadata: Metadata = {
  title: "Find photographers",
  description: "Compare verified local photographers and videographers with clear packages.",
};

export default async function PhotographersPage({ searchParams }: PageProps<"/photographers">) {
  const filters = parseFilters(await searchParams);
  const market = getMarket(filters.city);
  const category = getCategory(filters.event);
  const heading = `${category ? `${category.name} photographers` : "Photographers"}${market ? ` in ${market.city}` : ""}`;
  return <ListingView filters={filters} heading={heading} />;
}
