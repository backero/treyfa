"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type LegalSectionInput = { title: string; body: string };
export type LegalStatInput = { icon: string; label: string; value: string };

export async function getLegalPage(key: string) {
  return prisma.legalPage.findUnique({
    where: { key },
    include: {
      stats: { orderBy: { order: "asc" } },
      sections: { orderBy: { order: "asc" } },
    },
  });
}

export async function upsertLegalPage(
  key: string,
  data: {
    heroLabel: string;
    title: string;
    lastUpdated: string;
    intro: string;
    stats: LegalStatInput[];
    sections: LegalSectionInput[];
  },
  publicPath: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      const page = await tx.legalPage.upsert({
        where: { key },
        update: {
          heroLabel: data.heroLabel,
          title: data.title,
          lastUpdated: data.lastUpdated,
          intro: data.intro,
        },
        create: {
          key,
          heroLabel: data.heroLabel,
          title: data.title,
          lastUpdated: data.lastUpdated,
          intro: data.intro,
        },
      });

      await tx.legalStat.deleteMany({ where: { legalPageId: page.id } });
      if (data.stats.length > 0) {
        await tx.legalStat.createMany({
          data: data.stats.map((s, i) => ({
            legalPageId: page.id,
            icon: s.icon,
            label: s.label,
            value: s.value,
            order: i,
          })),
        });
      }

      await tx.legalSection.deleteMany({ where: { legalPageId: page.id } });
      if (data.sections.length > 0) {
        await tx.legalSection.createMany({
          data: data.sections.map((s, i) => ({
            legalPageId: page.id,
            title: s.title,
            body: s.body,
            order: i,
          })),
        });
      }
    });

    revalidatePath(publicPath);
    revalidatePath("/admin/pages");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save page." };
  }
}
