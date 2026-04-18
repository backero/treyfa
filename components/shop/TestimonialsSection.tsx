"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Priya K.",   location: "Chennai",    rating: 5, text: "The Neem Shampoo is incredible! Dandruff reduced significantly after just two weeks.",                             product: "Neem Anti-Dandruff Shampoo" },
  { name: "Rahul M.",   location: "Bengaluru",  rating: 5, text: "Switched to the Turmeric Face Wash and never looking back. Skin looks brighter instantly.",                       product: "Turmeric Foaming Face Wash" },
  { name: "Sneha T.",   location: "Coimbatore", rating: 5, text: "Pure Virgin Coconut Oil is exactly as described — pure. Hair growth improved noticeably.",                        product: "Pure Virgin Vetiver Coconut Oil" },
  { name: "Arjun S.",   location: "Mumbai",     rating: 5, text: "Choco Coffee Face Wash became my daily essential. Texture is amazing and skin stays soft all day.",               product: "Choco Coffee Face Wash" },
  { name: "Deepa R.",   location: "Hyderabad",  rating: 5, text: "Treyfa is genuinely doing something different. South Indian herbal remedies in modern packaging.",                product: "Neem Face Wash" },
  { name: "Vikram N.",  location: "Pune",       rating: 5, text: "Fast delivery, beautiful packaging. Turmeric Shampoo left my hair shiny after the very first wash.",              product: "Turmeric Shampoo + Conditioner" },
  { name: "Meera L.",   location: "Kochi",      rating: 5, text: "I've tried so many herbal brands and Treyfa stands apart. Ingredients are genuinely clean.",                     product: "Neem Shampoo" },
  { name: "Sanjay P.",  location: "Delhi",      rating: 5, text: "My wife started using the Hibiscus range and her hair fall has reduced dramatically. We're now loyal customers.", product: "Hibiscus Shampoo & Conditioner" },
  { name: "Anjali B.",  location: "Mysuru",     rating: 5, text: "Basil Heaven Heal Oil is unlike anything else. Scalp feels cool and nourished. Zero greasiness.",                product: "Basil Heaven Heal Oil" },
  { name: "Ravi S.",    location: "Ahmedabad",  rating: 5, text: "The Curry Leaves Hair Oil is a gem. Roots strengthened, breakage gone. Been using for 3 months.",                product: "Curry Leaves Hair Oil" },
];

const row1 = testimonials.slice(0, 5);
const row2 = testimonials.slice(5);

function TestimonialCard({ name, location, rating, text, product }: typeof testimonials[0]) {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[340px] rounded-2xl border border-border bg-background p-4 sm:p-5 flex flex-col gap-3 mx-2 sm:mx-2.5">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground">{location}</p>
        </div>
        <p className="text-[10px] text-muted-foreground text-right max-w-[110px] leading-tight flex-shrink-0">{product}</p>
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
          What Customers Say
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">
          Loved by Thousands
        </h2>
      </motion.div>

      {/* Marquee wrapper — pause-on-hover applied to the outer div */}
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
