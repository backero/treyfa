"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/store/cartSlice";
import { selectWishlistCount } from "@/store/wishlistSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, User, Menu, X, LogOut, Package, LayoutDashboard,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/products", label: "Shop"    },
  { href: "/about",    label: "About"   },
  { href: "/blog",     label: "Blog"    },
  { href: "/contact",  label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const cartCount     = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname  = usePathname();
  const pillRef   = useRef<HTMLDivElement>(null);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  return (
    <>
      {/* ── Centered floating pill — auto-width on all screens ── */}
      <motion.header
        ref={pillRef as any}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        style={{ width: "max-content", maxWidth: "calc(100vw - 2rem)" }}
      >
        {/* ── Pill bar ── */}
        <div
          className={cn(
            "flex items-center gap-1.5 md:gap-2 rounded-xl px-2 py-1.5 md:px-3 md:py-2 transition-all duration-300",
            scrolled
              ? "bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              : "bg-white/85 backdrop-blur-xl border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 px-1.5 md:px-2">
            <Image
              src="/logo.png"
              alt="Treyfa"
              width={72}
              height={28}
              className="object-contain h-7 w-auto md:h-8"
              priority
            />
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-black/[0.08] hidden sm:block" />

          {/* Nav links — visible sm+ */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                  pathname === link.href
                    ? "bg-black/[0.08] text-black"
                    : "text-black/55 hover:text-black hover:bg-black/[0.05]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-px h-5 bg-black/[0.08] hidden sm:block" />

          {/* Action icons */}
          <div className="flex items-center gap-0.5">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors"
            >
              <Heart className="h-[16px] w-[16px] text-black/70" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-black text-white rounded-full text-[8px] flex items-center justify-center font-bold leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors"
            >
              <ShoppingCart className="h-[16px] w-[16px] text-black/70" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-black text-white rounded-full text-[8px] flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User (desktop) */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors">
                    <User className="h-[16px] w-[16px] text-black/70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders"><Package className="h-4 w-4 mr-2" />My Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" />Admin Panel</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="ml-1 hidden sm:flex items-center rounded-full h-8 px-3.5 text-[13px] font-semibold bg-black text-white hover:bg-black/85 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger — only visible below sm */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="sm:hidden h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] transition-colors ml-0.5"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-4 w-4 text-black/80" />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-4 w-4 text-black/80" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown — below the pill ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{   opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 -translate-x-1/2 mt-2 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                minWidth: "220px",
                width: "max-content",
              }}
            >
              {/* Nav links */}
              <div className="p-2 space-y-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors"
                      style={
                        pathname === link.href
                          ? { backgroundColor: "#111111", color: "#ffffff" }
                          : { color: "#111111" }
                      }
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "#f0f0f0", margin: "0 12px" }} />

              {/* Auth row */}
              <div className="p-2">
                {session ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors text-left"
                    style={{ color: "#ef4444" }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl py-2.5 text-[14px] font-semibold transition-colors"
                    style={{ backgroundColor: "#111111", color: "#ffffff" }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
