"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { requestPasswordReset } from "@/actions/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (!result.success) {
        toast.error(result.error ?? "Something went wrong");
        return;
      }
      setSent(true);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
        <div className="mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Treyfa" width={96} height={36} className="object-contain h-9 w-auto" priority />
          </Link>
          <h1 className="text-2xl font-bold mt-6">Forgot password</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {sent
              ? "Check your inbox for a reset link"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {sent ? (
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, we've sent a link to reset your password. The
            link expires in 1 hour.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered your password?{" "}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
