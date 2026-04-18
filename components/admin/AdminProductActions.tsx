"use client";

import { useState } from "react";
import { Product, Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { deleteProduct } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  categories: Category[];
  product?: Product;
};

export function AdminProductActions({ categories, product }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
    // Create button
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            categories={categories}
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            categories={categories}
            product={product}
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

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
