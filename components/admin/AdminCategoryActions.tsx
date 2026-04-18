"use client";

import { useState } from "react";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  category?: Category & { _count?: { products: number } };
};

export function AdminCategoryActions({ category }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("isActive", String((e.currentTarget.elements.namedItem("isActive") as HTMLInputElement)?.checked ?? true));

    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    if (result.success) {
      toast.success(category ? "Category updated" : "Category created");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to save");
    }
    setPending(false);
  }

  async function handleDelete() {
    if (!category || !confirm("Delete this category?")) return;
    const result = await deleteCategory(category.id);
    if (result.success) {
      toast.success("Category deleted");
      router.refresh();
    }
  }

  if (!category) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" type="url" />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating..." : "Create Category"}
            </Button>
          </form>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required defaultValue={category.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} defaultValue={category.description ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" type="url" defaultValue={category.image ?? ""} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" defaultChecked={category.isActive} />
              <span className="text-sm">Active</span>
            </label>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Updating..." : "Update Category"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
