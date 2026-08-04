import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { finalizeRazorpayOrder } from "@/actions/order";
import { pushOrderToShiprocket } from "@/actions/shiprocket";
import { sendNewOrderEmail } from "@/lib/resend";

// Safety net for the client-side verify step: if the browser closes right after payment
// (before the success handler's server action completes), this still confirms the order.
// finalizeRazorpayOrder is idempotent, so it's harmless if both paths run.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  const rawBody = await req.text();

  if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const isValid = Razorpay.validateWebhookSignature(rawBody, signature, process.env.RAZORPAY_WEBHOOK_SECRET);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const razorpayOrderId: string | undefined = payment?.order_id;
    const paymentId: string | undefined = payment?.id;

    if (razorpayOrderId && paymentId) {
      const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
        include: { items: true, user: true },
      });

      if (order) {
        const justFinalized = await finalizeRazorpayOrder(order, paymentId);
        if (justFinalized) {
          await sendNewOrderEmail({
            id: order.id,
            total: order.total,
            paymentMethod: "Razorpay (Online Payment)",
            customerName: order.user.name ?? "Customer",
            customerEmail: order.user.email ?? "",
            items: order.items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
          });
          await pushOrderToShiprocket(order.id);
        }
      }
    }
  }

  if (event.event === "payment.failed") {
    const razorpayOrderId: string | undefined = event.payload?.payment?.entity?.order_id;
    if (razorpayOrderId) {
      await prisma.order.updateMany({
        where: { razorpayOrderId, paymentStatus: "PENDING" },
        data: { paymentStatus: "FAILED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
