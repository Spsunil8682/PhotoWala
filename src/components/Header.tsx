import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          <Link href="/photographers" className="hover:text-brand-600">Find photographers</Link>
          <Link href="/#how-it-works" className="hover:text-brand-600">How it works</Link>
          <Link href="/become-a-photographer" className="hover:text-brand-600">For photographers</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={whatsappLink("Hi, I want to book a photographer.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-emerald-500 hover:text-emerald-700 sm:inline-flex"
          >
            WhatsApp us
          </a>
          <Link
            href="/photographers"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}
