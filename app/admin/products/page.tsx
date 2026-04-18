import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminProductActions } from "@/components/admin/AdminProductActions";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Product Management" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ where: { isActive: true } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} total products</p>
        </div>
        <AdminProductActions categories={categories} />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">PRODUCT</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CATEGORY</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">PRICE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STOCK</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-xs">{product.category.name}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.comparePrice)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm ${
                      product.stock === 0
                        ? "text-red-500"
                        : product.stock <= 10
                        ? "text-amber-500"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.isActive ? "success" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminProductActions product={product} categories={categories} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
