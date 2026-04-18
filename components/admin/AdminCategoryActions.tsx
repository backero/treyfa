"use client";

import { useState } from "react";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  category?: Category & { _count?: { products: number } };
};

function CategoryForm({ category, onSuccess }: { category?: Category; onSuccess: () => void }) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set(
      "isActive",
      String((e.currentTarget.elements.namedItem("isActive") as HTMLInputElement)?.checked ?? true)
    );
    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);
    if (result.success) {
      toast.success(category ? "Category updated" : "Category created");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to save");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <div className="space-y-2">
        <Label htmlFor="cat-name">Name *</Label>
        <Input id="cat-name" name="name" required defaultValue={category?.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cat-desc">Description</Label>
        <Textarea id="cat-desc" name="description" rows={3} defaultValue={category?.description ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cat-image">Image URL</Label>
        <Input id="cat-image" name="image" type="url" defaultValue={category?.image ?? ""} />
      </div>
      {category && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isActive" defaultChecked={category.isActive} className="rounded" />
          <span className="text-sm">Active</span>
        </label>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}

export function AdminCategoryActions({ category }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Category
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Category</SheetTitle>
          </SheetHeader>
          <CategoryForm onSuccess={() => { setOpen(false); router.refresh(); }} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
          </SheetHeader>
          <CategoryForm category={category} onSuccess={() => { setOpen(false); router.refresh(); }} />
        </SheetContent>
      </Sheet>

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
