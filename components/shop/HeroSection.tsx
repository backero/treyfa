"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const productRef  = useRef<HTMLDivElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        gsap.to(productRef.current, {
          yPercent: 18,
          scale: 0.88,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
        gsap.to(bgRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[580px] md:min-h-[680px] flex flex-col items-center justify-between pt-20 pb-8 sm:pt-24 sm:pb-10 md:pt-28 md:pb-10 overflow-hidden grain"
      style={{ background: "linear-gradient(160deg,#0a1a0c 0%,#0d1a0f 55%,#0c1207 100%)" }}
    >
      {/* ── Ambient orbs ──────────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-[15%] w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[520px] md:h-[520px] rounded-full bg-green-600/14 blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-0 right-[10%] w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-yellow-400/10 blur-[60px] md:blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full bg-green-900/20 blur-[80px] md:blur-[120px]" />
      </div>

      {/* ── Top label ─────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-green-400/70 mb-4 md:mb-8"
      >
        Pure · Natural · Effective
      </motion.p>

      {/* ── Display headline ──────────────────────────────── */}
      <div className="relative z-10 text-center px-4 mb-6 md:mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(36px,9vw,100px)] leading-[1.05] font-bold text-white"
        >
          Natural &amp;
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(36px,9vw,100px)] leading-[1.05] font-bold text-white/30"
        >
          Herbal
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(36px,9vw,100px)] leading-[1.05] font-bold text-white"
        >
          Beauty
        </motion.h1>
      </div>

      {/* ── Product image — floating over text ────────────── */}
      <div ref={productRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glow beneath bottle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-12 md:w-40 md:h-16 bg-green-400/20 blur-2xl rounded-full" />

          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/neem-product.png"
              alt="Treyfa Neem Shampoo & Conditioner"
              width={160}
              height={250}
              className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] w-[140px] h-auto sm:w-[180px] md:w-[240px] lg:w-[280px]"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom row — CTA + stats ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        className="relative z-30 flex flex-col items-center gap-5 md:gap-6"
      >
        <div className="flex gap-2 sm:gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-black text-xs sm:text-sm font-semibold px-5 sm:px-7 py-2.5 sm:py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            Shop Now <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-white/20 text-white/70 text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3 rounded-full hover:border-white/40 hover:text-white transition-all"
          >
            Our Story
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
          {[
            { value: "10K+",  label: "Customers" },
            { value: "100%",  label: "Natural" },
            { value: "4.9★",  label: "Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className=" text-xl sm:text-2xl md:text-3xl font-semibold text-white">{value}</p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/35 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-white/20 hidden md:flex"
      >
        <span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 0], y: [0, 8, 8] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ originY: 0 }}
          className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>
    </section>
  );
}
