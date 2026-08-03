"use server";

import crypto from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, refundPayment } from "@/lib/razorpay";
import { ActionResult, OrderWithDetails } from "@/types";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { sendNewOrderEmail } from "@/lib/resend";
import type { Order, OrderItem, Coupon } from "@prisma/client";

async function resolveCoupon(
  code: string,
  subtotal: number
): Promise<{ error: string } | { coupon: Coupon; discount: number }> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon || !coupon.isActive) return { error: "Invalid coupon code" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: "This coupon has expired" };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { error: "This coupon has reached its usage limit" };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` };
  }

  let discount = coupon.discountType === "PERCENT" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.round(Math.min(discount, subtotal) * 100) / 100;

  return { coupon, discount };
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<ActionResult<{ discount: number; code: string }>> {
  const result = await resolveCoupon(code, subtotal);
  if ("error" in result) return { success: false, error: result.error };
  return { success: true, data: { discount: result.discount, code: result.coupon.code } };
}

async function loadCheckoutContext(userId: string, addressId: string, couponCode?: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (cartItems.length === 0) return { error: "Cart is empty" } as const;

  const address = await prisma.address.findUnique({ where: { id: addressId, userId } });
  if (!address) return { error: "Address not found" } as const;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

  let discount = 0;
  let appliedCouponCode: string | undefined;
  if (couponCode) {
    const result = await resolveCoupon(couponCode, subtotal);
    if ("error" in result) return { error: result.error } as const;
    discount = result.discount;
    appliedCouponCode = result.coupon.code;
  }

  const total = subtotal + shipping + tax - discount;

  return { cartItems, address, subtotal, shipping, tax, discount, couponCode: appliedCouponCode, total } as const;
}

// Flips a Razorpay order to PAID exactly once, then applies its stock/cart side-effects.
// The `paymentStatus: { not: "PAID" }` guard makes this safe to call from both the
// client-side verify action and the webhook, whichever arrives first.
export async function finalizeRazorpayOrder(
  order: Pick<Order, "id" | "userId" | "couponCode"> & { items: Pick<OrderItem, "productId" | "quantity">[] },
  paymentId: string
): Promise<boolean> {
  const claim = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: { not: "PAID" } },
    data: { status: "CONFIRMED", paymentStatus: "PAID", paymentId },
  });
  if (claim.count === 0) return false;

  await prisma.$transaction([
    ...order.items.map((item) =>
      prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } })
    ),
    prisma.cartItem.deleteMany({ where: { userId: order.userId } }),
    // Only counts against the coupon's usage limit once payment actually succeeds —
    // an abandoned Razorpay checkout shouldn't burn a redemption.
    ...(order.couponCode
      ? [prisma.coupon.update({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } })]
      : []),
  ]);

  return true;
}

export async function createCodOrder(
  addressId: string,
  couponCode?: string
): Promise<ActionResult<{ orderId: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const ctx = await loadCheckoutContext(session.user.id, addressId, couponCode);
  if ("error" in ctx) return { success: false, error: ctx.error };
  const { cartItems, subtotal, shipping, tax, discount, couponCode: appliedCode, total } = ctx;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId,
      subtotal,
      shipping,
      tax,
      discount,
      couponCode: appliedCode,
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
    ...(appliedCode
      ? [prisma.coupon.update({ where: { code: appliedCode }, data: { usedCount: { increment: 1 } } })]
      : []),
  ]);

  await sendNewOrderEmail({
    id: order.id,
    total: order.total,
    paymentMethod: "Cash on Delivery",
    customerName: session.user.name ?? "Customer",
    customerEmail: session.user.email ?? "",
    items: cartItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    })),
  });

  revalidatePath("/orders");
  return { success: true, data: { orderId: order.id } };
}

export async function createRazorpayOrder(
  addressId: string,
  couponCode?: string
): Promise<ActionResult<{ orderId: string; razorpayOrderId: string; amount: number; keyId: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  if (!razorpay || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    return { success: false, error: "Online payment is not configured" };
  }

  const ctx = await loadCheckoutContext(session.user.id, addressId, couponCode);
  if ("error" in ctx) return { success: false, error: ctx.error };
  const { cartItems, subtotal, shipping, tax, discount, couponCode: appliedCode, total } = ctx;

  // Razorpay order amounts are in paise; receipt is our own reference, capped at 40 chars.
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: `treyfa_${Date.now()}`,
  });

  // Stock is only reserved once payment is verified (see finalizeRazorpayOrder), so an
  // abandoned or failed checkout never oversells inventory.
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      addressId,
      subtotal,
      shipping,
      tax,
      discount,
      couponCode: appliedCode,
      total,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: razorpayOrder.id,
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

  return {
    success: true,
    data: {
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    },
  };
}

export async function verifyRazorpayPayment(
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return { success: false, error: "Online payment is not configured" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });
  if (!order || order.razorpayOrderId !== razorpayOrderId) {
    return { success: false, error: "Order not found" };
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const signaturesMatch =
    expectedSignature.length === razorpaySignature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));

  if (!signaturesMatch) {
    if (order.paymentStatus !== "PAID") {
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "FAILED" } });
    }
    return { success: false, error: "Payment verification failed" };
  }

  const justFinalized = await finalizeRazorpayOrder(order, razorpayPaymentId);
  if (justFinalized) {
    await sendNewOrderEmail({
      id: order.id,
      total: order.total,
      paymentMethod: "Razorpay (Online Payment)",
      customerName: session.user.name ?? "Customer",
      customerEmail: session.user.email ?? "",
      items: order.items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
    });
  }

  revalidatePath("/orders");
  return { success: true };
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

// Orders can only be self-cancelled before they ship — once a courier has it,
// cancellation has to go through support/the admin panel instead.
const CUSTOMER_CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"] as const;

export async function cancelOrder(orderId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    select: {
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      paymentId: true,
      total: true,
      items: { select: { productId: true, quantity: true } },
    },
  });
  if (!order) return { success: false, error: "Order not found" };

  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status as (typeof CUSTOMER_CANCELLABLE_STATUSES)[number])) {
    return { success: false, error: "This order can no longer be cancelled — please contact support" };
  }

  const wasPaidOnline = order.paymentMethod === "RAZORPAY" && order.paymentStatus === "PAID" && order.paymentId;

  if (wasPaidOnline) {
    const refundResult = await refundPayment(order.paymentId!, order.total);
    if (!refundResult.success) return refundResult;
  }

  // An unpaid Razorpay order never held stock (see finalizeRazorpayOrder), so only
  // hand stock back if this order actually reserved it.
  const stockIsReserved = order.paymentMethod !== "RAZORPAY" || order.paymentStatus === "PAID";

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        paymentStatus: wasPaidOnline ? "REFUNDED" : order.paymentStatus,
      },
    }),
    ...(stockIsReserved
      ? order.items.map((item) =>
          prisma.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
        )
      : []),
  ]);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}
