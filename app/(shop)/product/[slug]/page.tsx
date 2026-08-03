import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/product";
import { getProductReviews, getUserReviewForProduct } from "@/actions/review";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductDetailContent } from "@/components/shop/ProductDetailContent";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, truncate } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://treyfa.in";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  const shippingNote =
    product.price >= FREE_SHIPPING_THRESHOLD
      ? " Free shipping."
      : ` Free shipping over ₹${FREE_SHIPPING_THRESHOLD}.`;
  return {
    title: product.name,
    description: `${truncate(product.description, 160 - shippingNote.length)}${shippingNote}`,
    alternates: { canonical: `/product/${product.slug}` },
    keywords: [product.name, product.category.name, ...product.tags],
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);
  const [reviews, existingReview] = await Promise.all([
    getProductReviews(product.id),
    getUserReviewForProduct(product.id),
  ]);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Treyfa" },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.price >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 3,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `${SITE_URL}/products?category=${product.category.slug}`,
      },
      { "@type": "ListItem", position: 4, name: product.name, item: `${SITE_URL}/product/${product.slug}` },
    ],
  };

  return (
    <PageTransition>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
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
            <ProductDetailContent
              product={product}
              reviews={reviews}
              existingReview={existingReview}
              initialTab={tab === "reviews" ? "reviews" : undefined}
            />
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
