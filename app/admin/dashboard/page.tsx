import { getDashboardStats } from "@/actions/admin";
import { DashboardStatsCards } from "@/components/admin/DashboardStats";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-amber-50 text-amber-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  REFUNDED: "bg-red-50 text-red-600",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, here&apos;s what&apos;s happening.</p>
      </div>

      <DashboardStatsCards stats={stats} />

      {/* Revenue Chart */}
      <div className="bg-background border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Revenue (Last 6 Months)</h2>
        <div className="flex items-end gap-2 h-40">
          {stats.revenueByMonth.map(({ month, revenue }) => {
            const maxRevenue = Math.max(...stats.revenueByMonth.map((m) => m.revenue));
            const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatPrice(revenue)}</span>
                <div
                  className="w-full bg-foreground rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {stats.recentOrders.map((order) => (
            <div key={order.id} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">
                  {(order as any).user?.name} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
