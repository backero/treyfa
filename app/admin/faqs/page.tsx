import { getAllFaqsAdmin } from "@/actions/faq";
import { AdminFaqActionsHeader, AdminFaqActions } from "@/components/admin/AdminFaqActions";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ Management" };

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqsAdmin();

  const groups: { category: string; items: typeof faqs }[] = [];
  for (const faq of faqs) {
    let group = groups.find((g) => g.category === faq.category);
    if (!group) {
      group = { category: faq.category, items: [] };
      groups.push(group);
    }
    group.items.push(faq);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-muted-foreground text-sm mt-1">{faqs.length} total questions</p>
        </div>
        <AdminFaqActionsHeader />
      </div>

      {groups.length === 0 ? (
        <div className="bg-background border border-border rounded-xl py-20 flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">No FAQs yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Add your first question to show it on the public FAQ page.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.category} className="bg-background border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-secondary/30 border-b border-border">
                <h2 className="text-xs font-semibold uppercase tracking-wide">{group.category}</h2>
              </div>
              <table className="w-full">
                <tbody className="divide-y divide-border">
                  {group.items.map((faq) => (
                    <tr key={faq.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-4 py-3 w-10 text-xs text-muted-foreground font-mono">
                        {faq.order}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium line-clamp-1">{faq.question}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{faq.answer}</p>
                      </td>
                      <td className="px-4 py-3 w-28">
                        <Badge variant={faq.isPublished ? "success" : "secondary"}>
                          {faq.isPublished ? "Published" : "Hidden"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right w-16">
                        <AdminFaqActions id={faq.id} isPublished={faq.isPublished} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
