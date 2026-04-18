"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { ProductWithCategory } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist, selectIsWishlisted } from "@/store/wishlistSlice";
import { toggleWishlist } from "@/actions/wishlist";
import { addToCart as addToCartAction } from "@/actions/cart";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";

type Props = { product: ProductWithCategory };

export function ProductCard({ product }: Props) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const discount = calculateDiscount(product.price, product.comparePrice ?? 0);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    setAddingToCart(true);
    try {
      const result = await addToCartAction(product.id, 1);
      if (result.success) {
        dispatch(
          addToCart({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] ?? "",
            quantity: 1,
            stock: product.stock,
          })
        );
        setCartSuccess(true);
        toast.success("Added to cart");
        setTimeout(() => setCartSuccess(false), 1800);
      } else {
        toast.error(result.error ?? "Failed to add to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    setTogglingWishlist(true);
    try {
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
        toast.error(result.error ?? "Please login to use wishlist");
      }
    } finally {
      setTogglingWishlist(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary shadow-sm group-hover:shadow-md transition-shadow duration-400">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-black text-white text-[10px] font-medium">
              -{discount}%
            </Badge>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover: Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250">
            <Button
              className={cn(
                "w-full h-9 text-xs rounded-xl font-medium transition-all duration-200",
                cartSuccess && "bg-green-600 hover:bg-green-600"
              )}
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              {cartSuccess ? (
                <motion.span
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  ✓ Added!
                </motion.span>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </>
              )}
            </Button>
          </div>

        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1 px-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </p>
          <h3 className="text-sm font-medium line-clamp-2 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <motion.button
        onClick={handleWishlist}
        disabled={togglingWishlist}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-colors duration-200",
          isWishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")} />
      </motion.button>
    </motion.div>
  );
}
