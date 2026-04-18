import { PageTransition } from "@/components/shared/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Treyfa Privacy Policy — how we collect, use, and protect your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect the following types of information when you use our website or make a purchase:",
    list: [
      "Personal Information: Name, email address, phone number, shipping and billing address, and payment details",
      "Transaction Data: Order history, refund requests, and shipping details",
      "Usage Data: IP address, browser type, device information, and website interaction patterns",
      "Marketing Preferences: Your communication and marketing opt-in choices",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used solely to provide and improve our services:",
    list: [
      "Process and fulfil your orders",
      "Provide customer support and respond to queries",
      "Send order confirmations, tracking updates, and service notifications",
      "Send promotional communications only if you have opted in",
      "Improve website functionality and user experience",
      "Comply with applicable legal obligations",
    ],
  },
  {
    title: "3. Sharing Your Information",
    body: "Treyfa does not sell, rent, or trade your personal information. We may share it only in the following limited circumstances:",
    list: [
      "With logistics and payment partners solely to fulfil your order",
      "With legal authorities when required by applicable law",
      "In the event of a business merger or acquisition, with full notice to you",
    ],
  },
  {
    title: "4. Data Security",
    body: "We implement industry-standard security measures including SSL encryption and access controls to protect your personal data. While we take every precaution, no online transaction is entirely risk-free. We strongly recommend using a strong, unique password for your Treyfa account.",
    list: [],
  },
  {
    title: "5. Cookies & Tracking Technologies",
    body: "Our website uses cookies to improve functionality, analyse user behaviour, and personalise your experience. Cookies do not identify you personally. You can manage or disable cookies through your browser settings, though some site features may be affected.",
    list: [],
  },
  {
    title: "6. Your Rights & Choices",
    body: "As a user, you have the following rights regarding your personal data:",
    list: [
      "Access and review the personal data we hold about you",
      "Request corrections to inaccurate information",
      "Request deletion of your personal data",
      "Opt out of marketing communications at any time",
      "Request portability of your data",
    ],
  },
  {
    title: "7. Third-Party Links",
    body: "Our website may contain links to third-party websites. Treyfa is not responsible for the privacy practices or content of those external sites. We recommend reviewing the privacy policy of any site you visit.",
    list: [],
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Updates will be posted on this page with a revised effective date. Continued use of our website after any change constitutes your acceptance of the revised policy.",
    list: [],
  },
  {
    title: "9. Contact Us",
    body: "For questions, concerns, or requests related to your personal data or this Privacy Policy, please contact:",
    list: [
      "Email: treyfaacc@gmail.com",
      "Address: 42, Interflex Complex, Trichy Road, Coimbatore — 641402, Tamil Nadu, India",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24 max-w-3xl">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-10 border-l-2 border-border pl-4">
          Treyfa (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and safeguard data when you visit our website or make a purchase.
        </p>

        <div className="space-y-8">
          {sections.map(({ title, body, list }) => (
            <div key={title}>
              <h2 className="font-semibold text-sm mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              {list.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/30 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
