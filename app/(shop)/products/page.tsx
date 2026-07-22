import { Suspense } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGridSkeleton } from "@/components/shop/ProductCardSkeleton";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { getProducts, getCategories } from "@/actions/product";
import { PageTransition } from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

type SearchParams = {
  search?: string;
  category?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { category: categorySlug, search } = await searchParams;

  // Search-query pages are unbounded thin content — keep them out of the index.
  if (search) {
    return {
      title: `Search results for "${search}"`,
      robots: { index: false, follow: true },
    };
  }

  if (categorySlug) {
    const categories = await getCategories().catch(() => []);
    const category = categories.find((c) => c.slug === categorySlug);
    if (category) {
      return {
        title: `${category.name} — Herbal ${category.name} Products`,
        description: `Shop Treyfa's ${category.name.toLowerCase()} range — natural, herbal, chemical-free and cruelty-free. Free shipping over ₹999.`,
        alternates: { canonical: `/products?category=${category.slug}` },
      };
    }
  }

  return {
    title: "Shop All Products — Herbal Shampoo, Face Wash, Hair Oil & More",
    description:
      "Browse Treyfa's full range of natural herbal beauty products — neem shampoo, turmeric face wash, hibiscus conditioner, hair oils and body care, all chemical-free and cruelty-free.",
    alternates: { canonical: "/products" },
  };
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page ?? "1");
  let result;
  try {
    result = await getProducts({
      search: searchParams.search,
      category: searchParams.category,
      sortBy: searchParams.sortBy,
      minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
      page,
      pageSize: 12,
    });
  } catch {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Unable to load products. Please check your database connection.</p>
      </div>
    );
  }

  if (result.items.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/products">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(p));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-sm text-muted-foreground">
        Showing {result.items.length} of {result.total} products
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {result.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          {page > 1 && (
            <Button variant="outline" size="icon" asChild>
              <Link href={buildPageUrl(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              asChild
            >
              <Link href={buildPageUrl(p)}>{p}</Link>
            </Button>
          ))}
          {page < result.totalPages && (
            <Button variant="outline" size="icon" asChild>
              <Link href={buildPageUrl(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categories = await getCategories().catch(() => []);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shop All Products</h1>
          <p className="text-muted-foreground mt-1">Discover our curated collection</p>
        </div>

        <div className="mb-6">
          <ProductFilters categories={categories} />
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid searchParams={params} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
