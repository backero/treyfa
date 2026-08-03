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
  {
    name: "Vasanthi",
    rating: 5,
    text: "Face feels so much brighter after using this for 2 weeks. Turmeric smell is mild, not overpowering at all.",
    product: "Turmeric Face Wash",
  },
  {
    name: "Karthik",
    rating: 4,
    text: "Good for my oily skin, controls shine well. Takes a little longer to see results but worth the wait.",
    product: "Turmeric Face Wash",
  },
  {
    name: "Ilamathi",
    rating: 5,
    text: "Dandruff was really bad before, this oil cleared it up in about a month of regular use.",
    product: "Coconut & Neem Anti-Dandruff Oil",
  },
  {
    name: "Yuvaraj",
    rating: 5,
    text: "Scalp doesn't itch anymore. Smell is strong at first but you get used to it, results are worth it.",
    product: "Coconut & Neem Anti-Dandruff Oil",
  },
  {
    name: "Devika",
    rating: 5,
    text: "Really calming scent, scalp feels so relaxed after massage. Hair also feels softer over time.",
    product: "Coconut Chamomile Hibiscus Hair Oil",
  },
  {
    name: "Shanmugam",
    rating: 4,
    text: "Nice light oil, doesn't feel heavy on the hair. Good for regular oiling routine.",
    product: "Coconut Chamomile Hibiscus Hair Oil",
  },
  {
    name: "Anitha",
    rating: 5,
    text: "Pure and simple, exactly what my grandmother used to use. Hair growth is slow but steady with this.",
    product: "Coconut Oil for Hair Growth",
  },
  {
    name: "Bhuvaneswari",
    rating: 5,
    text: "No added fragrance which I actually prefer, feels more natural on the scalp.",
    product: "Coconut Oil for Hair Growth",
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    text: "Hair fall has reduced a lot since switching to this shampoo. Lathers well without drying my scalp.",
    product: "Hibiscus Shampoo",
  },
  {
    name: "Selvi",
    rating: 4,
    text: "Good shampoo overall, hair feels clean and not stripped like the sulphate ones I used before.",
    product: "Hibiscus Shampoo",
  },
  {
    name: "Muthu",
    rating: 5,
    text: "Detangles my hair so easily now, no more struggling with knots after wash.",
    product: "Hibiscus Conditioner",
  },
  {
    name: "Jeyanthi",
    rating: 5,
    text: "Hair feels so much smoother, doesn't weigh it down either which I was worried about.",
    product: "Hibiscus Conditioner",
  },
  {
    name: "Bala Murugan",
    rating: 5,
    text: "Noticed my grey hairs reducing slowly with regular use, plus scalp feels healthier.",
    product: "Henna Black Hair Oil",
  },
  {
    name: "Nandhini",
    rating: 4,
    text: "Good oil, natural henna smell. Takes consistent use to see the color benefit though.",
    product: "Henna Black Hair Oil",
  },
  {
    name: "Suresh Babu",
    rating: 5,
    text: "Hairfall control is real with this one, noticed less hair on my comb within 2-3 weeks.",
    product: "Curry Leaves Hair Oil",
  },
  {
    name: "Kavitha Devi",
    rating: 5,
    text: "Traditional oil that actually works like the ones my mom used to make at home.",
    product: "Curry Leaves Hair Oil",
  },
  {
    name: "Ramya",
    rating: 5,
    text: "Smells amazing honestly, like actual coffee. Hair feels fresh and bouncy after every wash.",
    product: "Choco Coffee Shampoo + Conditioner",
  },
  {
    name: "Vetrivel",
    rating: 4,
    text: "Nice combo set, saves time not needing a separate conditioner. Good for everyday use.",
    product: "Choco Coffee Shampoo + Conditioner",
  },
  {
    name: "Malathi",
    rating: 5,
    text: "Great for both hair and overall freshness, turmeric scent is subtle not medicinal at all.",
    product: "Turmeric Bath Shampoo + Conditioner",
  },
  {
    name: "Senthil Kumar",
    rating: 5,
    text: "Been using this combo for a month, hair feels healthier and skin doesn't feel dry after bath.",
    product: "Turmeric Bath Shampoo + Conditioner",
  },
  {
    name: "Sowmya",
    rating: 5,
    text: "Use this after every shower now, skin stays moisturized the whole day without feeling greasy.",
    product: "Basil Heaven Healing Body Oil",
  },
  {
    name: "Prabhakaran",
    rating: 4,
    text: "Good body oil, basil smell is calming. A little goes a long way so the bottle lasts.",
    product: "Basil Heaven Healing Body Oil",
  },
  {
    name: "Renuka",
    rating: 5,
    text: "Love using this in the shower, smells like a cafe honestly. Hair and body both feel clean.",
    product: "Choco Coffee Shower Shampoo + Conditioner",
  },
  {
    name: "Arivazhagan",
    rating: 4,
    text: "Convenient 2 in 1, works well for daily bath routine. Would recommend for the smell alone.",
    product: "Choco Coffee Shower Shampoo + Conditioner",
  },
  {
    name: "Latha",
    rating: 5,
    text: "Controls dandruff really well, use it 3 times a week and scalp stays flake free.",
    product: "Neem Dandruff Bath Shampoo + Conditioner",
  },
  {
    name: "Dinesh",
    rating: 5,
    text: "Finally something that works for my dandruff without drying my scalp out completely.",
    product: "Neem Dandruff Bath Shampoo + Conditioner",
  },
  {
    name: "Padma",
    rating: 5,
    text: "Use it for both hair and skin, saves me buying two separate products. Cooling effect is so nice in summer.",
    product: "Vetiver Coconut Body & Hair Oil",
  },
  {
    name: "Kannan",
    rating: 4,
    text: "Good multipurpose oil, absorbs decently for something this nourishing.",
    product: "Vetiver Coconut Body & Hair Oil",
  },
];

const row1 = testimonials.slice(0, 21);
const row2 = testimonials.slice(21);

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
