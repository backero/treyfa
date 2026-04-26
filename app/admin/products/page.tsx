import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AdminProductActions } from "@/components/admin/AdminProductActions";
import { Pagination } from "@/components/admin/Pagination";
import Image from "next/image";
import { Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Product Management" };

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1"));

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} total products</p>
        </div>
        <AdminProductActions />
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
                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover" />
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
                  <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                  {product.comparePrice && (
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(product.comparePrice)}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${product.stock === 0 ? "text-red-500" : product.stock <= 10 ? "text-amber-500" : "text-green-600"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.isActive ? "success" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminProductActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">No products yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">Add your first product to start selling.</p>
          </div>
        )}
        <Pagination page={currentPage} totalPages={totalPages} total={total} />
      </div>
    </div>
  );
}
