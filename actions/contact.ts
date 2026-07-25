"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(formData: FormData): Promise<ActionResult> {
  const name = (formData.get("name") as string ?? "").trim();
  const email = (formData.get("email") as string ?? "").trim();
  const subject = (formData.get("subject") as string ?? "").trim();
  const message = (formData.get("message") as string ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All fields are required" };
  }

  await prisma.contactMessage.create({
    data: { name, email, subject, message },
  });

  revalidatePath("/admin/messages");
  return { success: true };
}
