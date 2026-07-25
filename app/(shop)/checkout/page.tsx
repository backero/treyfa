"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, setCartItems, clearCart } from "@/store/cartSlice";
import { getCartItems } from "@/actions/cart";
import { getUserAddresses, createCodOrder, createUpiOrder } from "@/actions/order";
import { AddressForm } from "@/components/shop/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD, UPI_ID, UPI_PAYEE_NAME } from "@/lib/utils";
import Image from "next/image";
import { MapPin, Check, CreditCard, Banknote, QrCode, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Address } from "@prisma/client";
import QRCode from "qrcode";

type Step = "address" | "review" | "payment";

function handleRadioKeyDown(e: React.KeyboardEvent, select: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    select();
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("UPI");
  const [upiQr, setUpiQr] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");

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
  }, [dispatch]);

  useEffect(() => {
    if (paymentMethod !== "UPI" || step !== "payment" || total <= 0) return;
    const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
      UPI_PAYEE_NAME
    )}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Treyfa Order")}`;
    QRCode.toDataURL(upiLink, { width: 220, margin: 1 }).then(setUpiQr);
  }, [paymentMethod, step, total]);

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied");
  }

  async function handleUpiOrder() {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!utrNumber.trim()) {
      toast.error("Please enter the UPI transaction / UTR number");
      return;
    }
    setProcessing(true);

    try {
      const result = await createUpiOrder(selectedAddress, utrNumber);
      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to place order");
        setProcessing(false);
        return;
      }
      dispatch(clearCart());
      toast.success("Order placed! We'll confirm your payment shortly.");
      router.push("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
      setProcessing(false);
    }
  }

  async function handleCodOrder() {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setProcessing(true);

    try {
      const result = await createCodOrder(selectedAddress);
      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to place order");
        setProcessing(false);
        return;
      }
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
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
                <div className="space-y-3" role="radiogroup" aria-label="Delivery address">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      role="radio"
                      aria-checked={selectedAddress === addr.id}
                      aria-label={`Deliver to ${addr.name}, ${addr.line1}, ${addr.city}, ${addr.state} - ${addr.pincode}`}
                      tabIndex={0}
                      onClick={() => setSelectedAddress(addr.id)}
                      onKeyDown={(e) => handleRadioKeyDown(e, () => setSelectedAddress(addr.id))}
                      className={`p-4 border rounded-xl cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
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

              <div className="space-y-3" role="radiogroup" aria-label="Payment method">
                <div
                  role="radio"
                  aria-checked={paymentMethod === "UPI"}
                  aria-label="UPI (Scan & Pay) — Pay via Google Pay, PhonePe, Paytm or any UPI app"
                  tabIndex={0}
                  onClick={() => setPaymentMethod("UPI")}
                  onKeyDown={(e) => handleRadioKeyDown(e, () => setPaymentMethod("UPI"))}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                    paymentMethod === "UPI"
                      ? "border-foreground bg-secondary/30"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <QrCode className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">UPI (Scan & Pay)</p>
                    <p className="text-xs text-muted-foreground">Pay via Google Pay, PhonePe, Paytm or any UPI app</p>
                  </div>
                </div>

                <div
                  role="radio"
                  aria-checked={paymentMethod === "COD"}
                  aria-label="Cash on Delivery — Pay in cash when your order arrives"
                  tabIndex={0}
                  onClick={() => setPaymentMethod("COD")}
                  onKeyDown={(e) => handleRadioKeyDown(e, () => setPaymentMethod("COD"))}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                    paymentMethod === "COD"
                      ? "border-foreground bg-secondary/30"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <Banknote className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay in cash when your order arrives</p>
                  </div>
                </div>
              </div>

              {paymentMethod === "UPI" && (
                <div className="p-6 border border-border rounded-xl text-center space-y-3">
                  {upiQr ? (
                    <img src={upiQr} alt="UPI QR Code" className="mx-auto rounded-lg" width={220} height={220} />
                  ) : (
                    <div className="h-[220px] w-[220px] mx-auto bg-secondary animate-pulse rounded-lg" />
                  )}
                  <p className="text-sm text-muted-foreground">Scan with any UPI app, or pay to:</p>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="inline-flex items-center gap-2 text-sm font-medium border rounded-lg px-3 py-1.5 hover:bg-secondary/50 transition-colors"
                  >
                    {UPI_ID} <Copy className="h-3.5 w-3.5" />
                  </button>
                  <div className="text-left space-y-1.5 pt-2">
                    <label htmlFor="utr" className="text-xs font-medium">
                      UPI Transaction / UTR Number
                    </label>
                    <input
                      id="utr"
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 123456789012"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                      Found in your UPI app's payment confirmation screen. We&apos;ll verify this against the payment before confirming your order.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("review")} disabled={processing}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={paymentMethod === "COD" ? handleCodOrder : handleUpiOrder}
                  disabled={processing || (paymentMethod === "UPI" && !utrNumber.trim())}
                >
                  {processing
                    ? "Processing..."
                    : paymentMethod === "COD"
                    ? `Place Order (${formatPrice(total)})`
                    : `I've Paid ${formatPrice(total)}`}
                </Button>
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
