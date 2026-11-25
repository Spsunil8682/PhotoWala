import Image from "next/image";
import Link from "next/link";
import { getMarket, startingPackage } from "@/lib/data";
import { formatINR, formatResponseTime, img, serviceLabel } from "@/lib/format";
import type { Photographer } from "@/lib/types";
import { TierBadge, VerifiedBadge } from "./Badges";
import { Stars } from "./Stars";

export function PhotographerCard({ p, event, date }: { p: Photographer; event?: string; date?: string }) {
  const pkg = startingPackage(p, event);
  const market = getMarket(p.market);
  const q = new URLSearchParams();
  if (event) q.set("event", event);
  if (date) q.set("date", date);
  const href = `/photographer/${p.slug}${q.size ? `?${q}` : ""}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-0.5 bg-stone-100">
        {p.portfolio.slice(0, 3).map((ph, i) => (
          <div key={ph.seed} className={`relative ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
            <Image
              src={img(ph.seed, i === 0 ? 600 : 300, i === 0 ? 450 : 225)}
              alt={ph.caption}
              fill
              sizes={i === 0 ? "(max-width: 640px) 66vw, 260px" : "130px"}
              className="object-cover"
            />
          </div>
        ))}
        {date && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow">
            ● Available on your date
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <Image
            src={img(p.avatarSeed, 96, 96)}
            alt=""
            width={44}
            height={44}
            className="relative z-10 -mt-9 rounded-full border-2 border-white object-cover shadow"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-semibold group-hover:text-brand-600">{p.name}</h3>
              <Stars rating={p.rating} count={p.reviewCount} />
            </div>
            <p className="truncate text-sm text-muted">
              {p.studioName ? `${p.studioName} · ` : ""}{p.baseLocality}, {market?.city}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.verified && <VerifiedBadge />}
          <TierBadge years={p.experienceYears} />
          {p.services.filter((s) => s !== "photo").map((s) => (
            <span key={s} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
              {serviceLabel[s]}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
          <div>
            <p className="text-xs text-muted">Packages from</p>
            <p className="text-lg font-bold">{pkg ? formatINR(pkg.price) : "—"}</p>
            {pkg && (
              <p className="text-xs text-muted">
                {pkg.durationHours} hrs · {pkg.editedPhotos} edited photos · {pkg.deliveryDays}-day delivery
              </p>
            )}
          </div>
          <p className="shrink-0 whitespace-nowrap text-right text-xs text-muted">Replies in<br /><span className="font-semibold text-ink">~{formatResponseTime(p.responseTimeMins)}</span></p>
        </div>
      </div>
    </Link>
  );
}
