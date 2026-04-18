import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { AnimationProvider } from "@/components/providers/AnimationProvider";
import { NavigationProgress } from "@/components/shared/NavigationProgress";

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
  title: {
    default: "Treyfa — Natural & Herbal Beauty",
    template: "%s | Treyfa",
  },
  description:
    "India's premier herbal hair and skincare brand. Natural, chemical-free beauty essentials rooted in South Indian tradition.",
  keywords: ["herbal skincare", "neem shampoo", "turmeric face wash", "natural beauty", "treyfa"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Treyfa",
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
