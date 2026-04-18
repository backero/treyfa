"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartSection } from "@/components/shop/AddToCartSection";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Star, Truck, Shield, CheckCircle, Leaf, FlaskConical, Sparkles } from "lucide-react";
import { ProductWithCategory } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "description" | "ingredients" | "benefits";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "description", label: "Description", icon: Sparkles },
  { id: "ingredients", label: "Ingredients", icon: Leaf },
  { id: "benefits", label: "Benefits", icon: FlaskConical },
];

const mockIngredients = [
  "Neem Extract (Azadirachta indica)",
  "Turmeric Root (Curcuma longa)",
  "Coconut Oil (Cocos nucifera)",
  "Aloe Vera Gel",
  "Shea Butter",
  "Vitamin E",
];

const mockBenefits = [
  "Deeply nourishes and hydrates skin",
  "Reduces inflammation and redness",
  "Natural antibacterial protection",
  "Brightens and evens skin tone",
  "Suitable for all skin types",
  "Free from harmful chemicals",
];

type Props = { product: ProductWithCategory };

export function ProductDetailContent({ product }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const discount = calculateDiscount(product.price, product.comparePrice ?? 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="secondary" className="mb-3 text-[10px] uppercase tracking-wider">
          {product.category.name}
        </Badge>
        <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>
      </motion.div>

      <Separator />

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-1"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
              <Badge variant="destructive" className="text-xs">
                {discount}% OFF
              </Badge>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
      </motion.div>

      <Separator />

      {/* Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AddToCartSection product={product} />
      </motion.div>

      {/* Trust signals */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-2.5 pt-1"
      >
        {[
          { icon: Truck, text: "Free delivery on orders over ₹999" },
          { icon: Shield, text: "100% authentic product guarantee" },
          { icon: CheckCircle, text: "Easy 30-day returns" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Icon className="h-4 w-4 text-foreground flex-shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </motion.div>

      <Separator />

      {/* Animated Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Tab nav */}
        <div className="flex gap-1 rounded-xl bg-secondary p-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-background rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon className="h-3.5 w-3.5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {activeTab === "description" && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {activeTab === "ingredients" && (
              <ul className="space-y-2.5">
                {mockIngredients.map((ing, i) => (
                  <motion.li
                    key={ing}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <Leaf className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                    {ing}
                  </motion.li>
                ))}
              </ul>
            )}

            {activeTab === "benefits" && (
              <ul className="space-y-2.5">
                {mockBenefits.map((benefit, i) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Tags */}
      {product.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2 pt-2"
        >
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wider">
              #{tag}
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}
