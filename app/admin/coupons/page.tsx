import { getAllCoupons } from "@/actions/admin";
import { AdminCouponActions } from "@/components/admin/AdminCouponActions";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Ticket } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Coupon Management" };

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-muted-foreground text-sm mt-1">{coupons.length} total</p>
        </div>
        <AdminCouponActions />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CODE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DISCOUNT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">USAGE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EXPIRES</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{c.code}</p>
                  {c.minOrderValue && (
                    <p className="text-xs text-muted-foreground">Min order {formatPrice(c.minOrderValue)}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm">
                    {c.discountType === "PERCENT" ? `${c.discountValue}% off` : `${formatPrice(c.discountValue)} off`}
                  </p>
                  {c.maxDiscount && (
                    <p className="text-xs text-muted-foreground">Up to {formatPrice(c.maxDiscount)}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm">
                    {c.usedCount}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {c.expiresAt ? formatDate(c.expiresAt) : "Never"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.isActive ? "success" : "secondary"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminCouponActions coupon={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
              <Ticket className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">No coupons yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Create a discount code to run a promotion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
