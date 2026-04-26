"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dharshana",
    rating: 5,
    text: "Neem shampoo reduces dandruff within a few washes. Makes scalp feel clean and fresh without any dryness.",
    product: "Neem Anti-Dandruff Shampoo",
  },
  {
    name: "Dharshini",
    rating: 5,
    text: "Had constant itching due to dandruff, but scalp feels calm now. Hair feels soft after every wash.",
    product: "Neem Anti-Dandruff Shampoo",
  },
  {
    name: "Dharsha",
    rating: 5,
    text: "Herbal neem formula controls flakes well and doesn't feel harsh. Hair looks healthier and smoother.",
    product: "Neem Anti-Dandruff Shampoo",
  },
  {
    name: "Gopinath",
    rating: 5,
    text: "Completely cured dandruff within the shortest time. I've tried many products — this one actually works.",
    product: "Neem Anti-Dandruff Shampoo",
  },
  {
    name: "Naveen",
    rating: 5,
    text: "Neem formula works great for itchy scalp. Feels very refreshing after wash. Will continue using.",
    product: "Neem Anti-Dandruff Shampoo",
  },
  {
    name: "Sagaya Mary",
    rating: 5,
    text: "I use this product daily. Got super long hair within a few weeks. It's genuinely the best product I've used.",
    product: "Turmeric Shampoo + Conditioner",
  },
  {
    name: "Chithra",
    rating: 5,
    text: "It strengthens my hair from the roots and reduces the breakage problem. Visible difference within weeks.",
    product: "Turmeric Shampoo + Conditioner",
  },
  {
    name: "Kumaravel",
    rating: 5,
    text: "It helps to strengthen my hair from the roots and grow long with shine. Amazing herbal formula.",
    product: "Turmeric Shampoo + Conditioner",
  },
  {
    name: "Kowsalya",
    rating: 5,
    text: "Gives a visible hair growth result — removed hair-fall and increased my hair growth within 2 months.",
    product: "Virgin Coconut Vetiver Hair Oil",
  },
  {
    name: "Mohan",
    rating: 5,
    text: "While applying the oil it gives the feel of natural cooling effect, which gives a superb vibe. Love it.",
    product: "Virgin Coconut Vetiver Hair Oil",
  },
  {
    name: "MSC Emil Joshua",
    rating: 5,
    text: "Basil Heaven Heal Oil is a wonderful addition to my self-care routine. Works beautifully as both a hair oil and a body moisturizer.",
    product: "Basil Heaven Heal Oil",
  },
  {
    name: "Elumalai",
    rating: 5,
    text: "I like that it's herbal and free from harsh chemicals. Nourishes deeply and gives a natural glow to the skin.",
    product: "Basil Heaven Heal Oil",
  },
  {
    name: "Sathya",
    rating: 5,
    text: "It removes the oil from my face and changes it into brightness. Skin looks radiant after every use.",
    product: "Neem Face Wash",
  },
  {
    name: "Barani",
    rating: 5,
    text: "It reduces pimples and breakouts superbly. I was struggling for months — this solved it in two weeks.",
    product: "Neem Face Wash",
  },
];

const row1 = testimonials.slice(0, 7);
const row2 = testimonials.slice(7);

function TestimonialCard({
  name,
  rating,
  text,
  product,
}: (typeof testimonials)[0]) {
  return (
    <div className="flex-shrink-0 w-[270px] sm:w-[310px] md:w-[350px] rounded-2xl border border-border bg-background p-4 sm:p-5 flex flex-col gap-3 mx-2 sm:mx-2.5">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        &ldquo;{text}&rdquo;
      </p>
      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
        <p className="text-xs font-semibold truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground text-right max-w-[130px] leading-tight flex-shrink-0">
          {product}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20 overflow-hidden bg-secondary/20">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-12 px-4"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
          Real Reviews from Treyfa.in
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">Loved by Thousands</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Genuine reviews from verified buyers on our store
        </p>
      </motion.div>

      {/* Marquee rows */}
      <div className="marquee-pause space-y-4">
        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden">
          <div className="flex animate-marquee-left w-max">
            {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div className="flex animate-marquee-right w-max">
            {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
