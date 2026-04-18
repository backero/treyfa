"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Product } from "@prisma/client";
import { createProduct, updateProduct } from "@/actions/admin";
import { toast } from "sonner";
import Image from "next/image";
import { X, Plus } from "lucide-react";

type Props = {
  categories: Category[];
  product?: Product;
  onSuccess?: () => void;
};

export function ProductForm({ categories, product, onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  function addImage() {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  }

  function removeImage(url: string) {
    setImages(images.filter((img) => img !== url));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    formData.set("images", JSON.stringify(images));
    formData.set("isFeatured", String(isFeatured));
    formData.set("isActive", String(isActive));

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    if (result.success) {
      toast.success(product ? "Product updated" : "Product created");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to save product");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" name="name" required defaultValue={product?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" required rows={4} defaultValue={product?.description} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" name="price" type="number" step="0.01" required defaultValue={product?.price} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comparePrice">Compare Price (₹)</Label>
          <Input id="comparePrice" name="comparePrice" type="number" step="0.01" defaultValue={product?.comparePrice ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input id="stock" name="stock" type="number" required defaultValue={product?.stock ?? 0} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select name="categoryId" defaultValue={product?.categoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" defaultValue={product?.tags.join(", ")} placeholder="tag1, tag2, tag3" />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <Label>Product Images</Label>
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addImage}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((img) => (
              <div key={img} className="relative h-20 w-20 rounded-lg overflow-hidden group">
                <Image src={img} alt="Product" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Featured Product</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
