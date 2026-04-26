"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Trophy, Star, MessageCircle } from "lucide-react";

const awards = [
  {
    icon: Trophy,
    year: "2024",
    badge: "Safety & Trust",
    title: "India's Most Trusted & Safest Cosmetics Brand",
    recipient: "Surya Raj B",
    role: "Managing Director",
    description:
      "Recognized for setting new benchmarks in consumer safety and product integrity. Treyfa's commitment to non-toxic, scientifically validated formulations has earned it the distinction of being one of India's most trusted names in personal care.",
    accentFrom: "#fbbf24",
    accentTo: "#d97706",
  },
  {
    icon: Star,
    year: "2025",
    badge: "Industry Excellence",
    title: "Vetri Nayagigal Virudhugal 2025 — Excellence in Cosmetics Industry",
    recipient: "Dr. Parimala Gnana Soundari",
    role: "Founder",
    description:
      "Honored with the prestigious 'Successful Women Awards 2025' for outstanding leadership and innovation in the cosmetics sector — celebrating visionary approach in steering Treyfa towards sustainable growth.",
    accentFrom: "#a78bfa",
    accentTo: "#7c3aed",
  },
];

export function AwardsSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Awards &amp; Accolades
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Our commitment to excellence and safety has been recognized by industry leaders and institutions.
          </p>
        </motion.div>

        {/* Award cards */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {awards.map((award, i) => {
            const Icon = award.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col"
              >
                <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
                  {/* Year & badge row */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-bold">
                      <Icon className="w-3 h-3" style={{ color: award.accentFrom }} />
                      {award.year}
                    </span>
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                      style={{
                        background: `linear-gradient(135deg, ${award.accentFrom}22, ${award.accentTo}22)`,
                        borderColor: `${award.accentFrom}44`,
                        color: award.accentFrom,
                      }}
                    >
                      {award.badge}
                    </span>
                  </div>

                  {/* Accent line */}
                  <div
                    className="h-0.5 w-10 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${award.accentFrom}, ${award.accentTo})`,
                    }}
                  />

                  <h3 className="text-base md:text-lg font-bold leading-snug tracking-tight">
                    {award.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {award.description}
                  </p>

                  {/* Recipient row */}
                  <div className="pt-3 border-t border-border/60 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${award.accentFrom}18` }}
                    >
                      <Award
                        className="w-4 h-4"
                        style={{ color: award.accentFrom }}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Honored Recipient
                      </p>
                      <p className="text-sm font-semibold">
                        {award.recipient}{" "}
                        <span className="text-muted-foreground font-normal">
                          · {award.role}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* WhatsApp Campaign QR */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm"
        >
          {/* QR code */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="w-40 h-40 md:w-48 md:h-48 relative rounded-xl overflow-hidden border border-border shadow-md bg-white p-2">
              <Image
                src="/whatsapp-qr.jpeg"
                alt="Scan to chat with Treyfa on WhatsApp"
                fill
                className="object-contain"
                sizes="192px"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#25D366]">
              <MessageCircle className="w-3.5 h-3.5" />
              Scan to chat
            </span>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground">
              Connect with us
            </p>
            <h3 className="text-2xl md:text-3xl font-bold leading-snug">
              Chat with Treyfa on WhatsApp
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Have questions about our products or need personalized skincare advice? Scan the QR code to start a conversation with our team directly on WhatsApp.
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 self-center md:self-start px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#25D366" }}
            >
              <MessageCircle className="w-4 h-4" />
              Open WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
