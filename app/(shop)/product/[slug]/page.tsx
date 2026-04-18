import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/product";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductDetailContent } from "@/components/shop/ProductDetailContent";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Sticky image gallery — overflow-visible lets the zoom panel bleed right */}
          <div className="lg:sticky lg:top-24 overflow-visible relative z-10">
            <ImageGallery images={product.images} alt={product.name} />
          </div>

          {/* Scrollable product info — z-0 so zoom panel (z-30) renders above */}
          <div className="relative z-0">
            <ProductDetailContent product={product} />
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <AnimatedSection className="mt-24">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-1.5">
                Discover More
              </p>
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </PageTransition>
  );
}
