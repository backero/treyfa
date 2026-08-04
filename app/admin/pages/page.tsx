import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Content" };

const PAGES = [
  { href: "/admin/pages/about", title: "About Us", desc: "Hero, mission, clean beauty standard, R&D process, timeline, location", viewHref: "/about" },
  { href: "/admin/pages/privacy-policy", title: "Privacy Policy", desc: "Sections covering data collection, usage, and your rights", viewHref: "/privacy-policy" },
  { href: "/admin/pages/terms-and-conditions", title: "Terms & Conditions", desc: "Rules governing website use and product purchases", viewHref: "/terms-and-conditions" },
  { href: "/admin/pages/refund-shipping-policy", title: "Refund & Shipping Policy", desc: "Summary stats plus refund and shipping sections", viewHref: "/refund-shipping-policy" },
];

export default function AdminPagesIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Edit static site pages without touching code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex items-start gap-4 rounded-xl border border-border bg-background p-5 hover:border-foreground/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.desc}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-2">{p.viewHref}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
