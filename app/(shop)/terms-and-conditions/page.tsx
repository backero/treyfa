import { PageTransition } from "@/components/shared/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Treyfa Terms and Conditions — rules governing website use and product purchases.",
};

const sections = [
  {
    title: "1. Product & Pricing",
    body: "All product prices listed on this website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change without prior notice. While we make every effort to ensure accuracy, Treyfa is not responsible for any typographical errors or inaccuracies in product listings, descriptions, or pricing.",
  },
  {
    title: "2. Orders",
    body: "By placing an order, you confirm that all information provided is accurate and complete. Treyfa reserves the right to refuse or cancel any order at its sole discretion — including in cases of suspected fraud, pricing errors, or product unavailability. Payment must be made through our secure payment gateway before an order is confirmed and processed.",
  },
  {
    title: "3. Shipping & Delivery",
    body: "Products are shipped within India. International shipping options may be available on request — please contact us at info@treyfa.in for details. Delivery timeframes provided at checkout are estimates only. Treyfa is not responsible for delays caused by third-party logistics providers, natural events, or circumstances beyond our control.",
  },
  {
    title: "4. Returns & Refunds",
    body: "Only defective or damaged products qualify for return within 7 days of delivery. Opened or used products are not eligible for returns due to hygiene reasons. To initiate a return, contact our support team within the specified window. Refunds are processed to the original payment method within 2 business days of product verification.",
  },
  {
    title: "5. User Conduct",
    body: "You agree to use this website only for lawful purposes. Fraudulent activity, including chargebacks without valid cause, misrepresentation of identity, or unauthorized resale of Treyfa products, is strictly prohibited and may result in account termination and legal action.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content on this website — including text, images, logos, product photographs, and design elements — is the exclusive property of Treyfa and is protected by applicable intellectual property laws. Unauthorized reproduction, distribution, or use of any content without prior written consent is prohibited.",
  },
  {
    title: "7. Disclaimer of Liability",
    body: "Treyfa is not liable for any allergic reactions or adverse effects resulting from product use. All products are formulated with natural ingredients; however, individual reactions may vary. We strongly recommend performing a patch test before first use. Users with known skin conditions or allergies should consult a dermatologist prior to use.",
  },
  {
    title: "8. Privacy",
    body: "Customer data is collected and used in accordance with our Privacy Policy. We do not sell or share your personal information with third parties without your consent, except as required by law or to facilitate your order (e.g., with our logistics partners).",
  },
  {
    title: "9. Governing Law & Disputes",
    body: "These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or your use of this website shall be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu, India. We encourage resolution through direct communication before escalation.",
  },
  {
    title: "10. Contact",
    body: "For any questions regarding these Terms and Conditions, please contact us at info@treyfa.in or call +91 89034 12061.",
  },
];

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24 max-w-3xl">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-10 border-l-2 border-border pl-4">
          By accessing and using the Treyfa website and purchasing our products, you accept and agree to be bound by these Terms and Conditions. Please read them carefully before placing an order.
        </p>

        <div className="space-y-8">
          {sections.map(({ title, body }) => (
            <div key={title}>
              <h2 className="font-semibold text-sm mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
