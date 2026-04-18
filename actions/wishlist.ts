"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, WishlistItemWithProduct } from "@/types";
import { revalidatePath } from "next/cache";

export async function getWishlistItems(): Promise<WishlistItemWithProduct[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleWishlist(productId: string): Promise<ActionResult<{ added: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Please login to manage wishlist" };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/wishlist");
    return { success: true, data: { added: false } };
  } else {
    await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });
    revalidatePath("/wishlist");
    return { success: true, data: { added: true } };
  }
}

export async function removeFromWishlist(productId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  revalidatePath("/wishlist");
  return { success: true };
}
