"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress } from "@/actions/order";
import { toast } from "sonner";

type Props = {
  onSuccess: (id: string) => void;
};

export function AddressForm({ onSuccess }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await addAddress(formData);
    if (result.success && result.data) {
      toast.success("Address saved");
      onSuccess(result.data.id);
    } else {
      toast.error(result.error ?? "Failed to save address");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required placeholder="9876543210" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="line1">Address Line 1</Label>
        <Input id="line1" name="line1" required placeholder="House/Flat no, Building, Street" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
        <Input id="line2" name="line2" placeholder="Area, Landmark" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required placeholder="Mumbai" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" required placeholder="Maharashtra" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" name="pincode" required placeholder="400001" maxLength={6} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue="India" readOnly className="bg-muted" />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving..." : "Save & Continue"}
      </Button>
    </form>
  );
}
