"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { AuthError } from "next-auth";
import { sendPasswordResetEmail } from "@/lib/resend";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}

export async function loginUser(formData: FormData): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password" };
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) {
    return { success: false, error: "Invalid email address" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data } });

  // Always return success regardless of whether the account exists, so this
  // endpoint can't be used to enumerate registered emails.
  if (user && user.password) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.verificationToken.deleteMany({ where: { identifier: parsed.data } });
    await prisma.verificationToken.create({
      data: { identifier: parsed.data, token, expires },
    });

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://treyfa.in";
    const resetUrl = `${siteUrl}/reset-password?token=${token}&email=${encodeURIComponent(parsed.data)}`;
    await sendPasswordResetEmail(parsed.data, resetUrl);
  }

  return { success: true };
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<ActionResult> {
  const parsed = z.string().min(6, "Password must be at least 6 characters").safeParse(newPassword);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record || record.expires < new Date()) {
    return { success: false, error: "This reset link is invalid or has expired" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data, 12);

  await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } });

  return { success: true };
}
