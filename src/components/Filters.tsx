"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { EventCategory, Market } from "@/lib/types";

interface Props {
  markets: Market[];
  categories: EventCategory[];
  minDate: string;
  /** When on a city page the city is fixed by the URL. */
  lockCity?: boolean;
  /** On event landing pages the event is fixed by the URL. */
  lockEvent?: boolean;
}

const budgets = [3000, 5000, 10000, 20000];

export function Filters({ markets, categories, minDate, lockCity, lockEvent }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const q = new URLSearchParams(params.toString());
    if (value) q.set(key, value);
    else q.delete(key);
    router.replace(`${pathname}${q.size ? `?${q}` : ""}`, { scroll: false });
  }

  const select = "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm";
  const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted";
  const event = params.get("event") ?? "";

  return (
    <div className="space-y-5">
      {!lockEvent && (
      <div>
        <span className={label}>Event</span>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap">
          <Chip active={!event} onClick={() => set("event", "")}>All</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={event === c.slug} onClick={() => set("event", c.slug)}>
              {c.emoji} {c.name}
            </Chip>
          ))}
        </div>
      </div>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {!lockCity && (
          <label>
            <span className={label}>City</span>
            <select className={select} value={params.get("city") ?? ""} onChange={(e) => set("city", e.target.value)}>
              <option value="">All cities</option>
              {markets.filter((m) => m.status === "active").map((m) => (
                <option key={m.slug} value={m.slug}>{m.city}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span className={label}>Event date</span>
          <input type="date" min={minDate} className={select} value={params.get("date") ?? ""} onChange={(e) => set("date", e.target.value)} />
        </label>
        <label>
          <span className={label}>Budget</span>
          <select className={select} value={params.get("budget") ?? ""} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Any budget</option>
            {budgets.map((b) => (
              <option key={b} value={b}>Up to ₹{b.toLocaleString("en-IN")}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={label}>Service</span>
          <select className={select} value={params.get("service") ?? ""} onChange={(e) => set("service", e.target.value)}>
            <option value="">Photo (any)</option>
            <option value="video">Includes video</option>
            <option value="drone">Includes drone</option>
          </select>
        </label>
        <label>
          <span className={label}>Sort by</span>
          <select className={select} value={params.get("sort") ?? ""} onChange={(e) => set("sort", e.target.value)}>
            <option value="">Recommended</option>
            <option value="rating">Highest rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>
      {params.size > 0 && (
        <button onClick={() => router.replace(pathname)} className="text-sm font-semibold text-brand-600 hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${active ? "bg-ink text-white ring-ink" : "bg-white text-stone-700 ring-line hover:ring-stone-400"}`}
    >
      {children}
    </button>
  );
}
