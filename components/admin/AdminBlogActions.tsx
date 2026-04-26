"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import Link from "next/link";
import { deleteBlog, toggleBlogPublish } from "@/actions/blog";
import { toast } from "sonner";

export function AdminBlogActionsHeader() {
  return (
    <Button asChild size="sm">
      <Link href="/admin/blogs/new">
        <Plus className="h-4 w-4 mr-1.5" /> New Post
      </Link>
    </Button>
  );
}

type RowProps = {
  id: string;
  slug: string;
  isPublished: boolean;
};

export function AdminBlogActions({ id, slug, isPublished }: RowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setLoading(true);
    const res = await deleteBlog(id);
    if (res.success) {
      toast.success("Blog post deleted");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setLoading(false);
  }

  async function handleTogglePublish() {
    setLoading(true);
    const res = await toggleBlogPublish(id, !isPublished);
    if (res.success) {
      toast.success(isPublished ? "Set to draft" : "Published");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed");
    }
    setLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/admin/blogs/${id}/edit`}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/blog/${slug}`} target="_blank">
            <Eye className="h-3.5 w-3.5 mr-2" /> View Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePublish}>
          {isPublished ? (
            <><EyeOff className="h-3.5 w-3.5 mr-2" /> Set as Draft</>
          ) : (
            <><Eye className="h-3.5 w-3.5 mr-2" /> Publish</>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
