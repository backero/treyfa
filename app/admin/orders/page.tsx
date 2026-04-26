import { getAllOrders } from "@/actions/admin";
import { AdminOrderActions } from "@/components/admin/AdminOrderActions";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Management" };

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-50 text-blue-700" },
  PROCESSING: { label: "Processing", color: "bg-amber-50 text-amber-700" },
  SHIPPED: { label: "Shipped", color: "bg-purple-50 text-purple-700" },
  DELIVERED: { label: "Delivered", color: "bg-green-50 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700" },
  REFUNDED: { label: "Refunded", color: "bg-red-50 text-red-600" },
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page ?? "1");
  const result = await getAllOrders(currentPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">{result.total} total orders</p>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ORDER ID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CUSTOMER</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DATE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ITEMS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TOTAL</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.items.map((order) => {
              const config = statusConfig[order.status];
              return (
                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-mono font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{(order as any).user?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{(order as any).user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{order.items.length} items</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.paymentStatus}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminOrderActions order={order} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {result.items.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">No orders yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">Orders placed by customers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
