"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

const cases = [
  {
    id: "dandruff",
    label: "Dandruff Control",
    product: "Neem Anti-Dandruff Shampoo",
    beforeLabel: "Flaky Scalp",
    afterLabel: "Clean & Clear",
    before: "/before-after/dandruff_before.png",
    after: "/before-after/dandruff_after.png",
    desc: "Neem's antibacterial properties eliminate dandruff-causing fungi, restoring scalp health in weeks.",
  },
  {
    id: "brightening",
    label: "Skin Brightening",
    product: "Turmeric Foaming Face Wash",
    beforeLabel: "Dull Skin",
    afterLabel: "Radiant Glow",
    before: "/before-after/brightening_before.png",
    after: "/before-after/brightening_after.png",
    desc: "Turmeric's curcumin brightens and evens skin tone, reducing dark spots and inflammation.",
  },
  {
    id: "hair",
    label: "Hair Nourishment",
    product: "Pure Virgin Vetiver Coconut Oil",
    beforeLabel: "Dry & Frizzy",
    afterLabel: "Glossy & Strong",
    before: "/before-after/hair_before.png",
    after: "/before-after/hair_after.png",
    desc: "Virgin Coconut Oil penetrates the hair shaft deeply, restoring moisture and natural shine.",
  },
  {
    id: "acne",
    label: "Acne Relief",
    product: "Neem Face Wash",
    beforeLabel: "Breakout Prone",
    afterLabel: "Smooth & Clear",
    before: "/before-after/acne_before.png",
    after: "/before-after/acne_after.png",
    desc: "Neem extract purifies pores and fights acne-causing bacteria without stripping natural oils.",
  },
];

function Slider({
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(
      2,
      Math.min(98, ((clientX - rect.left) / rect.width) * 100),
    );
    setPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(x);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePos]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize"
      onMouseDown={(e) => {
        setDragging(true);
        updatePos(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        updatePos(e.touches[0].clientX);
      }}
    >
      {/* After (right side — full) */}
      <Image
        src={after}
        alt="After"
        fill
        className="object-cover"
        sizes="(max-width:768px) 100vw, 60vw"
      />

      {/* Before (left side — clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before}
          alt="Before"
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 60vw"
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white shadow-xl flex items-center justify-center">
          <ChevronsLeftRight className="h-4 w-4 text-foreground/70" />
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1 uppercase tracking-wider">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm text-black text-[10px] font-medium px-3 py-1 uppercase tracking-wider">
        {afterLabel}
      </span>
    </div>
  );
}

export function BeforeAfterSection() {
  const [active, setActive] = useState(0);
  const current = cases[active];

  return (
    <section className="py-16 md:py-24 container mx-auto px-4">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10 md:mb-12"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
          Skin Solutions
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">Before &amp; After</h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
          Drag the slider to see real results. Natural ingredients, visible
          transformation.
        </p>
      </motion.div>

      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10 px-2">
        {cases.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActive(i)}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
              active === i
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Slider + info */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
        {/* Slider */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Slider
                before={current.before}
                after={current.after}
                beforeLabel={current.beforeLabel}
                afterLabel={current.afterLabel}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-info"}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 space-y-5"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
                {current.label}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                {current.product}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {current.desc}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "2 Weeks", l: "Visible Results" },
                { v: "100%", l: "Natural Formula" },
              ].map(({ v, l }) => (
                <div key={l} className="rounded-xl bg-secondary/50 p-3 sm:p-4">
                  <p className="text-xl sm:text-2xl font-bold">{v}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                    {l}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors"
            >
              Shop {current.label} →
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
