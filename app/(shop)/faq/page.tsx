"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const faqs = [
  {
    category: "Products",
    items: [
      {
        q: "Are Treyfa products 100% natural?",
        a: "Yes. All Treyfa products are formulated with natural and herbal ingredients inspired by South Indian Ayurvedic traditions. They are free from sulfates, parabens, and harmful synthetic chemicals.",
      },
      {
        q: "Are your products suitable for all skin and hair types?",
        a: "Most of our products are designed to be gentle and work across a range of skin and hair types. Each product page includes specific guidance. If you have a medical skin condition, please consult a dermatologist before use.",
      },
      {
        q: "Do Treyfa products have any side effects?",
        a: "Our products are crafted with clean, natural ingredients and are generally well-tolerated. However, as with any cosmetic product, individual reactions can vary. We recommend a patch test before full use.",
      },
      {
        q: "Are Treyfa products cruelty-free?",
        a: "Yes. Treyfa does not test on animals. We believe in ethical beauty practices alongside our commitment to natural formulations.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are processed within 2 business days of payment confirmation. Standard delivery takes 2–5 business days. Express shipping (3–4 business days) is available for an additional fee.",
      },
      {
        q: "Is there free shipping?",
        a: "Yes! We offer free shipping on all orders over ₹200. For orders below this amount, a standard shipping fee applies at checkout.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, you will receive a tracking link via email and SMS. You can use this link to monitor your delivery in real time.",
      },
      {
        q: "Do you deliver outside India?",
        a: "We currently ship across India. International shipping options are being explored — contact us at info@treyfa.in for more information on international orders.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a hassle-free refund policy. Refund requests must be made within 3 days of receiving your order. The product must be returned in its original packaging and unused condition.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at support@treyfa.in or call +91 89034 12061 within 3 days of delivery. Our team will guide you through the return process. Return shipping is at the customer's expense.",
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and verify the returned product, your full refund will be processed within 2 business days to your original payment method.",
      },
      {
        q: "Can I return an opened product?",
        a: "For hygiene reasons, opened or used products are not eligible for returns unless the product is defective or damaged on arrival.",
      },
    ],
  },
  {
    category: "Account & Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), UPI, Net Banking, and Razorpay-powered payment options.",
      },
      {
        q: "Is it safe to enter my payment details?",
        a: "Absolutely. All transactions are processed through our secure payment gateway (Razorpay), which uses industry-standard encryption to protect your financial information.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "You can browse and explore our products without an account. However, creating an account allows you to track orders, manage your wishlist, and enjoy a faster checkout experience.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium leading-snug">{q}</span>
        <span className="flex-shrink-0 h-6 w-6 rounded-full border border-border flex items-center justify-center">
          {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed pb-4 pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0c1a0f]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-green-400 mb-4">
            Help Center
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Everything you need to know about Treyfa products, orders, and policies.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
        <div className="space-y-12">
          {faqs.map(({ category, items }) => (
            <AnimatedSection key={category}>
              <h2 className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 pb-3 border-b border-border">
                {category}
              </h2>
              <div>
                {items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Still have questions */}
        <AnimatedSection className="mt-16 rounded-2xl bg-secondary/40 border border-border p-8 text-center">
          <h3 className="font-semibold text-lg mb-2">Still have a question?</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Our support team is available Mon–Sat, 10AM–6PM.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:support@treyfa.in"
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              support@treyfa.in
            </a>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
