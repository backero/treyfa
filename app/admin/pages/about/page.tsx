import { getAboutPage } from "@/actions/about";
import { AboutPageForm } from "@/components/admin/AboutPageForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit About Page" };

export default async function AdminAboutPage() {
  const aboutPage = await getAboutPage();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Pages
        </Link>
        <h1 className="text-2xl font-bold">About Us</h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">/about</p>
      </div>
      <AboutPageForm aboutPage={aboutPage} />
    </div>
  );
}
