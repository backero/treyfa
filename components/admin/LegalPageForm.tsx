"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertLegalPage, type LegalSectionInput, type LegalStatInput } from "@/actions/legal";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { LegalPage, LegalSection, LegalStat } from "@prisma/client";

const ICON_OPTIONS = ["package", "truck", "refresh", "mail", "clock", "shield"];

type Props = {
  pageKey: string;
  pageLabel: string;
  publicPath: string;
  showStats: boolean;
  legalPage: (LegalPage & { sections: LegalSection[]; stats: LegalStat[] }) | null;
};

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function LegalPageForm({ pageKey, pageLabel, publicPath, showStats, legalPage }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [heroLabel, setHeroLabel] = useState(legalPage?.heroLabel ?? "Legal");
  const [title, setTitle] = useState(legalPage?.title ?? pageLabel);
  const [lastUpdated, setLastUpdated] = useState(legalPage?.lastUpdated ?? "January 2026");
  const [intro, setIntro] = useState(legalPage?.intro ?? "");
  const [sections, setSections] = useState<LegalSectionInput[]>(
    legalPage?.sections.map((s) => ({ title: s.title, body: s.body })) ?? []
  );
  const [stats, setStats] = useState<LegalStatInput[]>(
    legalPage?.stats.map((s) => ({ icon: s.icon, label: s.label, value: s.value })) ?? []
  );

  function updateSection(i: number, patch: Partial<LegalSectionInput>) {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function updateStat(i: number, patch: Partial<LegalStatInput>) {
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await upsertLegalPage(
      pageKey,
      { heroLabel, title, lastUpdated, intro, stats, sections },
      publicPath
    );
    if (result.success) {
      toast.success("Page updated");
      router.push("/admin/pages");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Page basics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Hero Label</Label>
          <Input value={heroLabel} onChange={(e) => setHeroLabel(e.target.value)} placeholder="Legal" />
        </div>
        <div className="space-y-1.5">
          <Label>Last Updated</Label>
          <Input value={lastUpdated} onChange={(e) => setLastUpdated(e.target.value)} placeholder="January 2026" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-1.5">
        <Label>Intro Paragraph</Label>
        <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} placeholder="Optional intro shown below the title…" />
      </div>

      {/* Stats (refund-shipping only) */}
      {showStats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Summary Stat Cards</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStats((prev) => [...prev, { icon: "package", label: "", value: "" }])}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Stat
            </Button>
          </div>
          <div className="space-y-3">
            {stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-start border border-border rounded-lg p-3">
                <Select value={stat.icon} onValueChange={(v) => updateStat(i, { icon: v })}>
                  <SelectTrigger className="w-32 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(i, { label: e.target.value })}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(i, { value: e.target.value })}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive"
                  onClick={() => setStats((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {stats.length === 0 && (
              <p className="text-xs text-muted-foreground">No stat cards yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Sections</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSections((prev) => [...prev, { title: "", body: "" }])}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Section
          </Button>
        </div>
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(i, { title: e.target.value })}
                  placeholder="Section title"
                  className="flex-1 font-medium"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={i === 0}
                  onClick={() => setSections((prev) => reorder(prev, i, i - 1))}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={i === sections.length - 1}
                  onClick={() => setSections((prev) => reorder(prev, i, i + 1))}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-destructive"
                  onClick={() => setSections((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Textarea
                value={section.body}
                onChange={(e) => updateSection(i, { body: e.target.value })}
                rows={6}
                className="font-mono text-xs"
                placeholder="<p>Section content…</p>"
              />
            </div>
          ))}
          {sections.length === 0 && (
            <p className="text-xs text-muted-foreground">No sections yet.</p>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Body supports HTML — use &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;&lt;li&gt;, &lt;ol&gt;&lt;li&gt;, &lt;table&gt;, &lt;a&gt;, &lt;strong&gt;
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Page"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
