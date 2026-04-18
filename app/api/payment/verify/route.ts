import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/actions/order";

export async function POST(req: NextRequest) {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

  const result = await verifyPayment(orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
