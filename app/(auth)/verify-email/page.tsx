"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { verifyEmail } from "@/actions/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setError("This verification link is invalid.");
      return;
    }
    verifyEmail(email, token).then((result) => {
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error ?? "Verification failed");
      }
    });
  }, [email, token]);

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm font-medium">Your email is verified!</p>
        <Button asChild className="w-full mt-2">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
        <X className="h-6 w-6 text-red-600" />
      </div>
      <p className="text-sm font-medium">{error}</p>
      <Button variant="outline" asChild className="w-full mt-2">
        <Link href="/login">Back to Sign In</Link>
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
        <div className="mb-4">
          <Link href="/">
            <Image src="/logo.png" alt="Treyfa" width={96} height={36} className="object-contain h-9 w-auto" priority />
          </Link>
          <h1 className="text-2xl font-bold mt-6">Email Verification</h1>
        </div>

        <Suspense fallback={<div className="h-32" />}>
          <VerifyEmailStatus />
        </Suspense>
      </div>
    </motion.div>
  );
}
