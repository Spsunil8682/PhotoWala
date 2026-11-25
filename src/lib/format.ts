import type { Paise, ServiceType } from "./types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Format an integer paise amount as "₹4,999". */
export const formatINR = (paise: Paise) => inr.format(Math.round(paise / 100));

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatResponseTime = (mins: number) =>
  mins < 60 ? `${mins} min` : `${Math.round(mins / 60)} hr`;

export const serviceLabel: Record<ServiceType, string> = {
  photo: "Photography",
  video: "Videography",
  drone: "Drone",
};

export function experienceTier(years: number) {
  if (years >= 10) return { label: "Elite", className: "bg-amber-100 text-amber-800" };
  if (years >= 6) return { label: "Premium", className: "bg-violet-100 text-violet-800" };
  if (years >= 3) return { label: "Pro", className: "bg-sky-100 text-sky-800" };
  return { label: "Rising", className: "bg-emerald-100 text-emerald-800" };
}

/** picsum.photos placeholder — swap for real storage URLs later. */
export const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

/** Today's date (YYYY-MM-DD) in India time. */
export function todayIST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}
