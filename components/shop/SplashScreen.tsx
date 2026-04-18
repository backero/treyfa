"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = { onComplete: () => void };

export function SplashScreen({ onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2100);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(20px)" }}
      transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
    >
      {/* Ambient botanical orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.18, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-400 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.14, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-yellow-400 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-200 blur-3xl"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-10"
      >
        <Image
          src="/logo.png"
          alt="Treyfa"
          width={200}
          height={80}
          priority
          className="object-contain"
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 mt-4 text-xs uppercase tracking-[0.35em] text-muted-foreground"
      >
        Pure · Natural · Effective
      </motion.p>

      {/* Progress bar */}
      <div className="absolute bottom-14 w-32 h-px bg-foreground/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ originX: 0 }}
          className="h-full bg-foreground rounded-full"
        />
      </div>
    </motion.div>
  );
}
