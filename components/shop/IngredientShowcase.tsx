"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

const ingredients = [
  {
    name: "Neem",
    latin: "Azadirachta indica",
    imageSrc: "https://images.unsplash.com/photo-1687945906634-25c66199d941?w=400&q=85&fit=crop",
    benefits: [
      "Kills acne-causing bacteria naturally",
      "Reduces excess sebum & unclogs pores",
      "Soothes redness and skin irritation",
      "Antifungal protection for scalp health",
    ],
  },
  {
    name: "Turmeric",
    latin: "Curcuma longa",
    imageSrc: "https://plus.unsplash.com/premium_photo-1726862790171-0d6208559224?w=400&q=85&fit=crop",
    benefits: [
      "Visibly brightens and evens skin tone",
      "Fades dark spots & hyperpigmentation",
      "Powerful anti-inflammatory action",
      "Stimulates natural collagen production",
    ],
  },
  {
    name: "Coconut",
    latin: "Cocos nucifera",
    imageSrc: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=400&q=85&fit=crop",
    benefits: [
      "Deep moisturisation without heaviness",
      "Strengthens hair from root to tip",
      "Restores the skin's protective barrier",
      "Rich in lauric acid & essential fatty acids",
    ],
  },
];

export function IngredientShowcase() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground mb-3">
            Key Ingredients
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Nature&apos;s Finest,{" "}
            <span className="italic font-light text-foreground/30">
              Perfected by Science
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.65,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-2xl border border-border bg-background p-6 md:p-7 flex flex-col gap-5 hover:shadow-md transition-shadow duration-300"
            >
              {/* Image + name row */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                  <Image
                    src={ing.imageSrc}
                    alt={`${ing.name} botanical illustration`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight">{ing.name}</h3>
                  <p className="text-[11px] italic text-muted-foreground mt-0.5">
                    {ing.latin}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Benefits */}
              <ul className="space-y-2.5">
                {ing.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-foreground shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
