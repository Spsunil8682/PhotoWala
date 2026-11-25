import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-5xl">📷</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">This page is out of frame</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist, or this city isn&apos;t live yet.</p>
      <Link href="/photographers" className="mt-6 inline-flex rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white">Find photographers</Link>
    </div>
  );
}
