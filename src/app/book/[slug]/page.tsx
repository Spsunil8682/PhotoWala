import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { Stars } from "@/components/Stars";
import { getCategories, getMarket, getPhotographer } from "@/lib/data";
import { img, todayIST } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Request a booking", robots: { index: false } };

export default async function BookPage({ params, searchParams }: PageProps<"/book/[slug]">) {
  const p = getPhotographer((await params).slug);
  if (!p) notFound();
  const sp = await searchParams;
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const market = getMarket(p.market);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href={`/photographer/${p.slug}`} className="text-sm text-muted hover:text-ink">← Back to profile</Link>
      <div className="mt-4 flex items-center gap-4">
        <Image src={img(p.avatarSeed, 120, 120)} alt="" width={56} height={56} className="rounded-xl object-cover" />
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Request {p.name}</h1>
          <p className="text-sm text-muted">{p.baseLocality}, {market?.city} · <Stars rating={p.rating} count={p.reviewCount} /></p>
        </div>
      </div>
      <div className="mt-8">
        <BookingForm
          p={p}
          categories={getCategories()}
          localities={market?.localities ?? []}
          minDate={todayIST()}
          advancePercent={site.advancePercent}
          acceptWindowHours={site.acceptWindowHours}
          initial={{ packageId: str(sp.package), event: str(sp.event), date: str(sp.date) }}
        />
      </div>
    </div>
  );
}
