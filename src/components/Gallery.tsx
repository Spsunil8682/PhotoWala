"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { img } from "@/lib/format";

type Item = { seed: string; caption: string };

export function Gallery({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((it, i) => (
          <button
            key={it.seed}
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-xl bg-stone-100 ${i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}
          >
            <Image
              src={img(it.seed, i === 0 ? 900 : 450, i === 0 ? 900 : 450)}
              alt={it.caption}
              fill
              sizes={i === 0 ? "(max-width: 640px) 100vw, 500px" : "(max-width: 640px) 50vw, 250px"}
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[open].caption}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <div className="relative h-[75vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={img(items[open].seed, 1400, 1000)} alt={items[open].caption} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="mt-4 text-sm text-white/80">
            {items[open].caption} · {open + 1}/{items.length}
          </p>
          <button className="absolute right-4 top-4 text-3xl text-white" aria-label="Close">×</button>
        </div>
      )}
    </>
  );
}
