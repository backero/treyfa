import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReviewRequestEmail } from "@/lib/resend";

const REVIEW_REQUEST_DELAY_DAYS = 3;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - REVIEW_REQUEST_DELAY_DAYS);

  const orders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { lte: cutoff },
      reviewRequestSentAt: null,
    },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { slug: true } } } },
    },
    take: 100,
  });

  let sent = 0;
  for (const order of orders) {
    const ok = await sendReviewRequestEmail({
      id: order.id,
      customerName: order.user.name ?? "there",
      customerEmail: order.user.email ?? "",
      items: order.items.map((i) => ({ name: i.name, slug: i.product.slug })),
    });
    if (ok) {
      await prisma.order.update({
        where: { id: order.id },
        data: { reviewRequestSentAt: new Date() },
      });
      sent++;
    }
  }

  return NextResponse.json({ checked: orders.length, sent });
}
