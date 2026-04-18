"use client";

import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";

const reels = [
  { id: "DV_I2s-kwAO" },
  { id: "DRW7uwAEyRe" },
  { id: "DVTTmUhkw0s" },
  { id: "DVLsAYIEwCW" },
];

export function InstagramSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 md:mb-10"
        >
          <div className="flex items-center gap-2.5">
            <Instagram className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">@treyfa_naturalcare</span>
          </div>

          <a
            href="https://instagram.com/treyfa_naturalcare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Follow us <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>

        {/* Reels grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {reels.map(({ id }, i) => (
            <motion.a
              key={id}
              href={`https://www.instagram.com/reel/${id}/`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl bg-secondary"
              style={{ paddingBottom: "177.78%" }}
            >
              <iframe
                src={`https://www.instagram.com/reel/${id}/embed/`}
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                scrolling="no"
                loading="lazy"
                title={`Instagram reel ${id}`}
              />
              {/* Redirect overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2.5">
                  <ExternalLink className="h-4 w-4 text-gray-900" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
