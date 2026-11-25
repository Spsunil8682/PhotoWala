// Data access layer. Today it reads the dummy files in src/data; later each
// function becomes a Supabase / API call with the same signature, so pages
// and components don't need to change.
import { eventCategories, markets } from "@/data/markets";
import { photographers } from "@/data/photographers";
import type { Package, Photographer, SearchFilters } from "./types";

export const getMarkets = () => markets;
export const getActiveMarkets = () => markets.filter((m) => m.status === "active");
export const getMarket = (slug?: string) => markets.find((m) => m.slug === slug);

export const getCategories = () => eventCategories;
export const getCategory = (slug?: string) => eventCategories.find((c) => c.slug === slug);
export const getCategoryBySeoSlug = (seoSlug: string) =>
  eventCategories.find((c) => c.seoSlug === seoSlug);

export const getPhotographer = (slug: string) => photographers.find((p) => p.slug === slug);

/** Cheapest active package, optionally limited to an event type. */
export function startingPackage(p: Photographer, event?: string): Package | undefined {
  const pkgs = event ? p.packages.filter((k) => k.eventCategories.includes(event)) : p.packages;
  return [...pkgs].sort((a, b) => a.price - b.price)[0];
}

export const isAvailable = (p: Photographer, date?: string) =>
  !date || !p.blockedDates.includes(date);

export function searchPhotographers(f: SearchFilters): Photographer[] {
  let list = photographers.filter((p) => {
    if (f.city && p.market !== f.city) return false;
    if (f.event && !p.categories.includes(f.event)) return false;
    if (f.service && !p.services.includes(f.service)) return false;
    if (!isAvailable(p, f.date)) return false;
    if (f.maxBudget) {
      const pkg = startingPackage(p, f.event);
      if (!pkg || pkg.price > f.maxBudget * 100) return false;
    }
    return true;
  });

  const price = (p: Photographer) => startingPackage(p, f.event)?.price ?? Infinity;
  switch (f.sort) {
    case "price_asc":
      list = list.sort((a, b) => price(a) - price(b));
      break;
    case "price_desc":
      list = list.sort((a, b) => price(b) - price(a));
      break;
    case "rating":
      list = list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // "Recommended": verified first, then rating weighted by volume.
      list = list.sort(
        (a, b) =>
          Number(b.verified) - Number(a.verified) ||
          b.rating * Math.log10(b.reviewCount + 10) - a.rating * Math.log10(a.reviewCount + 10),
      );
  }
  return list;
}

export function featuredPhotographers(limit = 6) {
  return searchPhotographers({ sort: "recommended" }).slice(0, limit);
}
