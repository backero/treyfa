"use server";

import { prisma } from "@/lib/prisma";
import { ProductWithCategory, PaginatedResult } from "@/types";

type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
};

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<ProductWithCategory>> {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt_desc",
    featured,
    page = 1,
    pageSize = 12,
  } = filters;

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  const [field, direction] = sortBy.split("_");
  const orderBy: any = { [field]: direction as "asc" | "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: true },
    orderBy: { rating: "desc" },
    take: 8,
  });
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string
): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, NOT: { id: productId } },
    include: { category: true },
    orderBy: { rating: "desc" },
    take: 4,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}
