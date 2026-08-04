"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateAboutPage,
  type AboutStatInput,
  type AboutStandardInput,
  type AboutRnDStageInput,
  type AboutTimelineInput,
} from "@/actions/about";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { AboutPage, AboutStat, AboutStandard, AboutRnDStage, AboutTimelineEvent } from "@prisma/client";

type Props = {
  aboutPage:
    | (AboutPage & {
        stats: AboutStat[];
        standards: AboutStandard[];
        rndStages: AboutRnDStage[];
        timeline: AboutTimelineEvent[];
      })
    | null;
};

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function Repeater<T>({
  label,
  items,
  setItems,
  newItem,
  renderItem,
  addLabel,
}: {
  label: string;
  items: T[];
  setItems: (fn: (prev: T[]) => T[]) => void;
  newItem: T;
  renderItem: (item: T, i: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => setItems((prev) => [...prev, newItem])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> {addLabel}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start border border-border rounded-lg p-3">
            <div className="flex-1 space-y-2">
              {renderItem(item, i, (patch) =>
                setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={i === 0}
                onClick={() => setItems((prev) => reorder(prev, i, i - 1))}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={i === items.length - 1}
                onClick={() => setItems((prev) => reorder(prev, i, i + 1))}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground">None yet.</p>}
      </div>
    </div>
  );
}

export function AboutPageForm({ aboutPage }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const [heroLabel, setHeroLabel] = useState(aboutPage?.heroLabel ?? "Our Story");
  const [heroTitle, setHeroTitle] = useState(aboutPage?.heroTitle ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(aboutPage?.heroSubtitle ?? "");
  const [heroDescription, setHeroDescription] = useState(aboutPage?.heroDescription ?? "");

  const [missionLabel, setMissionLabel] = useState(aboutPage?.missionLabel ?? "Who We Are");
  const [missionTitle, setMissionTitle] = useState(aboutPage?.missionTitle ?? "");
  const [missionSubtitle, setMissionSubtitle] = useState(aboutPage?.missionSubtitle ?? "");
  const [missionParagraph1, setMissionParagraph1] = useState(aboutPage?.missionParagraph1 ?? "");
  const [missionParagraph2, setMissionParagraph2] = useState(aboutPage?.missionParagraph2 ?? "");

  const [standardLabel, setStandardLabel] = useState(aboutPage?.standardLabel ?? "No-Compromise Ingredient Policy");
  const [standardTitle, setStandardTitle] = useState(aboutPage?.standardTitle ?? "The Treyfa Clean Beauty Standard");

  const [rndLabel, setRndLabel] = useState(aboutPage?.rndLabel ?? "Formulation Science");
  const [rndTitle, setRndTitle] = useState(aboutPage?.rndTitle ?? "");
  const [rndQuote, setRndQuote] = useState(aboutPage?.rndQuote ?? "");

  const [timelineLabel, setTimelineLabel] = useState(aboutPage?.timelineLabel ?? "Our Journey");
  const [timelineTitle, setTimelineTitle] = useState(aboutPage?.timelineTitle ?? "How It Started");

  const [hqCity, setHqCity] = useState(aboutPage?.hqCity ?? "");
  const [hqState, setHqState] = useState(aboutPage?.hqState ?? "");
  const [hqCaption, setHqCaption] = useState(aboutPage?.hqCaption ?? "Headquarters");
  const [manufacturingLine1, setManufacturingLine1] = useState(aboutPage?.manufacturingLine1 ?? "");
  const [manufacturingLine2, setManufacturingLine2] = useState(aboutPage?.manufacturingLine2 ?? "");

  const [stats, setStats] = useState<AboutStatInput[]>(
    aboutPage?.stats.map((s) => ({ value: s.value, label: s.label })) ?? []
  );
  const [standards, setStandards] = useState<AboutStandardInput[]>(
    aboutPage?.standards.map((s) => ({ title: s.title, desc: s.desc })) ?? []
  );
  const [rndStages, setRndStages] = useState<AboutRnDStageInput[]>(
    aboutPage?.rndStages.map((s) => ({ title: s.title, desc: s.desc })) ?? []
  );
  const [timeline, setTimeline] = useState<AboutTimelineInput[]>(
    aboutPage?.timeline.map((s) => ({ year: s.year, event: s.event })) ?? []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await updateAboutPage({
      heroLabel,
      heroTitle,
      heroSubtitle,
      heroDescription,
      missionLabel,
      missionTitle,
      missionSubtitle,
      missionParagraph1,
      missionParagraph2,
      standardLabel,
      standardTitle,
      rndLabel,
      rndTitle,
      rndQuote,
      timelineLabel,
      timelineTitle,
      hqCity,
      hqState,
      hqCaption,
      manufacturingLine1,
      manufacturingLine2,
      stats,
      standards,
      rndStages,
      timeline,
    });
    if (result.success) {
      toast.success("About page updated");
      router.push("/admin/pages");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Hero */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Hero</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow Label</Label>
            <Input value={heroLabel} onChange={(e) => setHeroLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title Line</Label>
            <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Subtitle Line (italic)</Label>
            <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} rows={2} required />
        </div>
      </section>

      {/* Mission */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Mission</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow Label</Label>
            <Input value={missionLabel} onChange={(e) => setMissionLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title Line</Label>
            <Input value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Subtitle Line (italic)</Label>
            <Input value={missionSubtitle} onChange={(e) => setMissionSubtitle(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Paragraph 1</Label>
          <Textarea value={missionParagraph1} onChange={(e) => setMissionParagraph1(e.target.value)} rows={3} required />
        </div>
        <div className="space-y-1.5">
          <Label>Paragraph 2</Label>
          <Textarea value={missionParagraph2} onChange={(e) => setMissionParagraph2(e.target.value)} rows={3} required />
        </div>

        <Repeater
          label="Stat Tiles"
          items={stats}
          setItems={setStats}
          newItem={{ value: "", label: "" }}
          addLabel="Add Stat"
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-2 gap-2">
              <Input value={item.value} onChange={(e) => update({ value: e.target.value })} placeholder="44+" />
              <Input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Products" />
            </div>
          )}
        />
      </section>

      {/* Clean Beauty Standard */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Clean Beauty Standard</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow Label</Label>
            <Input value={standardLabel} onChange={(e) => setStandardLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Section Title</Label>
            <Input value={standardTitle} onChange={(e) => setStandardTitle(e.target.value)} />
          </div>
        </div>
        <Repeater
          label="Pledge Cards"
          items={standards}
          setItems={setStandards}
          newItem={{ title: "", desc: "" }}
          addLabel="Add Pledge"
          renderItem={(item, _i, update) => (
            <>
              <Input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Zero Parabens" />
              <Textarea value={item.desc} onChange={(e) => update({ desc: e.target.value })} rows={2} placeholder="Description…" />
            </>
          )}
        />
      </section>

      {/* R&D */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">R&amp;D Process</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow Label</Label>
            <Input value={rndLabel} onChange={(e) => setRndLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Section Title</Label>
            <Input value={rndTitle} onChange={(e) => setRndTitle(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Quote</Label>
          <Textarea value={rndQuote} onChange={(e) => setRndQuote(e.target.value)} rows={2} required />
        </div>
        <Repeater
          label="Stages (max 4 — icons are fixed by position)"
          items={rndStages}
          setItems={setRndStages}
          newItem={{ title: "", desc: "" }}
          addLabel="Add Stage"
          renderItem={(item, _i, update) => (
            <>
              <Input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Ingredient Selection" />
              <Textarea value={item.desc} onChange={(e) => update({ desc: e.target.value })} rows={2} placeholder="Description…" />
            </>
          )}
        />
      </section>

      {/* Timeline */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Timeline</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow Label</Label>
            <Input value={timelineLabel} onChange={(e) => setTimelineLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Section Title</Label>
            <Input value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} />
          </div>
        </div>
        <Repeater
          label="Events"
          items={timeline}
          setItems={setTimeline}
          newItem={{ year: "", event: "" }}
          addLabel="Add Event"
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <Input value={item.year} onChange={(e) => update({ year: e.target.value })} placeholder="2026" />
              <Textarea value={item.event} onChange={(e) => update({ event: e.target.value })} rows={2} placeholder="What happened…" />
            </div>
          )}
        />
      </section>

      {/* Location */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Location</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Headquarters Caption</Label>
            <Input value={hqCaption} onChange={(e) => setHqCaption(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>City / State</Label>
            <Input value={hqCity} onChange={(e) => setHqCity(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Sub-caption</Label>
            <Input value={hqState} onChange={(e) => setHqState(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Manufacturing Address — Line 1</Label>
          <Input value={manufacturingLine1} onChange={(e) => setManufacturingLine1(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Manufacturing Address — Line 2</Label>
          <Input value={manufacturingLine2} onChange={(e) => setManufacturingLine2(e.target.value)} required />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save About Page"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
