import type { Metadata } from "next";
import { BookingSuccess } from "@/components/BookingSuccess";

export const metadata: Metadata = { title: "Request sent", robots: { index: false } };

export default async function SuccessPage({ searchParams }: PageProps<"/book/success">) {
  const ref = (await searchParams).ref;
  return <BookingSuccess refId={typeof ref === "string" ? ref : undefined} />;
}
