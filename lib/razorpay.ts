import Razorpay from "razorpay";

export const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// amountInRupees is converted to paise here so callers always pass the same
// unit the rest of the app uses (Order.total, product prices, etc).
export async function refundPayment(
  paymentId: string,
  amountInRupees: number
): Promise<{ success: true } | { success: false; error: string }> {
  if (!razorpay) {
    return { success: false, error: "Razorpay is not configured — cannot process refund" };
  }
  try {
    await razorpay.payments.refund(paymentId, { amount: Math.round(amountInRupees * 100) });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refund failed";
    return { success: false, error: `Razorpay refund failed: ${message}` };
  }
}
