"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPublishedFaqsGrouped() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });

  const groups: { category: string; items: { q: string; a: string }[] }[] = [];
  for (const faq of faqs) {
    let group = groups.find((g) => g.category === faq.category);
    if (!group) {
      group = { category: faq.category, items: [] };
      groups.push(group);
    }
    group.items.push({ q: faq.question, a: faq.answer });
  }
  return groups;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAllFaqsAdmin() {
  return prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getFaqByIdAdmin(id: string) {
  return prisma.faq.findUnique({ where: { id } });
}

export async function createFaq(formData: FormData) {
  try {
    const category = (formData.get("category") as string) || "General";
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const order = Number(formData.get("order")) || 0;
    const isPublished = formData.get("isPublished") === "true";

    await prisma.faq.create({
      data: { category, question, answer, order, isPublished },
    });

    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create FAQ." };
  }
}

export async function updateFaq(id: string, formData: FormData) {
  try {
    const category = (formData.get("category") as string) || "General";
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const order = Number(formData.get("order")) || 0;
    const isPublished = formData.get("isPublished") === "true";

    await prisma.faq.update({
      where: { id },
      data: { category, question, answer, order, isPublished },
    });

    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update FAQ." };
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete FAQ." };
  }
}

export async function toggleFaqPublish(id: string, isPublished: boolean) {
  try {
    await prisma.faq.update({ where: { id }, data: { isPublished } });
    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update publish status." };
  }
}
