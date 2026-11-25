// Shared domain types. These mirror the planned database tables so the
// dummy data can later be swapped for API / Supabase calls without
// changing the UI components.

/** All money values are integers in paise (₹1 = 100 paise). Never floats. */
export type Paise = number;

export type MarketStatus = "active" | "coming_soon";

export interface Market {
  slug: string; // "indore"
  city: string; // "Indore"
  district: string;
  state: string;
  status: MarketStatus;
  localities: string[];
}

export interface EventCategory {
  slug: string; // "birthday"
  name: string; // "Birthday"
  seoSlug: string; // "birthday-photographer" -> /indore/birthday-photographer
  emoji: string;
  blurb: string;
  typicalHours: string;
}

export type ServiceType = "photo" | "video" | "drone";

export interface PackageVideo {
  kind: "reel" | "highlight" | "full";
  minutes: number;
}

export interface Package {
  id: string;
  title: string;
  price: Paise;
  durationHours: number;
  editedPhotos: number;
  rawFilesIncluded: boolean;
  video?: PackageVideo;
  deliveryDays: number;
  travel: string; // e.g. "Free within 10 km, ₹15/km after"
  overtimePerHour: Paise;
  inclusions: string[];
  exclusions: string[];
  eventCategories: string[]; // EventCategory slugs
  popular?: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  eventCategory: string;
  rating: number; // 1-5
  date: string; // ISO date
  comment: string;
}

export interface Photographer {
  slug: string;
  name: string;
  studioName?: string;
  market: string; // Market slug
  baseLocality: string;
  radiusKm: number;
  experienceYears: number;
  languages: string[];
  services: ServiceType[];
  categories: string[]; // EventCategory slugs
  bio: string;
  gear: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  completedBookings: number;
  responseTimeMins: number;
  avatarSeed: string;
  coverSeed: string;
  portfolio: { seed: string; caption: string; category: string }[];
  packages: Package[];
  reviews: Review[];
  blockedDates: string[]; // ISO dates (YYYY-MM-DD) the photographer is unavailable
}

export interface SearchFilters {
  city?: string;
  event?: string;
  date?: string;
  maxBudget?: number; // rupees
  service?: ServiceType;
  sort?: "recommended" | "price_asc" | "price_desc" | "rating";
}
