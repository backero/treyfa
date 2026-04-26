import { getAllBlogsAdmin } from "@/actions/blog";
import { AdminBlogActionsHeader, AdminBlogActions } from "@/components/admin/AdminBlogActions";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog Management" };

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">{blogs.length} total posts</p>
        </div>
        <AdminBlogActionsHeader />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">POST</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CATEGORY</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">DATE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      {blog.coverImage && (
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          width={64}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{blog.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">/blog/{blog.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-xs">{blog.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={blog.isPublished ? "success" : "secondary"}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminBlogActions
                    id={blog.id}
                    slug={blog.slug}
                    isPublished={blog.isPublished}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blogs.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">No blog posts yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">Create your first post to publish to the journal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
