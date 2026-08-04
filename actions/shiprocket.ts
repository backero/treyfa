"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

// Pushes a confirmed order to Shiprocket. Never throws — checkout must succeed
// regardless of Shiprocket's availability, so failures are stored on the order
// for admin visibility/retry instead of bubbling up.
export async function pushOrderToShiprocket(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true, user: true },
  });
  if (!order || order.shiprocketOrderId) return;

  // Atomically claim the push so the client-verify path and the webhook safety net
  // (both of which can call this for the same order) never create duplicate shipments.
  const claim = await prisma.order.updateMany({
    where: { id: orderId, shiprocketOrderId: null },
    data: { shiprocketError: "Pushing to Shiprocket…" },
  });
  if (claim.count === 0) return;

  const result = await createShiprocketOrder({
    id: order.id,
    createdAt: order.createdAt,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    total: order.total,
    items: order.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      productId: item.productId,
    })),
    address: order.address,
    userEmail: order.user.email ?? "",
  });

  if (result.success) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shiprocketOrderId: result.shiprocketOrderId,
        shiprocketShipmentId: result.shiprocketShipmentId,
        shiprocketError: null,
      },
    });
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: { shiprocketError: result.error },
    });
  }

  revalidatePath("/admin/orders");
}

export async function retryShiprocketPush(orderId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.order.update({ where: { id: orderId }, data: { shiprocketOrderId: null } });
  await pushOrderToShiprocket(orderId);

  const updated = await prisma.order.findUnique({ where: { id: orderId }, select: { shiprocketOrderId: true, shiprocketError: true } });

  revalidatePath("/admin/orders");
  if (updated?.shiprocketOrderId) return { success: true };
  return { success: false, error: updated?.shiprocketError ?? "Failed to push to Shiprocket" };
}
