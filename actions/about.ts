"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AboutStatInput = { value: string; label: string };
export type AboutStandardInput = { title: string; desc: string };
export type AboutRnDStageInput = { title: string; desc: string };
export type AboutTimelineInput = { year: string; event: string };

export async function getAboutPage() {
  return prisma.aboutPage.findFirst({
    include: {
      stats: { orderBy: { order: "asc" } },
      standards: { orderBy: { order: "asc" } },
      rndStages: { orderBy: { order: "asc" } },
      timeline: { orderBy: { order: "asc" } },
    },
  });
}

export async function updateAboutPage(data: {
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  missionLabel: string;
  missionTitle: string;
  missionSubtitle: string;
  missionParagraph1: string;
  missionParagraph2: string;
  standardLabel: string;
  standardTitle: string;
  rndLabel: string;
  rndTitle: string;
  rndQuote: string;
  timelineLabel: string;
  timelineTitle: string;
  hqCity: string;
  hqState: string;
  hqCaption: string;
  manufacturingLine1: string;
  manufacturingLine2: string;
  stats: AboutStatInput[];
  standards: AboutStandardInput[];
  rndStages: AboutRnDStageInput[];
  timeline: AboutTimelineInput[];
}) {
  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.aboutPage.findFirst({ select: { id: true } });

      const scalarData = {
        heroLabel: data.heroLabel,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroDescription: data.heroDescription,
        missionLabel: data.missionLabel,
        missionTitle: data.missionTitle,
        missionSubtitle: data.missionSubtitle,
        missionParagraph1: data.missionParagraph1,
        missionParagraph2: data.missionParagraph2,
        standardLabel: data.standardLabel,
        standardTitle: data.standardTitle,
        rndLabel: data.rndLabel,
        rndTitle: data.rndTitle,
        rndQuote: data.rndQuote,
        timelineLabel: data.timelineLabel,
        timelineTitle: data.timelineTitle,
        hqCity: data.hqCity,
        hqState: data.hqState,
        hqCaption: data.hqCaption,
        manufacturingLine1: data.manufacturingLine1,
        manufacturingLine2: data.manufacturingLine2,
      };

      const page = existing
        ? await tx.aboutPage.update({ where: { id: existing.id }, data: scalarData })
        : await tx.aboutPage.create({ data: scalarData });

      await tx.aboutStat.deleteMany({ where: { aboutPageId: page.id } });
      if (data.stats.length > 0) {
        await tx.aboutStat.createMany({
          data: data.stats.map((s, i) => ({ aboutPageId: page.id, value: s.value, label: s.label, order: i })),
        });
      }

      await tx.aboutStandard.deleteMany({ where: { aboutPageId: page.id } });
      if (data.standards.length > 0) {
        await tx.aboutStandard.createMany({
          data: data.standards.map((s, i) => ({ aboutPageId: page.id, title: s.title, desc: s.desc, order: i })),
        });
      }

      await tx.aboutRnDStage.deleteMany({ where: { aboutPageId: page.id } });
      if (data.rndStages.length > 0) {
        await tx.aboutRnDStage.createMany({
          data: data.rndStages.map((s, i) => ({ aboutPageId: page.id, title: s.title, desc: s.desc, order: i })),
        });
      }

      await tx.aboutTimelineEvent.deleteMany({ where: { aboutPageId: page.id } });
      if (data.timeline.length > 0) {
        await tx.aboutTimelineEvent.createMany({
          data: data.timeline.map((s, i) => ({ aboutPageId: page.id, year: s.year, event: s.event, order: i })),
        });
      }
    });

    revalidatePath("/about");
    revalidatePath("/admin/pages");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save About page." };
  }
}
