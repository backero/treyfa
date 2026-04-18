import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Leaf, Heart, Shield, Sparkles, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Treyfa — India's natural & herbal beauty brand rooted in South Indian herbal traditions.",
};

const values = [
  {
    icon: Leaf,
    title: "Pure Herbal Ingredients",
    desc: "Every product is formulated with time-tested botanicals — Turmeric, Neem, Coconut, Hibiscus, and more — straight from nature.",
  },
  {
    icon: Shield,
    title: "Chemical-Free Promise",
    desc: "We are committed to clean beauty. Our formulas are free from sulfates, parabens, and harmful additives.",
  },
  {
    icon: Heart,
    title: "Self-Love Philosophy",
    desc: "This is not just skincare. It's self-love. We believe true beauty comes from nourishing yourself with what nature intended.",
  },
  {
    icon: Sparkles,
    title: "Traditionally Inspired",
    desc: "Rooted in South Indian herbal remedies passed down through generations, reimagined for modern daily care.",
  },
];

const timeline = [
  { year: "2023", event: "Treyfa is founded in Coimbatore with a simple belief: herbal care should be accessible to everyone." },
  { year: "2024", event: "Launched our signature Neem and Turmeric ranges, gaining a loyal customer base across South India." },
  { year: "2025", event: "Expanded to 46+ products across Hair Care, Face Care, and Bath & Body, shipping pan-India." },
  { year: "2026", event: "Building the next chapter — more formulas, more reach, same commitment to purity." },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div>
        {/* Hero */}
        <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 bg-[#0c1a0f] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-green-500/15 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full bg-yellow-400/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="text-[10px] uppercase tracking-[0.45em] text-green-400 mb-4">Our Story</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 md:mb-6">
              Rooted in Nature,
              <span className="block italic font-light text-white/35">Crafted with Care</span>
            </h1>
            <p className="text-white/55 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              Treyfa is India&apos;s natural and herbal beauty brand — founded in Coimbatore
              with the belief that the best skincare and haircare ingredients grow in the earth,
              not in a lab.
            </p>
          </div>
        </section>

        {/* Mission */}
        <AnimatedSection className="py-14 md:py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
                Who We Are
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-5 md:mb-6">
                Natural & Herbal
                <span className="block italic font-light text-foreground/40">Beauty Essentials</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                At Treyfa, we are passionate about harnessing the power of South Indian herbal
                traditions. From the antibacterial properties of Neem to the brightening power
                of Turmeric and the deep nourishment of Virgin Coconut Oil — each product is
                a bridge between ancient wisdom and modern skincare science.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We believe &quot;this is not just skincare — it&apos;s self-love.&quot; When you choose
                Treyfa, you choose transparency, purity, and a commitment to your long-term
                skin and hair health.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { value: "46+", label: "Products" },
                { value: "10K+", label: "Happy Customers" },
                { value: "100%", label: "Natural Ingredients" },
                { value: "5★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-secondary/30 p-4 sm:p-5 md:p-6 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-bold mb-1">{value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection className="py-14 md:py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
                What We Stand For
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-background p-5 md:p-6"
                >
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection className="py-14 md:py-20 container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
                Our Journey
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold">How It Started</h2>
            </div>
            <div className="relative pl-6 sm:pl-0">
              {/* Vertical line — positioned relative to year column on sm+ */}
              <div className="absolute left-0 sm:left-14 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-8 md:space-y-10">
                {timeline.map(({ year, event }) => (
                  <div key={year} className="flex gap-5 sm:gap-8 items-start">
                    <div className="w-10 sm:w-14 flex-shrink-0 text-right hidden sm:block">
                      <span className="text-sm font-bold">{year}</span>
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute -left-[25px] sm:-left-[25px] top-1.5 h-3 w-3 rounded-full bg-foreground ring-4 ring-background" />
                      <span className="text-xs font-bold text-muted-foreground sm:hidden mb-1 block">{year}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Location */}
        <AnimatedSection className="py-14 md:py-20 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-4">
              <MapPin className="h-4 w-4" />
              Find Us
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Based in Coimbatore</h2>
            <p className="text-muted-foreground mb-2 text-sm md:text-base">
              42, Interflex Complex, Trichy Road, Near RVS College of Arts & Science,
            </p>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">Sulur, Coimbatore — 641402, Tamil Nadu, India</p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
