"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { X, Plus, Upload, Loader2 } from "lucide-react";

// Sanity cap on the original file before we even try to compress it (avoids hanging
// the browser on something absurd) — the real size limit is enforced after compression.
const MAX_SOURCE_BYTES = 25 * 1024 * 1024; // 25MB
// Cloudinary uploads go through Vercel's serverless request body limit (~4.5MB), and
// base64-encoding a file inflates it by ~33% — so the compressed image must stay well
// under that after encoding. Phone camera photos routinely land in the 3-10MB range,
// which is why every upload gets resized/re-encoded client-side first.
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.82;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported on this browser"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Image compression failed"))),
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image file"));
    };
    img.src = objectUrl;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

type Props = {
  categories: Category[];
  product?: Product;
  onSuccess?: () => void;
  redirectOnSuccess?: string;
};

export function ProductForm({ categories, product, onSuccess, redirectOnSuccess }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addImage() {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  }

  function removeImage(url: string) {
    setImages(images.filter((img) => img !== url));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const oversized = files.find((f) => f.size > MAX_SOURCE_BYTES);
    if (oversized) {
      toast.error(`${oversized.name} is too large (max 25MB).`);
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const compressed = await compressImage(file);
        const dataUrl = await blobToDataUrl(compressed);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        uploaded.push(data.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(uploaded.length > 1 ? `${uploaded.length} images uploaded` : "Image uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
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
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      } else {
        onSuccess?.();
      }
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
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" defaultValue={product?.tags.join(", ")} placeholder="tag1, tag2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ingredients">Key Ingredients (comma-separated)</Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            rows={2}
            defaultValue={product?.ingredients.join(", ")}
            placeholder="Neem Extract, Coconut Oil, Aloe Vera"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="benefits">Benefits (comma-separated)</Label>
          <Textarea
            id="benefits"
            name="benefits"
            rows={2}
            defaultValue={product?.benefits.join(", ")}
            placeholder="Reduces hair fall, Strengthens roots"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Product Images</Label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload from device"}
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">or paste an image URL:</span>
        </div>
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
