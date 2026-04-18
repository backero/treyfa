import { PageTransition } from "@/components/shared/PageTransition";
import { Package, Truck, RefreshCw, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Shipping Policy",
  description: "Treyfa Refund and Shipping Policy — hassle-free returns and fast delivery across India.",
};

export default function RefundShippingPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24 max-w-3xl">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Refund & Shipping Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
        </div>

        {/* Quick summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { icon: RefreshCw, label: "Refund Window", value: "3 Days" },
            { icon: Truck, label: "Standard Delivery", value: "2–5 Days" },
            { icon: Package, label: "Free Shipping", value: "Above ₹200" },
            { icon: Mail, label: "Refund Processed", value: "2 Bus. Days" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-secondary/20 p-4 text-center">
              <Icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-base font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* Refund Policy */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-5 pb-3 border-b border-border">Refund Policy</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Our Promise</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Treyfa offers a hassle-free, no-questions-asked refund policy. We stand behind the quality of every product we make. If you are not satisfied, we will make it right.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5">How to Request a Refund</h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center">1</span>
                    Contact us at <a href="mailto:support@treyfa.in" className="underline hover:text-foreground">support@treyfa.in</a> or call <a href="tel:+918903412061" className="underline hover:text-foreground">+91 89034 12061</a> within 3 days of receiving your order.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center">2</span>
                    Ship the product back in its original, unopened packaging. Return shipping costs are the customer&apos;s responsibility.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center">3</span>
                    Once we receive and verify the product, a full refund will be issued to your original payment method within 2 business days.
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Conditions for Refund</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Refund request submitted within 3 days of delivery",
                    "Product returned in original, unused, and sealed packaging",
                    "Proof of purchase / order ID required",
                  ].map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Non-Refundable Items</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Opened or used products (for hygiene reasons)",
                    "Products damaged due to customer misuse",
                    "Requests made after the 3-day window",
                  ].map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 mt-1.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping Policy */}
          <div>
            <h2 className="text-xl font-bold mb-5 pb-3 border-b border-border">Shipping Policy</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Order Processing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Orders are processed within 2 business days of payment confirmation. You will receive an email confirmation once your order is dispatched.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Delivery Options</h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/40">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeframe</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 text-muted-foreground">Standard Shipping</td>
                        <td className="px-4 py-3 text-muted-foreground">2–5 business days</td>
                        <td className="px-4 py-3 text-muted-foreground">Free above ₹200</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-muted-foreground">Express Shipping</td>
                        <td className="px-4 py-3 text-muted-foreground">3–4 business days</td>
                        <td className="px-4 py-3 text-muted-foreground">Additional fee at checkout</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Tracking Your Order</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A tracking link is sent to your registered email and phone number once your order is shipped. Use this to monitor your delivery in real time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Damaged or Missing Items</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If your order arrives damaged or items are missing, contact our support team within 1–3 days of delivery at <a href="mailto:treyfaacc@gmail.com" className="underline hover:text-foreground">treyfaacc@gmail.com</a>. Please include photographs of the damaged packaging for faster resolution.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl bg-secondary/30 border border-border p-6">
            <p className="font-semibold text-sm mb-1">Questions about your order?</p>
            <p className="text-sm text-muted-foreground">
              Email us at <a href="mailto:info@treyfa.in" className="underline hover:text-foreground">info@treyfa.in</a> or call <a href="tel:+919486500671" className="underline hover:text-foreground">+91 94865 00671</a>. We&apos;re available Monday to Saturday, 10AM – 6PM.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
