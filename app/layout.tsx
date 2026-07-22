import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { AnimationProvider } from "@/components/providers/AnimationProvider";
import { NavigationProgress } from "@/components/shared/NavigationProgress";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://treyfa.in";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Treyfa — Natural & Herbal Beauty | Herbal Shampoo, Face Wash & Hair Oil",
    template: "%s | Treyfa",
  },
  description:
    "India's premier herbal hair and skincare brand. Natural, chemical-free neem shampoo, turmeric face wash, hibiscus conditioner and hair oils rooted in South Indian Ayurvedic tradition. Shop online with free shipping over ₹999.",
  keywords: [
    "herbal skincare",
    "neem shampoo",
    "turmeric face wash",
    "natural beauty",
    "hibiscus hair oil",
    "ayurvedic hair care",
    "chemical free shampoo India",
    "herbal cosmetics Coimbatore",
    "treyfa",
  ],
  authors: [{ name: "Treyfa" }],
  creator: "Treyfa",
  publisher: "Treyfa",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Treyfa",
    title: "Treyfa — Natural & Herbal Beauty",
    description:
      "India's premier herbal hair and skincare brand. Natural, chemical-free beauty essentials rooted in South Indian tradition.",
    url: SITE_URL,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Treyfa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Treyfa — Natural & Herbal Beauty",
    description:
      "India's premier herbal hair and skincare brand. Natural, chemical-free beauty essentials rooted in South Indian tradition.",
    images: ["/logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: "Treyfa",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description:
    "India's premier herbal hair and skincare brand offering natural, chemical-free beauty essentials rooted in South Indian Ayurvedic tradition.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "42, Interflex Complex, near 5K Car Care, Trichy Road",
    addressLocality: "Sulur, Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641402",
    addressCountry: "IN",
  },
  telephone: ["+91-9486500671", "+91-8903412061"],
  email: "support@treyfa.in",
  priceRange: "₹₹",
  sameAs: [
    "https://instagram.com/treyfa_naturalcare",
    "https://facebook.com/share/19HrmdnzYW/",
    "https://x.com/TreyfaNatural",
    "https://youtube.com/@treyfa_naturalcare",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Treyfa",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/products?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <SessionProvider session={session}>
          <StoreProvider>
            <NavigationProgress />
            <AnimationProvider>
              {children}
            </AnimationProvider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{ duration: 3000 }}
            />
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
