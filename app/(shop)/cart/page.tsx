"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, setCartItems } from "@/store/cartSlice";
import { CartItemCard } from "@/components/shop/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartItems } from "@/actions/cart";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);

  useEffect(() => {
    getCartItems().then((cartItems) => {
      dispatch(
        setCartItems(
          cartItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images[0] ?? "",
            quantity: item.quantity,
            size: item.size ?? undefined,
            color: item.color ?? undefined,
            stock: item.product.stock,
          }))
        )
      );
    });
  }, [dispatch]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? SHIPPING_COST : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add products to start shopping</p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/30 rounded-2xl p-6 space-y-4 sticky top-24"
          >
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-100 rounded-lg p-2">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button className="w-full h-11" asChild>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
