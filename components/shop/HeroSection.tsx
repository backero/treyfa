"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ranked by Flipkart reviews & ratings
const slides = [
  {
    src:    "/hero-neem.png",
    alt:    "Neem Anti-Dandruff Shampoo & Conditioner",
    label:  "Neem Anti-Dandruff",
    sub:    "Shampoo & Conditioner",
    rating: "4.1★",
    reviews: "91 reviews",
    orb1:   "bg-green-300/40",
    orb2:   "bg-emerald-200/30",
    glow:   "from-green-400/50 via-emerald-300/60 to-green-400/50",
    halo:   "from-green-200/30 via-green-100/20 to-transparent",
    dot:    "#16a34a",
    accent: "#15803d",
  },
  {
    src:    "/hero-henna.png",
    alt:    "Coconut Henna Black Hair Oil",
    label:  "Henna Black",
    sub:    "Coconut Hair Oil",
    rating: "4.2★",
    reviews: "73 reviews",
    orb1:   "bg-amber-900/25",
    orb2:   "bg-orange-200/20",
    glow:   "from-amber-800/40 via-orange-700/50 to-amber-800/40",
    halo:   "from-amber-900/20 via-orange-800/15 to-transparent",
    dot:    "#92400e",
    accent: "#78350f",
  },
  {
    src:    "/hero-hibiscus-shampoo.png",
    alt:    "Hibiscus Shikakai Shampoo",
    label:  "Hibiscus Shikakai",
    sub:    "Shampoo",
    rating: "4.3★",
    reviews: "41 reviews",
    orb1:   "bg-rose-300/30",
    orb2:   "bg-red-200/25",
    glow:   "from-rose-400/45 via-red-300/55 to-rose-400/45",
    halo:   "from-rose-200/30 via-red-100/20 to-transparent",
    dot:    "#e11d48",
    accent: "#be123c",
  },
  {
    src:    "/hero-vetiver.png",
    alt:    "Coconut Vetiver Hair & Body Oil",
    label:  "Virgin Vetiver",
    sub:    "Hair & Body Oil",
    rating: "4.8★",
    reviews: "36 reviews",
    orb1:   "bg-yellow-200/35",
    orb2:   "bg-amber-100/25",
    glow:   "from-yellow-500/40 via-amber-400/50 to-yellow-500/40",
    halo:   "from-yellow-200/30 via-amber-100/20 to-transparent",
    dot:    "#ca8a04",
    accent: "#a16207",
  },
  {
    src:    "/hero-basil.png",
    alt:    "Coconut Basil Heaven Heal Oil",
    label:  "Basil Heaven",
    sub:    "Heal Oil",
    rating: "4.9★",
    reviews: "27 reviews",
    orb1:   "bg-lime-300/30",
    orb2:   "bg-green-200/25",
    glow:   "from-lime-500/40 via-green-400/50 to-lime-500/40",
    halo:   "from-lime-200/25 via-green-100/15 to-transparent",
    dot:    "#4d7c0f",
    accent: "#3f6212",
  },
];

export function HeroSection() {
  const sectionRef     = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        gsap.to(".hero-product-wrap", {
          yPercent: 10, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col lg:flex-row items-stretch overflow-hidden grain"
      style={{ background: "#f8f9f6" }}
    >
      {/* ── Ambient orbs ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className={`absolute -top-32 -left-24 w-[380px] h-[380px] md:w-[560px] md:h-[560px] rounded-full ${slide.orb1} blur-[110px]`} />
          <div className={`absolute -bottom-16 right-0 w-[300px] h-[300px] md:w-[460px] md:h-[460px] rounded-full ${slide.orb2} blur-[90px]`} />
        </motion.div>
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          LEFT — Text
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-center flex-col justify-center w-full lg:w-[50%] px-6 sm:px-10 lg:px-10 xl:px-14 pt-28 pb-8 lg:pt-24 lg:pb-24">

        {/* Label — accent coloured */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-[10px] md:text-[11px] uppercase tracking-[0.45em] mb-5 md:mb-7 font-medium transition-colors duration-700"
          style={{ color: slide.accent }}
        >
          Pure · Natural · Effective
        </motion.p>

        {/* Headline */}
        <div className="mb-5 md:mb-7">
          {["Natural &", "Herbal", "Beauty"].map((word, i) => (
            <motion.h1
              key={word}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`text-[clamp(38px,6.5vw,84px)] leading-[1.05] font-bold ${
                i === 1 ? "text-gray-900" : "text-gray-900"
              }`}
            >
              {word}
            </motion.h1>
          ))}
        </div>

        {/* Slide sub-label + live rating */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`lbl-${current}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 mb-7 md:mb-9"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
              {slide.label} · {slide.sub}
            </p>
            <span className="h-3 w-px bg-gray-200" />
            <p className="text-[10px] text-gray-400">
              <span className="text-amber-500 font-medium">{slide.rating}</span>
              {" "}· {slide.reviews}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.6 }}
          className="flex gap-3 mb-9 md:mb-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 rounded-full hover:bg-gray-700 transition-colors"
          >
            Shop Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium px-6 sm:px-7 py-3 rounded-full hover:bg-gray-50 hover:border-gray-500 transition-all shadow-sm"
          >
            Our Story
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.75 }}
          className="flex items-center gap-7 md:gap-10"
        >
          {[
            { value: "500+", label: "Reviews"   },
            { value: "100%", label: "Natural"   },
            { value: "4.8★", label: "Avg Rating" },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-7 md:gap-10">
              {i > 0 && <div className="w-px h-7 bg-gray-200" />}
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT — Product
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[50%] pb-14 lg:pt-24 lg:pb-24 hero-product-wrap">

        {/* Halo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`halo-${current}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className={`absolute w-[300px] h-[300px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-br ${slide.halo} blur-3xl`}
          />
        </AnimatePresence>

        {/* Image */}
        <div className="relative h-[300px] sm:h-[360px] md:h-[420px] lg:h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current}`}
              initial={{ opacity: 0, scale: 0.93, y: 14 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 1.05,  y: -12 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full flex items-end justify-center"
            >
              {/* Ground glow */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 md:w-48 md:h-12 bg-gradient-to-r ${slide.glow} blur-2xl rounded-full`} />

              <motion.div
                animate={prefersReduced ? {} : { y: [-8, 8, -8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={300}
                  height={520}
                  className="h-full w-auto object-contain drop-shadow-[0_20px_44px_rgba(0,0,0,0.12)]"
                  priority={current === 0}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-7">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to ${s.label}`}
              className="p-1"
            >
              <motion.span
                animate={{
                  width:           i === current ? 22 : 7,
                  backgroundColor: i === current ? slide.dot : "#d1d5db",
                  opacity:         i === current ? 1 : 0.55,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block h-[6px] rounded-full"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
