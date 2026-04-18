"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartItemState } from "@/types";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import { removeFromCart as removeAction, updateCartQuantity } from "@/actions/cart";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  item: CartItemState;
};

export function CartItemCard({ item }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    const result = await removeAction(item.productId);
    if (result.success) {
      dispatch(removeFromCart(item.productId));
      toast.success("Removed from cart");
    }
    setLoading(false);
  }

  async function handleQuantityChange(delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return handleRemove();

    const result = await updateCartQuantity(item.productId, newQty);
    if (result.success) {
      dispatch(updateQuantity({ productId: item.productId, quantity: newQty }));
    } else {
      toast.error(result.error ?? "Failed to update");
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex gap-4 py-5 border-b border-border last:border-0"
    >
      <Link href={`/product/${item.productId}`} className="flex-shrink-0">
        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-secondary">
          {item.image && (
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.productId}`}>
          <h3 className="text-sm font-medium line-clamp-2 hover:underline">{item.name}</h3>
        </Link>
        {(item.size || item.color) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {[item.size, item.color].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 border border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleRemove}
              disabled={loading}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
