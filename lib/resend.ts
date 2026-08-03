import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const NOTIFY_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || "treyfaacc@gmail.com";

export async function sendNewOrderEmail(order: {
  id: string;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping order notification email");
    return;
  }

  const itemsHtml = order.items
    .map((i) => `<li>${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toFixed(2)}</li>`)
    .join("");

  try {
    await resend.emails.send({
      from: "Treyfa Orders <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `New order #${order.id.slice(-8).toUpperCase()} — ₹${order.total.toFixed(2)}`,
      html: `
        <h2>New order received</h2>
        <p><strong>Order:</strong> #${order.id.slice(-8).toUpperCase()}</p>
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
        <p><strong>Payment method:</strong> ${order.paymentMethod}</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders">View in admin panel</a></p>
      `,
    });
  } catch (err) {
    console.error("Failed to send order notification email:", err);
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping password reset email");
    return false;
  }

  try {
    await resend.emails.send({
      from: "Treyfa <onboarding@resend.dev>",
      to: email,
      subject: "Reset your Treyfa password",
      html: `
        <p>We received a request to reset your Treyfa account password.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return false;
  }
}

export async function sendReviewRequestEmail(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; slug: string }[];
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping review request email");
    return false;
  }
  if (!order.customerEmail) return false;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://treyfa.in";
  const itemsHtml = order.items
    .map(
      (i) =>
        `<li>${i.name} — <a href="${siteUrl}/product/${i.slug}?tab=reviews">Write a review</a></li>`
    )
    .join("");

  try {
    await resend.emails.send({
      from: "Treyfa <onboarding@resend.dev>",
      to: order.customerEmail,
      subject: "How was your Treyfa order? Leave a quick review",
      html: `
        <p>Hi ${order.customerName || "there"},</p>
        <p>We hope you're loving your recent order (#${order.id.slice(-8).toUpperCase()})! Would you mind sharing a quick review? It helps other customers and takes less than a minute.</p>
        <ul>${itemsHtml}</ul>
        <p>Thank you for shopping with Treyfa!</p>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send review request email:", err);
    return false;
  }
}
