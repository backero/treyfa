import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  Leaf,
  ShieldBan,
  FlaskConical,
  Microscope,
  ClipboardCheck,
  BarChart3,
  MapPin,
  Factory,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Treyfa is Backero Private Limited's flagship clean beauty brand — 100% naturally derived, lab-validated personal care, free from parabens, sulfates, and synthetic chemicals.",
  alternates: { canonical: "/about" },
};

const cleanBeautyStandard = [
  { title: "Zero Parabens", desc: "No methyl-, ethyl-, propyl-, or butylparabens — linked to hormone disruption." },
  { title: "Zero Sulfates", desc: "No SLS / SLES — known irritants that cause scalp and skin sensitisation." },
  { title: "Zero Phthalates", desc: "No DEP, DBP, or DEHP — endocrine disruptors found in synthetic fragrances." },
  { title: "Zero Synthetic Colours", desc: "No petroleum-derived FD&C or D&C dyes." },
  { title: "Zero Formaldehyde Donors", desc: "No DMDM hydantoin, quaternium-15, or related preservatives." },
  { title: "Zero Mineral Oils", desc: "No petrolatum or paraffin — occlusive agents derived from crude petroleum." },
  { title: "Zero Artificial Fragrances", desc: "No synthetic perfume compounds — a major allergen and sensitiser source." },
  { title: "100% Naturally Derived", desc: "Every functional ingredient sourced from botanical, mineral, or bio-derived origins." },
];

const rndStages = [
  {
    icon: Microscope,
    title: "Ingredient Selection",
    desc: "Evidence-based botanical selection with toxicological screening against INCI and IARC guidelines.",
  },
  {
    icon: FlaskConical,
    title: "Formulation & Stability",
    desc: "Laboratory-scale formulation, refined through iterative testing and accelerated stability trials.",
  },
  {
    icon: ClipboardCheck,
    title: "Safety Assessment",
    desc: "Patch testing, skin compatibility, and irritancy evaluation before any product moves forward.",
  },
  {
    icon: BarChart3,
    title: "Performance Benchmarking",
    desc: "Every formula is benchmarked side-by-side against leading synthetic counterparts before it can launch.",
  },
];

const timeline = [
  { year: "2021", event: "Treyfa launches as Backero Private Limited's flagship clean beauty brand — a digital-first, direct-to-consumer herbal care line." },
  { year: "2022", event: "Expands from pure D2C into omni-channel retail, building distributor relationships across South India." },
  { year: "2024", event: "Scales nationally with 44+ products spanning Hair Care, Face Care, and Bath & Body." },
  { year: "2026", event: "Consolidating the range with certified formulations and a dermatologist advisory panel — same commitment to purity, backed by science." },
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
              India&apos;s First
              <span className="block italic font-light text-white/35">Cancer-Free Cosmetics</span>
            </h1>
            <p className="text-white/55 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              Treyfa is Backero Private Limited&apos;s flagship clean beauty brand — built on one
              conviction: Indian consumers deserve daily personal care that is both safe and
              effective, without toxic trade-offs.
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
                Clean Beauty,
                <span className="block italic font-light text-foreground/40">Backed by Science</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                Launched in 2021, Treyfa is the commercial cornerstone of Backero Private
                Limited&apos;s clean beauty mission — headquartered in Dindigul with manufacturing
                in Coimbatore, Tamil Nadu. Every formula is 100% naturally derived and validated
                through our in-house R&amp;D process, not just labelled &quot;natural.&quot;
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Our mission: to make toxin-free, cancer-free personal care accessible, credible,
                and high-performing for every Indian consumer — proving that &quot;natural&quot; and
                &quot;effective&quot; are never mutually exclusive.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { value: "44+", label: "Products" },
                { value: "2021", label: "Founded" },
                { value: "100%", label: "Naturally Derived" },
                { value: "8", label: "Zero-Compromise Pledges" },
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

        {/* Clean Beauty Standard */}
        <AnimatedSection className="py-14 md:py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
                No-Compromise Ingredient Policy
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold">The Treyfa Clean Beauty Standard</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
              {cleanBeautyStandard.map(({ title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-background p-5 md:p-6"
                >
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    {title === "100% Naturally Derived" ? (
                      <Leaf className="h-5 w-5" />
                    ) : (
                      <ShieldBan className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* R&D Process */}
        <AnimatedSection className="py-14 md:py-20 container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
              Formulation Science
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">Validated In-House, Not Just Labelled Natural</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto mb-10">
            {rndStages.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-secondary/30 p-5 md:p-6">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm italic text-muted-foreground max-w-2xl mx-auto">
            &quot;If a Treyfa formulation cannot outperform its synthetic equivalent in lab
            conditions, it does not go to market. We never compromise on efficacy in the name of
            naturalness.&quot; — Backero R&amp;D Team
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection className="py-14 md:py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10 md:mb-14">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
                  Our Journey
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold">How It Started</h2>
              </div>
              <div className="relative pl-6 sm:pl-0">
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
          </div>
        </AnimatedSection>

        {/* Location */}
        <AnimatedSection className="py-14 md:py-20 container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-4">
              <MapPin className="h-4 w-4" />
              Headquarters
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Dindigul, Tamil Nadu</h2>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              A brand by Backero Private Limited
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-4">
              <Factory className="h-4 w-4" />
              Manufacturing &amp; Operations
            </div>
            <p className="text-muted-foreground mb-1 text-sm md:text-base">
              42, Interflex Complex, Trichy Road, Near RVS College of Arts &amp; Science,
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
