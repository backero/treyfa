import { getBlogByIdAdmin } from "@/actions/blog";
import { BlogForm } from "@/components/admin/BlogForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Blog Post" };

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogByIdAdmin(id);
  if (!blog) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">/blog/{blog.slug}</p>
      </div>
      <BlogForm blog={blog} />
    </div>
  );
}
