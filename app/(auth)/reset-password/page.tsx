"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { resetPassword } from "@/actions/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(email, token, password);
      if (!result.success) {
        toast.error(result.error ?? "Failed to reset password");
        return;
      }
      toast.success("Password reset! Please sign in.");
      router.push("/login");
    });
  }

  if (!email || !token) {
    return (
      <p className="text-sm text-muted-foreground">
        This reset link is invalid. Please request a new one from the{" "}
        <Link href="/forgot-password" className="text-foreground font-medium hover:underline">
          forgot password
        </Link>{" "}
        page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            minLength={6}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          placeholder="Re-enter password"
          autoComplete="new-password"
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-bold mt-6">Reset password</h1>
          <p className="text-muted-foreground text-sm mt-1">Choose a new password for your account</p>
        </div>

        <Suspense fallback={<div className="h-32" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </motion.div>
  );
}
