import { PageTransition } from "@/components/shared/PageTransition";
import { getLegalPage } from "@/actions/legal";
import { Package, Truck, RefreshCw, Mail, Clock, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Shipping Policy",
  description: "Treyfa Refund and Shipping Policy — hassle-free returns and fast delivery across India.",
  keywords: ["treyfa refund policy", "treyfa shipping policy"],
};

const ICON_MAP: Record<string, LucideIcon> = {
  package: Package,
  truck: Truck,
  refresh: RefreshCw,
  mail: Mail,
  clock: Clock,
  shield: ShieldCheck,
};

export default async function RefundShippingPage() {
  const page = await getLegalPage("refund-shipping-policy");
  if (!page) return null;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24 max-w-3xl">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-3">{page.heroLabel}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{page.title}</h1>
          <p className="text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>
        </div>

        {page.intro && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 border-l-2 border-border pl-4">
            {page.intro}
          </p>
        )}

        {/* Quick summary cards */}
        {page.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {page.stats.map((stat) => {
              const Icon = ICON_MAP[stat.icon] ?? Package;
              return (
                <div key={stat.id} className="rounded-xl border border-border bg-secondary/20 p-4 text-center">
                  <Icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-base font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{stat.label}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-8">
          {page.sections.map((section) =>
            section.title === "Questions about your order?" ? (
              <div key={section.id} className="rounded-xl bg-secondary/30 border border-border p-6">
                <p className="font-semibold text-sm mb-1">{section.title}</p>
                <div className="legal-content" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            ) : (
              <div key={section.id}>
                <h2 className="text-xl font-bold mb-5 pb-3 border-b border-border">{section.title}</h2>
                <div className="legal-content" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            )
          )}
        </div>
      </div>
    </PageTransition>
  );
}
