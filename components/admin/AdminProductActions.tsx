"use client";

import { Product, Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type Props = {
  categories?: Category[];
  product?: Product;
};

export function AdminProductActions({ product }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!product || !confirm("Delete this product?")) return;
    setDeleting(true);
    const result = await deleteProduct(product.id);
    if (result.success) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(false);
  }

  if (!product) {
    return (
      <Button size="sm" asChild>
        <Link href="/admin/products/new">
          <Plus className="h-4 w-4 mr-1.5" /> Add Product
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={`/admin/products/${product.id}/edit`}>
          <Pencil className="h-3.5 w-3.5" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        disabled={deleting}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
