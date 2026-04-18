"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Zap } from "lucide-react";

const features = [
  { icon: Truck,     label: "Free Shipping",         desc: "On orders over ₹999"        },
  { icon: Shield,    label: "Cancer-Free Cosmetics",  desc: "India's 1st certified brand" },
  { icon: RotateCcw, label: "Easy Returns",           desc: "30-day return policy"        },
  { icon: Zap,       label: "Fast Delivery",          desc: "2–5 business days"           },
];

export function FeaturesBar() {
  return (
    <section className="py-10 border-y border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
