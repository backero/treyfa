import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Herbal beauty tips, hair care guides, and skincare insights from the Treyfa team.",
};

const posts = [
  {
    title: "How to Stop Hair Fall Naturally Using Curry Leaves Oil",
    excerpt: "Discover how the ancient remedy of curry leaves oil can strengthen your roots, reduce breakage, and promote thick, healthy hair growth.",
    date: "April 2, 2026",
    category: "Hair Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "Neem Oil vs Neem Shampoo – Which is Best for Dandruff?",
    excerpt: "We break down the differences between neem oil and neem-based shampoo, and which one works better for your scalp condition.",
    date: "April 2, 2026",
    category: "Hair Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "Why Virgin Coconut Oil Is a Simple Choice for Everyday Hair & Skin Care",
    excerpt: "Pure Virgin Coconut Oil is one of nature's most versatile ingredients. Learn how to use it for both hair and skin as part of your daily routine.",
    date: "December 31, 2025",
    category: "Skin Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "How Neem Anti-Dandruff Oil Supports Daily Scalp Care",
    excerpt: "A consistent scalp routine matters more than occasional treatments. Here's how to integrate Neem oil into your daily regimen for long-term results.",
    date: "December 31, 2025",
    category: "Hair Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "How Turmeric Foaming Face Wash Supports Daily Acne Control",
    excerpt: "Turmeric's anti-inflammatory properties make it a powerhouse ingredient for acne-prone skin. Learn how our foaming formula targets breakouts gently.",
    date: "December 17, 2025",
    category: "Skin Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "Why Dandruff Keeps Coming Back — And How Neem-Based Shampoo Can Help",
    excerpt: "Recurring dandruff is more than a cosmetic issue. Understand the root causes and how consistent use of neem shampoo addresses them at the source.",
    date: "December 17, 2025",
    category: "Hair Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "Curry Leaves Hair Oil – Your Herbal Solution for Strong & Shiny Hair",
    excerpt: "Packed with amino acids, antioxidants, and proteins, curry leaves oil is one of the best-kept secrets for strong, shiny, naturally healthy hair.",
    date: "December 29, 2025",
    category: "Hair Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "Choco Coffee Face Wash: Benefits, Usage & Who Should Use It",
    excerpt: "Our Choco Coffee Face Wash is more than a novelty — the combination of antioxidants from cocoa and caffeine from coffee makes it a serious skincare tool.",
    date: "December 17, 2025",
    category: "Skin Care",
    href: "https://treyfa.in/blogs/news",
  },
  {
    title: "Why Stressed Hair Needs a Calming Hibiscus Chamomile Oil Routine",
    excerpt: "Hibiscus and Chamomile are nature's most soothing botanicals. Learn why this combination is ideal for hair that's been damaged by heat, chemicals, or stress.",
    date: "December 17, 2025",
    category: "Hair Care",
    href: "https://treyfa.in/blogs/news",
  },
];

const categories = ["All", "Hair Care", "Skin Care"];

export default function BlogPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0c1a0f]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-green-400 mb-4">
            Knowledge & Tips
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">The Treyfa Journal</h1>
          <p className="text-white/50 max-w-md mx-auto">
            Herbal beauty guides, ingredient deep-dives, and expert tips for your skin and hair.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Category filter — cosmetic only, no router state for static page */}
        <AnimatedSection className="flex gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                cat === "All"
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </span>
          ))}
        </AnimatedSection>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <AnimatedSection key={post.title} delay={i * 0.05}>
              <Link
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-2xl border border-border bg-background overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Color band by category */}
                <div
                  className={`h-1.5 w-full ${
                    post.category === "Hair Care" ? "bg-green-600" : "bg-yellow-500"
                  }`}
                />
                <div className="p-6 flex flex-col gap-3 h-full">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[10px] text-muted-foreground">{post.date}</span>
                  </div>

                  <h2 className="font-semibold text-sm leading-snug group-hover:text-foreground/70 transition-colors flex-1">
                    {post.title}
                  </h2>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-medium pt-1">
                    Read on Treyfa.in
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
