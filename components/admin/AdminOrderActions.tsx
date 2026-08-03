"use client";

import { useState } from "react";
import { OrderWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateOrderStatus, markOrderPaid, updateOrderTracking } from "@/actions/admin";
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
  "REFUNDED",
];

type Props = { order: OrderWithDetails };

export function AdminOrderActions({ order }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [carrier, setCarrier] = useState(order.carrier ?? "");

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true);
    const result = await updateOrderStatus(order.id, status);
    if (result.success) {
      toast.success(`Order status updated to ${status}`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update status");
    }
    setUpdating(false);
  }

  async function handleMarkPaid() {
    setUpdating(true);
    const result = await markOrderPaid(order.id);
    if (result.success) {
      toast.success("Order marked as paid");
      router.refresh();
    } else {
      toast.error("Failed to update payment status");
    }
    setUpdating(false);
  }

  async function handleSaveTracking() {
    setUpdating(true);
    const result = await updateOrderTracking(order.id, trackingNumber.trim(), carrier.trim());
    if (result.success) {
      toast.success("Tracking info saved");
      setTrackingOpen(false);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to save tracking info");
    }
    setUpdating(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updating}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {order.paymentStatus !== "PAID" && order.paymentMethod !== "RAZORPAY" && (
            <>
              <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Payment</div>
              <DropdownMenuItem onClick={handleMarkPaid}>Mark as Paid</DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setTrackingOpen(true)}>
            {order.trackingNumber ? "Edit Tracking Info" : "Add Tracking Info"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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

      <Dialog open={trackingOpen} onOpenChange={setTrackingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shipment Tracking</DialogTitle>
            <DialogDescription>
              Add the courier and tracking number so the customer can see it on their order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. Delhivery, Blue Dart, India Post"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking-number">Tracking Number</Label>
              <Input
                id="tracking-number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 1234567890"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTracking} disabled={updating}>
              {updating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
