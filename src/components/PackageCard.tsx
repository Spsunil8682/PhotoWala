import Link from "next/link";
import { formatINR } from "@/lib/format";
import type { Package } from "@/lib/types";

const videoLabel = { reel: "Reel", highlight: "Highlight film", full: "Full film" } as const;

export function PackageCard({ pkg, bookHref }: { pkg: Package; bookHref: string }) {
  const facts = [
    { k: "Coverage", v: `${pkg.durationHours} hours` },
    { k: "Edited photos", v: `${pkg.editedPhotos}` },
    { k: "Raw files", v: pkg.rawFilesIncluded ? "Included" : "Not included" },
    { k: "Video", v: pkg.video ? `${videoLabel[pkg.video.kind]} (${pkg.video.minutes} min)` : "—" },
    { k: "Delivery", v: `Within ${pkg.deliveryDays} days` },
    { k: "Overtime", v: `${formatINR(pkg.overtimePerHour)}/hr` },
  ];
  return (
    <div className={`relative flex flex-col rounded-2xl bg-white p-5 ring-1 ${pkg.popular ? "ring-2 ring-brand-500" : "ring-line"}`}>
      {pkg.popular && (
        <span className="absolute -top-3 left-5 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
          Most booked
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{pkg.title}</h3>
        <p className="text-xl font-bold">{formatINR(pkg.price)}</p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {facts.map((f) => (
          <div key={f.k}>
            <dt className="text-xs text-muted">{f.k}</dt>
            <dd className="font-medium">{f.v}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-4 space-y-1 text-sm">
        {pkg.inclusions.map((i) => (
          <li key={i} className="flex gap-2"><span className="text-emerald-600">✓</span>{i}</li>
        ))}
        {pkg.exclusions.map((i) => (
          <li key={i} className="flex gap-2 text-muted"><span>✕</span>{i}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Travel: {pkg.travel}</p>
      <Link
        href={bookHref}
        className={`mt-5 rounded-full px-4 py-2.5 text-center text-sm font-semibold ${pkg.popular ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-stone-900 text-white hover:bg-stone-700"}`}
      >
        Request this package
      </Link>
    </div>
  );
}
