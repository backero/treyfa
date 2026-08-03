"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Props = { orderId: string; wasPaidOnline: boolean };

export function CancelOrderButton({ orderId, wasPaidOnline }: Props) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    const result = await cancelOrder(orderId);
    if (result.success) {
      toast.success(wasPaidOnline ? "Order cancelled — refund initiated" : "Order cancelled");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to cancel order");
    }
    setCancelling(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-destructive hover:text-destructive">
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this order?</DialogTitle>
          <DialogDescription>
            {wasPaidOnline
              ? "This will cancel your order and refund your payment to the original payment method. This cannot be undone."
              : "This will cancel your order. This cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep Order</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
