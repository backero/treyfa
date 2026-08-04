"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import Link from "next/link";
import { deleteFaq, toggleFaqPublish } from "@/actions/faq";
import { toast } from "sonner";

export function AdminFaqActionsHeader() {
  return (
    <Button asChild size="sm">
      <Link href="/admin/faqs/new">
        <Plus className="h-4 w-4 mr-1.5" /> New FAQ
      </Link>
    </Button>
  );
}

type RowProps = {
  id: string;
  isPublished: boolean;
};

export function AdminFaqActions({ id, isPublished }: RowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this FAQ? This cannot be undone.")) return;
    setLoading(true);
    const res = await deleteFaq(id);
    if (res.success) {
      toast.success("FAQ deleted");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setLoading(false);
  }

  async function handleTogglePublish() {
    setLoading(true);
    const res = await toggleFaqPublish(id, !isPublished);
    if (res.success) {
      toast.success(isPublished ? "Hidden from FAQ page" : "Published");
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
          <Link href={`/admin/faqs/${id}/edit`}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePublish}>
          {isPublished ? (
            <><EyeOff className="h-3.5 w-3.5 mr-2" /> Hide</>
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
