import { getAllCustomers } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customer Management" };

export default async function AdminCustomersPage() {
  const result = await getAllCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">{result.total} registered customers</p>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CUSTOMER</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">JOINED</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ORDERS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TOTAL SPENT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.items.map((customer) => {
              const totalSpent = (customer as any).orders.reduce(
                (sum: number, o: any) => sum + o.total,
                0
              );
              return (
                <tr key={customer.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                        {customer.name?.charAt(0).toUpperCase() ?? <User className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{formatDate(customer.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{(customer as any)._count.orders}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{formatPrice(totalSpent)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={customer.emailVerified ? "success" : "secondary"}>
                      {customer.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {result.items.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No customers yet</div>
        )}
      </div>
    </div>
  );
}
