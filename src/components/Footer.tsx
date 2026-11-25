import Link from "next/link";
import { getActiveMarkets, getCategories } from "@/lib/data";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const markets = getActiveMarkets();
  const categories = getCategories();
  return (
    <footer className="mt-20 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-stone-400">{site.tagline}.</p>
          <p className="mt-4 text-sm">{site.supportPhone}<br />{site.supportEmail}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Cities</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {markets.map((m) => (
              <li key={m.slug}><Link href={`/${m.slug}`} className="hover:text-white">Photographers in {m.city}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Events</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}><Link href={`/photographers?event=${c.slug}`} className="hover:text-white">{c.name} photography</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/#how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link href="/become-a-photographer" className="hover:text-white">Join as a photographer</Link></li>
            <li><Link href="/policies/cancellation" className="hover:text-white">Cancellation &amp; refunds</Link></li>
            <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-6 text-center text-xs text-stone-500">
        © 2026 {site.name}. Demo build with dummy data.
      </div>
    </footer>
  );
}
