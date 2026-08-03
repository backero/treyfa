import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAbandonedCartEmail } from "@/lib/resend";

const ABANDONED_CART_HOURS = 24;
const REMINDER_COOLDOWN_DAYS = 3;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - ABANDONED_CART_HOURS * 60 * 60 * 1000);
  const reminderCooldownCutoff = new Date(Date.now() - REMINDER_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

  const abandonedCarts = await prisma.cartItem.findMany({
    where: { updatedAt: { lte: cutoff } },
    select: { userId: true },
    distinct: ["userId"],
    take: 100,
  });

  let sent = 0;
  for (const { userId } of abandonedCarts) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, cartReminderSentAt: true },
    });
    if (!user?.email) continue;
    if (user.cartReminderSentAt && user.cartReminderSentAt > reminderCooldownCutoff) continue;

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: { select: { name: true, slug: true, price: true } } },
    });
    if (items.length === 0) continue;

    const ok = await sendAbandonedCartEmail({
      customerName: user.name ?? "there",
      customerEmail: user.email,
      items: items.map((i) => ({
        name: i.product.name,
        slug: i.product.slug,
        quantity: i.quantity,
        price: i.product.price,
      })),
    });
    if (ok) {
      await prisma.user.update({ where: { id: userId }, data: { cartReminderSentAt: new Date() } });
      sent++;
    }
  }

  return NextResponse.json({ checked: abandonedCarts.length, sent });
}
