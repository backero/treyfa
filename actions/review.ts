"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserReviewForProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
}

async function recomputeProductRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count,
    },
  });
}

export async function submitReview(
  productId: string,
  rating: number,
  title: string,
  body: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Please sign in to write a review" };

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" };
  }

  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      items: { some: { productId } },
    },
  });

  await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: {
      rating,
      title: title.trim() || null,
      body: body.trim() || null,
      isVerified: !!hasPurchased,
    },
    create: {
      userId: session.user.id,
      productId,
      rating,
      title: title.trim() || null,
      body: body.trim() || null,
      isVerified: !!hasPurchased,
    },
  });

  await recomputeProductRating(productId);

  revalidatePath("/product");
  return { success: true };
}
