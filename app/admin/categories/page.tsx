import { prisma } from "@/lib/prisma";
import { AdminCategoryActions } from "@/components/admin/AdminCategoryActions";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
          <p className="text-muted-foreground text-sm mt-1">{categories.length} total categories</p>
        </div>
        <AdminCategoryActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-background border border-border rounded-xl overflow-hidden">
            {cat.image && (
              <div className="relative h-32 w-full">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat._count.products} products</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={cat.isActive ? "success" : "secondary"}>
                  {cat.isActive ? "Active" : "Inactive"}
                </Badge>
                <AdminCategoryActions category={cat} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
