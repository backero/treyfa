import type { Metadata } from "next";
import FAQContent from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQs — Shipping, Returns, Payments & Product Questions",
  description:
    "Answers to common questions about Treyfa's natural herbal products, shipping times, returns & refunds, and payment options including UPI and Cash on Delivery.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return <FAQContent />;
}
