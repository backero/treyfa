"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

export function NavigationProgress() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const controls = useAnimation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    setVisible(true);
    controls.set({ scaleX: 0, opacity: 1 });
    controls
      .start({ scaleX: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } })
      .then(() =>
        controls.start({ opacity: 0, transition: { duration: 0.35, delay: 0.05 } })
      )
      .then(() => setVisible(false));
  }, [pathname, controls]);

  if (!visible) return null;

  return (
    <motion.div
      style={{ originX: 0 }}
      animate={controls}
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground z-[9999] pointer-events-none"
    />
  );
}
