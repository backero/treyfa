import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Order, OrderItem, Address } from "@prisma/client";

// pdf-lib's standard fonts use WinAnsi encoding, which can't represent ₹ --
// format amounts as plain "Rs." text instead of reusing the app's formatPrice.
function formatInr(amount: number): string {
  return `Rs. ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
}

const BUSINESS_NAME = "Treyfa (Backero Private Limited)";
const BUSINESS_ADDRESS_LINES = [
  "42, Interflex Complex, near 5K Car Care, Trichy Road",
  "Sulur, Coimbatore, Tamil Nadu - 641402",
];
const BUSINESS_GSTIN = "33AAJCB0859L1ZH";

type InvoiceOrder = Order & {
  items: OrderItem[];
  address: Address;
  user: { name: string | null; email: string | null };
};

export async function generateInvoicePdf(order: InvoiceOrder): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const marginX = 50;
  let y = 792;

  const draw = (str: string, x: number, size = 10, useBold = false) => {
    page.drawText(str, { x, y, size, font: useBold ? bold : font, color: rgb(0.1, 0.1, 0.1) });
  };
  const newLine = (amount = 14) => {
    y -= amount;
  };

  // Header
  draw(BUSINESS_NAME, marginX, 18, true);
  newLine(22);
  for (const line of BUSINESS_ADDRESS_LINES) {
    draw(line, marginX, 10);
    newLine();
  }
  draw(`GSTIN: ${BUSINESS_GSTIN}`, marginX, 10);
  newLine(28);

  draw("TAX INVOICE", marginX, 14, true);
  newLine(20);
  draw(`Invoice No: ${order.id.slice(-8).toUpperCase()}`, marginX, 10);
  newLine();
  draw(`Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, marginX, 10);
  newLine(28);

  // Bill To
  draw("Bill To", marginX, 11, true);
  newLine(16);
  draw(order.address.name, marginX, 10);
  newLine();
  draw(order.address.phone, marginX, 10);
  newLine();
  draw(order.address.line1 + (order.address.line2 ? `, ${order.address.line2}` : ""), marginX, 10);
  newLine();
  draw(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`, marginX, 10);
  newLine();
  if (order.user.email) {
    draw(order.user.email, marginX, 10);
    newLine();
  }
  newLine(20);

  // Items table header
  const col = { name: marginX, qty: 330, price: 390, amount: 470 };
  draw("Item", col.name, 10, true);
  draw("Qty", col.qty, 10, true);
  draw("Price", col.price, 10, true);
  draw("Amount", col.amount, 10, true);
  newLine(6);
  page.drawLine({
    start: { x: marginX, y },
    end: { x: 545, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  newLine(16);

  for (const item of order.items) {
    const truncatedName = item.name.length > 45 ? item.name.slice(0, 42) + "..." : item.name;
    draw(truncatedName, col.name, 9.5);
    draw(String(item.quantity), col.qty, 9.5);
    draw(formatInr(item.price), col.price, 9.5);
    draw(formatInr(item.price * item.quantity), col.amount, 9.5);
    newLine(16);
  }

  newLine(6);
  page.drawLine({
    start: { x: marginX, y },
    end: { x: 545, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  newLine(20);

  // Totals
  const totalsX = 400;
  const drawTotalRow = (label: string, value: string, useBold = false) => {
    draw(label, totalsX, 10, useBold);
    draw(value, 480, 10, useBold);
    newLine(16);
  };

  drawTotalRow("Subtotal", formatInr(order.subtotal));
  if (order.discount > 0) {
    drawTotalRow(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, `-${formatInr(order.discount)}`);
  }
  drawTotalRow("Shipping", order.shipping === 0 ? "FREE" : formatInr(order.shipping));
  drawTotalRow("GST (18%)", formatInr(order.tax));
  newLine(4);
  page.drawLine({
    start: { x: totalsX, y: y + 10 },
    end: { x: 545, y: y + 10 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  drawTotalRow("Total", formatInr(order.total), true);
  newLine(20);

  draw(`Payment Method: ${order.paymentMethod}`, marginX, 9.5);
  newLine();
  draw(`Payment Status: ${order.paymentStatus}`, marginX, 9.5);
  newLine(30);

  draw("This is a system-generated invoice.", marginX, 8);

  return doc.save();
}
