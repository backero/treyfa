import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { isActive: true } });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Create a new product listing</p>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6">
        <ProductForm categories={categories} redirectOnSuccess="/admin/products" />
      </div>
    </div>
  );
}
