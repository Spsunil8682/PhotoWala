import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cancellation & refund policy" };

// DRAFT policy for the demo — have it reviewed before taking real payments.
const slabs = [
  { when: "More than 7 days before the event", refund: "100% of advance" },
  { when: "3–7 days before the event", refund: "50% of advance" },
  { when: "Less than 72 hours before the event", refund: "No refund" },
];

export default function CancellationPolicy() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
        Draft policy for the demo. Final terms to be reviewed before launch.
      </p>
      <h1 className="mt-6 font-display text-4xl font-semibold">Cancellation &amp; refund policy</h1>

      <h2 className="mt-8 text-xl font-semibold">If you cancel</h2>
      <table className="mt-4 w-full overflow-hidden rounded-2xl bg-white text-sm ring-1 ring-line">
        <thead className="bg-stone-50 text-left">
          <tr><th className="p-3">When you cancel</th><th className="p-3">Refund</th></tr>
        </thead>
        <tbody>
          {slabs.map((s) => (
            <tr key={s.when} className="border-t border-line"><td className="p-3">{s.when}</td><td className="p-3 font-medium">{s.refund}</td></tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8 text-xl font-semibold">If the photographer cancels or doesn&apos;t arrive</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-700">
        <li>We try to arrange a replacement with an equal or better rating, at no extra cost.</li>
        <li>If you don&apos;t accept the replacement, you get a 100% refund of everything paid.</li>
        <li>If the photographer arrives more than 30 minutes late, the missed time is added at the end or refunded pro-rata.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Rescheduling</h2>
      <p className="mt-3 text-stone-700">One free reschedule up to 72 hours before the event, subject to the photographer&apos;s availability.</p>

      <h2 className="mt-8 text-xl font-semibold">Delivery issues</h2>
      <p className="mt-3 text-stone-700">
        If edited photos aren&apos;t delivered by the date written in your package, contact us. You can raise an issue within 3 days of delivery if the deliverables don&apos;t match the package.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Refund timeline</h2>
      <p className="mt-3 text-stone-700">Approved refunds go back to the original payment method within 5–7 working days.</p>
    </article>
  );
}
