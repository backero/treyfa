import { getUserOrders } from "@/actions/order";
import { PageTransition } from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { OrderStatus } from "@prisma/client";

export const metadata: Metadata = { title: "My Orders" };

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  PROCESSING: { label: "Processing", variant: "warning" },
  SHIPPED: { label: "Shipped", variant: "warning" },
  DELIVERED: { label: "Delivered", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

export default async function OrdersPage() {
  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="space-y-4">
            <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">No orders yet</h1>
            <p className="text-muted-foreground">When you place orders, they'll appear here.</p>
            <Button asChild className="mt-4">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status];
            return (
              <div key={order.id} className="border border-border rounded-xl overflow-hidden">
                {/* Order Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-secondary/30">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      ORDER #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={config.variant as any}>{config.label}</Badge>
                    <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <Separator />

                {/* Items Preview */}
                <div className="px-5 py-4 space-y-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} · {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                <Separator />

                <div className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Delivering to</p>
                    <p className="text-xs font-medium">
                      {order.address.city}, {order.address.state}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link href={`/orders/${order.id}`}>
                      View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
