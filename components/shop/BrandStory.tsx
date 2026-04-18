"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const storyWords = [
  { text: "Ancient", italic: false },
  { text: "wisdom,", italic: true },
  { text: "modern", italic: false },
  { text: "science,", italic: true },
  { text: "pure", italic: false },
  { text: "results.", italic: true },
];

export function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 container mx-auto px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8"
        >
          Our Story
        </motion.p>

        {/* Word-by-word reveal */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-10">
          {storyWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={word.italic ? "italic font-light text-foreground/30" : ""}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* Body text with parallax */}
        <motion.div style={{ y }}>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base md:text-lg"
          >
            Born from generations of Ayurvedic knowledge, Treyfa bridges the gap between
            traditional herbal remedies and contemporary skincare innovation. Each product
            is a careful blend of time-tested botanical wisdom and rigorous modern formulation.
          </motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="mt-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    </section>
  );
}
