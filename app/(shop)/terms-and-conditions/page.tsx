import { PageTransition } from "@/components/shared/PageTransition";
import { getLegalPage } from "@/actions/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Treyfa Terms and Conditions — rules governing website use and product purchases.",
  keywords: ["treyfa terms and conditions"],
};

export default async function TermsPage() {
  const page = await getLegalPage("terms-and-conditions");
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

        <div className="space-y-8">
          {page.sections.map((section) => (
            <div key={section.id}>
              <h2 className="font-semibold text-sm mb-2">{section.title}</h2>
              <div className="legal-content" dangerouslySetInnerHTML={{ __html: section.body }} />
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
