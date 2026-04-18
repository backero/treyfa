import { prisma } from "@/lib/prisma";
import { AdminCategoryActions } from "@/components/admin/AdminCategoryActions";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Category Management" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} total</p>
        </div>
        <AdminCategoryActions />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">NAME</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DESCRIPTION</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">PRODUCTS</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                    {cat.description ?? "—"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm">{cat._count.products}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={cat.isActive ? "success" : "secondary"}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminCategoryActions category={cat} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No categories yet. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
