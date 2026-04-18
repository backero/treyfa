"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductWithCategory } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist, selectIsWishlisted } from "@/store/wishlistSlice";
import { addToCart as addToCartAction } from "@/actions/cart";
import { toggleWishlist } from "@/actions/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  product: ProductWithCategory;
};

export function AddToCartSection({ product }: Props) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (adding || product.stock === 0) return;
    setAdding(true);

    const result = await addToCartAction(product.id, quantity);
    if (result.success) {
      dispatch(
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] ?? "",
          quantity,
          stock: product.stock,
        })
      );
      setAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setAdded(false), 2000);
    } else {
      toast.error(result.error ?? "Failed to add to cart");
    }
    setAdding(false);
  }

  async function handleWishlist() {
    const result = await toggleWishlist(product.id);
    if (result.success) {
      if (result.data?.added) {
        dispatch(
          addToWishlist({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.images[0] ?? "",
          })
        );
        toast.success("Added to wishlist");
      } else {
        dispatch(removeFromWishlist(product.id));
        toast.success("Removed from wishlist");
      }
    } else {
      toast.error(result.error ?? "Please login to save items");
    }
  }

  return (
    <div className="space-y-4">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
          )}
        />
        <span className="text-sm">
          {product.stock === 0
            ? "Out of Stock"
            : product.stock <= 10
            ? `Only ${product.stock} left`
            : "In Stock"}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center gap-1 border border-border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
          <Button
            className="w-full h-12 text-base"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.stock === 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={handleWishlist}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
        </Button>
      </div>
    </div>
  );
}
