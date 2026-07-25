"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, OrderWithDetails } from "@/types";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCodOrder(addressId: string): Promise<ActionResult<{ orderId: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  const address = await prisma.address.findUnique({ where: { id: addressId, userId: session.user.id } });
  if (!address) return { success: false, error: "Address not found" };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId,
      subtotal,
      shipping,
      tax,
      total,
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      paymentMethod: "COD",
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images[0] ?? "",
          price: item.product.price,
          quantity: item.quantity,
          size: item.size ?? undefined,
          color: item.color ?? undefined,
        })),
      },
    },
  });

  await prisma.$transaction([
    ...cartItems.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
    prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
  ]);

  revalidatePath("/orders");
  return { success: true, data: { orderId: order.id } };
}

export async function createUpiOrder(addressId: string, transactionId: string): Promise<ActionResult<{ orderId: string; amount: number }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const trimmedTxnId = transactionId.trim();
  if (!trimmedTxnId) return { success: false, error: "UPI transaction / UTR number is required" };

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  const address = await prisma.address.findUnique({ where: { id: addressId, userId: session.user.id } });
  if (!address) return { success: false, error: "Address not found" };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId,
      subtotal,
      shipping,
      tax,
      total,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "UPI",
      paymentId: trimmedTxnId,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images[0] ?? "",
          price: item.product.price,
          quantity: item.quantity,
          size: item.size ?? undefined,
          color: item.color ?? undefined,
        })),
      },
    },
  });

  await prisma.$transaction([
    ...cartItems.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
    prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
  ]);

  revalidatePath("/orders");
  return { success: true, data: { orderId: order.id, amount: total } };
}

export async function getUserOrders(): Promise<OrderWithDetails[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
  });
}

export async function addAddress(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const data = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    line1: formData.get("line1") as string,
    line2: (formData.get("line2") as string) || undefined,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    pincode: formData.get("pincode") as string,
    isDefault: formData.get("isDefault") === "true",
  };

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...data, userId: session.user.id },
  });

  revalidatePath("/checkout");
  return { success: true, data: { id: address.id } };
}

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}
