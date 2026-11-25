import { experienceTier } from "@/lib/format";

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}

export function TierBadge({ years }: { years: number }) {
  const t = experienceTier(years);
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.className}`}>
      {t.label} · {years} yrs
    </span>
  );
}
