"use client";

import { useState } from "react";
import { OrderWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/actions/admin";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";
import { MoreHorizontal, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type Props = { order: OrderWithDetails };

export function AdminOrderActions({ order }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true);
    const result = await updateOrderStatus(order.id, status);
    if (result.success) {
      toast.success(`Order status updated to ${status}`);
      router.refresh();
    } else {
      toast.error("Failed to update status");
    }
    setUpdating(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updating}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Update Status</div>
        <DropdownMenuSeparator />
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className="flex items-center justify-between gap-4"
          >
            <span className="capitalize">{status.toLowerCase().replace("_", " ")}</span>
            {order.status === status && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
