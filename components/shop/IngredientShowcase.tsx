"use client";

import { motion } from "framer-motion";
import { TbLeaf, TbFlame, TbDroplet } from "react-icons/tb";

const ingredients = [
  {
    icon: TbLeaf,
    name: "Neem",
    latin: "Azadirachta indica",
    benefit: "Purifying & antibacterial properties that deeply cleanse pores and fight blemishes.",
  },
  {
    icon: TbFlame,
    name: "Turmeric",
    latin: "Curcuma longa",
    benefit: "Brightening & anti-inflammatory, evening skin tone and reducing visible redness.",
  },
  {
    icon: TbDroplet,
    name: "Coconut",
    latin: "Cocos nucifera",
    benefit: "Deep moisturizing & nourishing, restoring the skin's natural protective barrier.",
  },
];

export function IngredientShowcase() {
  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ background: "linear-gradient(145deg, #0a1f10 0%, #0d2b16 50%, #0a1a0c 100%)" }}>
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/30 mb-4">
            The Ingredients
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Nature&apos;s Finest,
            <br />
            <span className="italic font-light text-white/25">Perfected by Science</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {ingredients.map((ing, i) => {
            const Icon = ing.icon;
            return (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{
                    duration: 5 + i * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                  className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-7 md:p-8 lg:p-10 text-center group hover:border-white/16 hover:bg-white/[0.05] transition-colors duration-400"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center mb-5 md:mb-6">
                    <div className="w-14 h-14 rounded-xl bg-white/8 flex items-center justify-center group-hover:bg-white/12 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-white/70" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-1">{ing.name}</h3>
                  <p className="text-[11px] italic text-white/30 mb-4 md:mb-5 tracking-wide">{ing.latin}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{ing.benefit}</p>

                  {/* Bottom rule */}
                  <div className="mt-6 md:mt-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
