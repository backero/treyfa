import { BlogForm } from "@/components/admin/BlogForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Blog Post" };

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold">New Blog Post</h1>
      </div>
      <BlogForm />
    </div>
  );
}
