"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  LogOut,
  ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight">
          TREYFA
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground text-background font-medium">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sm" asChild>
          <Link href="/">
            <Store className="h-4 w-4" />
            View Store
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
