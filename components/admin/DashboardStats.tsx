"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DashboardStats } from "@/types";

type Props = {
  stats: DashboardStats;
};

export function DashboardStatsCards({ stats }: Props) {
  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      change: "+12.5%",
      positive: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      change: "+8.2%",
      positive: true,
    },
    {
      label: "Active Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      change: "+3",
      positive: true,
    },
    {
      label: "Customers",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: "+25 this week",
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, change, positive }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-background border border-border rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs mt-0.5 ${positive ? "text-green-600" : "text-red-500"}`}>
              {change} from last month
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
