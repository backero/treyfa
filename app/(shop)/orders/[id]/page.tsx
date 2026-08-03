import { getOrderById } from "@/actions/order";
import { PageTransition } from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CancelOrderButton } from "@/components/shop/CancelOrderButton";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import type { Metadata } from "next";
import { OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING"];

export const metadata: Metadata = { title: "Order Details" };

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  PROCESSING: { label: "Processing", variant: "warning" },
  SHIPPED: { label: "Shipped", variant: "warning" },
  DELIVERED: { label: "Delivered", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

const paymentMethodLabel: Record<string, string> = {
  RAZORPAY: "Paid Online",
  UPI: "UPI",
  COD: "Cash on Delivery",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const config = statusConfig[order.status];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Badge variant={config.variant as any}>{config.label}</Badge>
        </div>

        {order.trackingNumber && (
          <div className="mb-6 p-4 border border-border rounded-xl bg-secondary/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {order.carrier ? `Shipped via ${order.carrier}` : "Tracking Number"}
              </p>
              <p className="text-sm font-medium mt-0.5">{order.trackingNumber}</p>
            </div>
          </div>
        )}

        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-secondary/30 flex items-center gap-2">
            <Package className="h-4 w-4" />
            <h2 className="font-semibold text-sm">Items</h2>
          </div>
          <Separator />
          <div className="px-5 py-4 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  {item.image && (
                    <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[item.size, item.color].filter(Boolean).join(" · ")}
                    {item.size || item.color ? " · " : ""}
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" /> Delivery Address
            </h2>
            <p className="text-sm font-medium">{order.address.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.address.phone}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {order.address.line1}, {order.address.line2 && `${order.address.line2}, `}
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-3">Payment Summary</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Payment Method</span>
                <span>{paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Payment Status</span>
                <span>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer">
              Download Invoice
            </a>
          </Button>
          {CANCELLABLE_STATUSES.includes(order.status) && (
            <CancelOrderButton
              orderId={order.id}
              wasPaidOnline={order.paymentMethod === "RAZORPAY" && order.paymentStatus === "PAID"}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
