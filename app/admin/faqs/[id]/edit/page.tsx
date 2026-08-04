import { getFaqByIdAdmin, getAllFaqsAdmin } from "@/actions/faq";
import { FaqForm } from "@/components/admin/FaqForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faq, faqs] = await Promise.all([getFaqByIdAdmin(id), getAllFaqsAdmin()]);
  if (!faq) notFound();

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/faqs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to FAQs
        </Link>
        <h1 className="text-2xl font-bold">Edit FAQ</h1>
      </div>
      <FaqForm faq={faq} categories={categories} />
    </div>
  );
}
