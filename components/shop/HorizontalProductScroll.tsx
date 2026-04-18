"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ProductWithCategory } from "@/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = { products: ProductWithCategory[] };

export function HorizontalProductScroll({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !trackRef.current) return;
    if (products.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current!;

      const ctx = gsap.context(() => {
        const totalScrollWidth = track.scrollWidth - window.innerWidth + 128;

        gsap.to(track, {
          x: -totalScrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${totalScrollWidth}`,
            invalidateOnRefresh: true,
          },
        });

        // Staggered card entrance
        gsap.fromTo(
          ".h-scroll-card",
          { opacity: 0.3, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.5,
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [products, prefersReducedMotion]);

  if (products.length === 0) return null;

  return (
    <section ref={sectionRef} className="overflow-hidden bg-secondary/30 py-16">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
              Our Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Scroll to Explore
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex gap-5 pl-4 md:pl-16 pr-8 md:pr-32"
        style={{ width: "max-content" }}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="h-scroll-card flex-shrink-0 w-[240px] md:w-[300px] lg:w-[320px]"
          >
            <Link href={`/product/${product.slug}`} className="block group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-4 shadow-sm">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                    sizes="320px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                {product.category.name}
              </p>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-foreground/70 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm font-bold">{formatPrice(product.price)}</p>
            </Link>
          </div>
        ))}

        {/* End card CTA */}
        <div className="h-scroll-card flex-shrink-0 w-[240px] md:w-[300px] lg:w-[320px] flex items-center justify-center">
          <Link href="/products">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-dashed border-border hover:border-foreground/30 transition-colors duration-300 cursor-pointer"
            >
              <div className="h-14 w-14 rounded-full bg-foreground text-background flex items-center justify-center">
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="font-semibold text-sm">View All Products</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
