import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductCardSkeleton } from "@/components/shop/ProductCardSkeleton";
import { getFeaturedProducts } from "@/actions/product";
import { HeroSection } from "@/components/shop/HeroSection";
import { FeaturesBar } from "@/components/shop/FeaturesBar";
import { IngredientShowcase } from "@/components/shop/IngredientShowcase";
import { BrandStory } from "@/components/shop/BrandStory";
import { HorizontalProductScroll } from "@/components/shop/HorizontalProductScroll";
import { TestimonialsSection } from "@/components/shop/TestimonialsSection";
import { BeforeAfterSection } from "@/components/shop/BeforeAfterSection";
import { AwardsSection } from "@/components/shop/AwardsSection";
import { InstagramSection } from "@/components/shop/InstagramSection";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treyfa — Premium Natural Skincare",
  description: "Discover curated natural skincare products. Powered by Neem, Turmeric & Coconut.",
};

async function FeaturedProducts() {
  try {
    const products = await getFeaturedProducts();
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No products yet. Add some via the admin panel.
          </p>
        )}
      </div>
    );
  } catch {
    return (
      <p className="text-center text-muted-foreground py-8">
        Unable to load products. Please configure your database.
      </p>
    );
  }
}

async function ProductScrollSection() {
  try {
    const products = await getFeaturedProducts();
    return <HorizontalProductScroll products={products} />;
  } catch {
    return null;
  }
}

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust bar */}
      <FeaturesBar />

      {/* 3. Social proof — shown early to build trust above the fold */}
      <TestimonialsSection />

      {/* 4. Ingredient storytelling */}
      <IngredientShowcase />

      {/* 5. Brand story */}
      <BrandStory />

      {/* 6. Horizontal scroll product showcase */}
      <Suspense fallback={null}>
        <ProductScrollSection />
      </Suspense>

      {/* 7. Featured products grid */}
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-1.5">
                Handpicked
              </p>
              <h2 className="text-2xl font-bold">Featured Products</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products?featured=true">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </AnimatedSection>

      {/* 8. Before & After results */}
      <BeforeAfterSection />

      {/* 9. Awards & recognition */}
      <AwardsSection />

      {/* 10. Instagram */}
      <InstagramSection />

      {/* 11. CTA Banner */}
      <AnimatedSection className="py-20 container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-foreground text-background px-8 py-16 text-center">
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-background/40 mb-4">
              Limited Time
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nature&apos;s Best, Delivered
            </h2>
            <p className="text-background/60 mb-8 max-w-md mx-auto">
              Experience the power of pure botanical ingredients. Free shipping on all orders over ₹999.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-background/50 text-background hover:bg-background hover:text-foreground rounded-full px-8"
              asChild
            >
              <Link href="/products">
                Shop Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-green-900/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-900/20 blur-2xl" />
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
