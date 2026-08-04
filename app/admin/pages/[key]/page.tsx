import { getLegalPage } from "@/actions/legal";
import { LegalPageForm } from "@/components/admin/LegalPageForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const PAGE_CONFIG: Record<string, { label: string; publicPath: string; showStats: boolean }> = {
  "privacy-policy": { label: "Privacy Policy", publicPath: "/privacy-policy", showStats: false },
  "terms-and-conditions": { label: "Terms & Conditions", publicPath: "/terms-and-conditions", showStats: false },
  "refund-shipping-policy": { label: "Refund & Shipping Policy", publicPath: "/refund-shipping-policy", showStats: true },
};

export const metadata: Metadata = { title: "Edit Page" };

export default async function AdminLegalPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const config = PAGE_CONFIG[key];
  if (!config) notFound();

  const legalPage = await getLegalPage(key);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Pages
        </Link>
        <h1 className="text-2xl font-bold">{config.label}</h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">{config.publicPath}</p>
      </div>
      <LegalPageForm
        pageKey={key}
        pageLabel={config.label}
        publicPath={config.publicPath}
        showStats={config.showStats}
        legalPage={legalPage}
      />
    </div>
  );
}
