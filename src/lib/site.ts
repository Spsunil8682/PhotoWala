// Central place for brand + business settings. Change the name here once
// the founders pick a brand.
export const site = {
  name: "PhotoStudio",
  tagline: "Book trusted local photographers for every small celebration",
  description:
    "Find and book verified photographers and videographers for birthdays, poojas, baby showers, engagements, griha pravesh and shop openings. Clear packages, confirmed availability, on-time delivery.",
  whatsapp: "919999999999", // dummy number — replace before launch
  supportPhone: "+91 99999 99999",
  supportEmail: "hello@example.com",
  /** Share of the package price collected to confirm a booking. */
  advancePercent: 30,
  /** Hours a photographer has to accept a request. */
  acceptWindowHours: 2,
} as const;

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
