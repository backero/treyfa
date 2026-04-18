"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@prisma/client";

type Props = {
  categories: (Category & { _count: { products: number } })[];
};

export function CategoryGrid({ categories }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link href={`/products?category=${cat.slug}`} className="group block">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm">{cat.name}</p>
                <p className="text-white/70 text-xs">{cat._count.products} items</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
