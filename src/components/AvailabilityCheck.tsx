"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";

export function AvailabilityCheck({
  blockedDates,
  minDate,
  initialDate,
  onChange,
}: {
  blockedDates: string[];
  minDate: string;
  initialDate?: string;
  onChange?: (date: string, available: boolean) => void;
}) {
  const [date, setDate] = useState(initialDate ?? "");
  const available = date ? !blockedDates.includes(date) : null;

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="avail-date">
        Check your date
      </label>
      <input
        id="avail-date"
        type="date"
        min={minDate}
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          onChange?.(e.target.value, !blockedDates.includes(e.target.value));
        }}
        className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
      />
      {available === true && (
        <p className="mt-2 text-sm font-medium text-emerald-700">● Available on {formatDate(date)}</p>
      )}
      {available === false && (
        <p className="mt-2 text-sm font-medium text-red-600">● Already booked on {formatDate(date)}. Try another date.</p>
      )}
    </div>
  );
}
