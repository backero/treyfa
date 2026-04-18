"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectWishlistItems, setWishlistItems, removeFromWishlist } from "@/store/wishlistSlice";
import { addToCart } from "@/store/cartSlice";
import { getWishlistItems } from "@/actions/wishlist";
import { removeFromWishlist as removeAction } from "@/actions/wishlist";
import { addToCart as addToCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);

  useEffect(() => {
    getWishlistItems().then((wishlistItems) => {
      dispatch(
        setWishlistItems(
          wishlistItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            comparePrice: item.product.comparePrice,
            image: item.product.images[0] ?? "",
          }))
        )
      );
    });
  }, [dispatch]);

  async function handleRemove(productId: string) {
    await removeAction(productId);
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist");
  }

  async function handleAddToCart(item: (typeof items)[0]) {
    const result = await addToCartAction(item.productId, 1);
    if (result.success) {
      dispatch(
        addToCart({
          id: item.productId,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          stock: 99,
        })
      );
      toast.success("Added to cart");
    } else {
      toast.error(result.error ?? "Failed to add to cart");
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="space-y-4">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mx-auto">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
          <p className="text-muted-foreground">Save your favorite items here</p>
          <Button asChild className="mt-4">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Wishlist ({items.length})</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative"
            >
              <Link href={`/product/${item.productId}`} className="block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      className="w-full h-9 text-xs rounded-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(item);
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                    {item.comparePrice && item.comparePrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <button
                onClick={() => handleRemove(item.productId)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-destructive hover:text-white transition-all duration-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
