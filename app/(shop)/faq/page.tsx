import type { Metadata } from "next";
import FAQContent from "./FAQContent";
import { getPublishedFaqsGrouped } from "@/actions/faq";

export const metadata: Metadata = {
  title: "FAQs — Shipping, Returns, Payments & Product Questions",
  description:
    "Answers to common questions about Treyfa's natural herbal products, shipping times, returns & refunds, and payment options including cards, UPI, net banking, and Cash on Delivery.",
  alternates: { canonical: "/faq" },
  keywords: ["treyfa faq", "treyfa shipping policy", "treyfa refund policy", "herbal products questions"],
};

export default async function FAQPage() {
  const faqs = await getPublishedFaqsGrouped();
  return <FAQContent faqs={faqs} />;
}
