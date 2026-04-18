"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/shop/SplashScreen";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("treyfa-splash")) {
      sessionStorage.setItem("treyfa-splash", "1");
      setShowSplash(true);
    }
  }, []);

  return (
    <>
      {children}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
