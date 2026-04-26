"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const ZOOM = 3;

// Builds a Next.js /_next/image URL so the zoom panel benefits from
// server-side optimization and caching at high resolution.
function nextImageUrl(src: string, width: number, quality = 95): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

type Props = { images: string[]; alt: string };

export function ImageGallery({ images, alt }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering]       = useState(false);
  const [pos, setPos]   = useState({ x: 0.5, y: 0.5 }); // normalised 0–1
  const containerRef    = useRef<HTMLDivElement>(null);

  // Lens half-size as a fraction (lens = 1/ZOOM of the image)
  const half = 1 / (ZOOM * 2);
  const cx = Math.max(half, Math.min(1 - half, pos.x));
  const cy = Math.max(half, Math.min(1 - half, pos.y));

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    });
  }, []);

  const currentSrc = images[selectedIndex] ?? "";

  return (
    /* overflow-visible so the absolute zoom panel can bleed into the right column */
    <div className="flex flex-col gap-3 relative">

      {/* ── Main image ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative aspect-square rounded-2xl overflow-hidden bg-secondary select-none"
        style={{ cursor: isHovering ? "crosshair" : "zoom-in" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image — crossfades on thumbnail change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0"
          >
            {currentSrc && (
              <Image
                src={currentSrc}
                alt={`${alt} ${selectedIndex + 1}`}
                fill
                quality={92}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={selectedIndex === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Lens — box-shadow dims everything outside */}
        {isHovering && (
          <div
            className="absolute pointer-events-none z-10 border-2 border-white/80"
            style={{
              width:     `${(1 / ZOOM) * 100}%`,
              height:    `${(1 / ZOOM) * 100}%`,
              left:      `${cx * 100}%`,
              top:       `${cy * 100}%`,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.25)",
            }}
          />
        )}


        {/* Hint badge */}
        {!isHovering && (
          <div className="hidden md:flex absolute bottom-3 right-3 items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 pointer-events-none">
            <ZoomIn className="h-3 w-3" />
            Hover to zoom
          </div>
        )}
      </div>

      {/* ── Zoom panel — absolute, to the right, desktop only ─ */}
      {/*   Positioned relative to this gallery wrapper.        */}
      {/*   Bleeds into the product-detail column on purpose     */}
      {/*   (same pattern as Flipkart). z-30 keeps it below     */}
      {/*   the fixed navbar (z-50).                            */}
      <AnimatePresence>
        {isHovering && currentSrc && (
          <motion.div
            key="zoom-panel"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{   opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-0 rounded-2xl overflow-hidden border border-black/[0.08] shadow-2xl z-30 hidden lg:block"
            style={{
              /* sits flush right of the main image */
              left:   "calc(100% + 16px)",
              /* same height as the aspect-square image */
              width:  "100%",
              aspectRatio: "1 / 1",
              backgroundImage:    `url(${nextImageUrl(currentSrc, 1920, 95)})`,
              backgroundSize:     `${ZOOM * 100}% ${ZOOM * 100}%`,
              backgroundPosition: `${cx * 100}% ${cy * 100}%`,
              backgroundRepeat:   "no-repeat",
              backgroundColor:    "#f5f5f5",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Thumbnails ──────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                i === selectedIndex
                  ? "border-foreground"
                  : "border-transparent opacity-55 hover:opacity-90"
              )}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                quality={80}
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
