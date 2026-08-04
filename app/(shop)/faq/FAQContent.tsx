"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";

type FaqGroup = {
  category: string;
  items: { q: string; a: string }[];
};

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

export default function FAQContent({ faqs }: { faqs: FaqGroup[] }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap(({ items }) =>
      items.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      }))
    ),
  };

  return (
    <PageTransition>
      <JsonLd data={faqJsonLd} />
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
              href="mailto:treyfaacc@gmail.com"
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              treyfaacc@gmail.com
            </a>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
