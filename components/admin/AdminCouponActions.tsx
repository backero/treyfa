"use client";

import { useState } from "react";
import { Coupon } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createCoupon, updateCoupon, deleteCoupon } from "@/actions/admin";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = { coupon?: Coupon };

function CouponForm({ coupon, onSuccess }: { coupon?: Coupon; onSuccess: () => void }) {
  const [pending, setPending] = useState(false);
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">(coupon?.discountType ?? "PERCENT");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("discountType", discountType);
    if (coupon) {
      formData.set(
        "isActive",
        String((e.currentTarget.elements.namedItem("isActive") as HTMLInputElement)?.checked ?? true)
      );
    }
    const result = coupon ? await updateCoupon(coupon.id, formData) : await createCoupon(formData);
    if (result.success) {
      toast.success(coupon ? "Coupon updated" : "Coupon created");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to save");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <div className="space-y-2">
        <Label htmlFor="coupon-code">Code *</Label>
        <Input
          id="coupon-code"
          name="code"
          required
          disabled={!!coupon}
          defaultValue={coupon?.code}
          placeholder="e.g. WELCOME10"
          className="uppercase"
        />
      </div>

      <div className="space-y-2">
        <Label>Discount Type *</Label>
        <Select value={discountType} onValueChange={(v) => setDiscountType(v as "PERCENT" | "FIXED")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENT">Percentage off</SelectItem>
            <SelectItem value="FIXED">Fixed amount off</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coupon-value">
          Discount Value * {discountType === "PERCENT" ? "(%)" : "(₹)"}
        </Label>
        <Input
          id="coupon-value"
          name="discountValue"
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={coupon?.discountValue}
        />
      </div>

      {discountType === "PERCENT" && (
        <div className="space-y-2">
          <Label htmlFor="coupon-max">Max Discount Cap (₹, optional)</Label>
          <Input
            id="coupon-max"
            name="maxDiscount"
            type="number"
            min={0}
            step="0.01"
            defaultValue={coupon?.maxDiscount ?? ""}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="coupon-min">Minimum Order Value (₹, optional)</Label>
        <Input
          id="coupon-min"
          name="minOrderValue"
          type="number"
          min={0}
          step="0.01"
          defaultValue={coupon?.minOrderValue ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coupon-limit">Total Usage Limit (optional)</Label>
        <Input
          id="coupon-limit"
          name="usageLimit"
          type="number"
          min={1}
          defaultValue={coupon?.usageLimit ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coupon-expires">Expires On (optional)</Label>
        <Input
          id="coupon-expires"
          name="expiresAt"
          type="date"
          defaultValue={coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : ""}
        />
      </div>

      {coupon && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isActive" defaultChecked={coupon.isActive} className="rounded" />
          <span className="text-sm">Active</span>
        </label>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}

export function AdminCouponActions({ coupon }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    if (!coupon || !confirm("Delete this coupon? This cannot be undone.")) return;
    const result = await deleteCoupon(coupon.id);
    if (result.success) {
      toast.success("Coupon deleted");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete");
    }
  }

  if (!coupon) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Coupon
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Coupon</SheetTitle>
          </SheetHeader>
          <CouponForm onSuccess={() => { setOpen(false); router.refresh(); }} />
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
            <SheetTitle>Edit Coupon</SheetTitle>
          </SheetHeader>
          <CouponForm coupon={coupon} onSuccess={() => { setOpen(false); router.refresh(); }} />
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
