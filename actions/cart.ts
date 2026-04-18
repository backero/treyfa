"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, CartItemWithProduct } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCartItems(): Promise<CartItemWithProduct[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addToCart(
  productId: string,
  quantity = 1,
  size?: string,
  color?: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Please login to add items to cart" };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    return { success: false, error: "Product not found" };
  }
  if (product.stock < quantity) {
    return { success: false, error: "Insufficient stock" };
  }

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: session.user.id, productId, quantity, size, color },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(productId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartQuantity(
  productId: string,
  quantity: number
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < quantity) {
    return { success: false, error: "Insufficient stock" };
  }

  await prisma.cartItem.update({
    where: { userId_productId: { userId: session.user.id, productId } },
    data: { quantity },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  revalidatePath("/cart");
  return { success: true };
}
