"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, setCartItems, clearCart } from "@/store/cartSlice";
import { getCartItems } from "@/actions/cart";
import { getUserAddresses, createOrder } from "@/actions/order";
import { AddressForm } from "@/components/shop/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import Image from "next/image";
import { MapPin, Check, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Address } from "@prisma/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Step = "address" | "review" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

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

    getUserAddresses().then((addrs) => {
      setAddresses(addrs);
      const defaultAddr = addrs.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    });

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, [dispatch]);

  async function handlePayment() {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setProcessing(true);

    try {
      const result = await createOrder(selectedAddress);
      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to create order");
        setProcessing(false);
        return;
      }

      const { razorpayOrderId, amount, orderId } = result.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Treyfa",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            dispatch(clearCart());
            toast.success("Order placed successfully!");
            router.push("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: addresses.find((a) => a.id === selectedAddress)?.name,
          contact: addresses.find((a) => a.id === selectedAddress)?.phone,
        },
        theme: { color: "#09090b" },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  }

  function handleAddressSuccess(id: string) {
    getUserAddresses().then((addrs) => {
      setAddresses(addrs);
      setSelectedAddress(id);
      setShowAddressForm(false);
      setStep("review");
    });
  }

  const selectedAddr = addresses.find((a) => a.id === selectedAddress);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {(["address", "review", "payment"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === s
                  ? "bg-foreground text-background"
                  : i < ["address", "review", "payment"].indexOf(step)
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < ["address", "review", "payment"].indexOf(step) ? (
                <Check className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            <span className="ml-2 text-sm capitalize hidden sm:inline">{s}</span>
            {i < 2 && <Separator className="mx-3 w-8" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Step */}
          {step === "address" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Delivery Address
              </h2>

              {addresses.length > 0 && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? "border-foreground bg-secondary/30"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{addr.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {addr.line1}, {addr.line2 && `${addr.line2}, `}
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                        {addr.isDefault && <Badge variant="secondary" className="text-[10px]">Default</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showAddressForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowAddressForm(true)}
                  className="w-full"
                >
                  + Add New Address
                </Button>
              ) : (
                <div className="border border-border rounded-xl p-4">
                  <h3 className="font-medium text-sm mb-4">New Address</h3>
                  <AddressForm onSuccess={handleAddressSuccess} />
                </div>
              )}

              {selectedAddress && (
                <Button className="w-full" onClick={() => setStep("review")}>
                  Continue to Review
                </Button>
              )}
            </motion.div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="font-semibold">Review Order</h2>
              {selectedAddr && (
                <div className="p-4 border border-border rounded-xl bg-secondary/20">
                  <p className="text-xs font-medium text-muted-foreground mb-1">DELIVERING TO</p>
                  <p className="text-sm font-medium">{selectedAddr.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAddr.line1}, {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("address")}>
                  Back
                </Button>
                <Button className="flex-1" onClick={() => setStep("payment")}>
                  Proceed to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment
              </h2>
              <div className="p-6 border border-border rounded-xl text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
                  <CreditCard className="h-7 w-7" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click below to pay securely via Razorpay. Supports UPI, Cards, NetBanking & more.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("review")} disabled={processing}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handlePayment} disabled={processing}>
                    {processing ? "Processing..." : `Pay ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-secondary/30 rounded-2xl p-5 space-y-4 sticky top-24">
            <h3 className="font-semibold">Order Summary</h3>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
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
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
