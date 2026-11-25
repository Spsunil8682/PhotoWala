"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventCategory, Market } from "@/lib/types";

interface Props {
  markets: Market[];
  categories: EventCategory[];
  minDate: string;
  initial?: { city?: string; event?: string; date?: string };
  compact?: boolean;
}

export function SearchBar({ markets, categories, minDate, initial, compact }: Props) {
  const router = useRouter();
  const [city, setCity] = useState(initial?.city ?? "");
  const [event, setEvent] = useState(initial?.event ?? "");
  const [date, setDate] = useState(initial?.date ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (city) q.set("city", city);
    if (event) q.set("event", event);
    if (date) q.set("date", date);
    router.push(`/photographers?${q.toString()}`);
  }

  const field = "w-full bg-transparent text-sm font-medium text-ink outline-none";
  const label = "block text-[11px] font-semibold uppercase tracking-wide text-muted";

  return (
    <form
      onSubmit={submit}
      className={`grid gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-stone-900/10 ring-1 ring-line sm:grid-cols-[1fr_1fr_1fr_auto] ${compact ? "" : "sm:rounded-full"}`}
    >
      <label className="rounded-xl px-4 py-2 hover:bg-stone-50 sm:rounded-full">
        <span className={label}>Event</span>
        <select className={field} value={event} onChange={(e) => setEvent(e.target.value)}>
          <option value="">Any event</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="rounded-xl px-4 py-2 hover:bg-stone-50 sm:rounded-full">
        <span className={label}>City</span>
        <select className={field} value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {markets.map((m) => (
            <option key={m.slug} value={m.slug} disabled={m.status !== "active"}>
              {m.city}{m.status !== "active" ? " (coming soon)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="rounded-xl px-4 py-2 hover:bg-stone-50 sm:rounded-full">
        <span className={label}>Date</span>
        <input type="date" min={minDate} className={field} value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <button
        type="submit"
        className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 sm:rounded-full"
      >
        Search
      </button>
    </form>
  );
}
