import { getBlogBySlug, getRelatedBlogs } from "@/actions/blog";
import { PageTransition } from "@/components/shared/PageTransition";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post Not Found" };
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: blog.coverImage
      ? { images: [{ url: blog.coverImage }] }
      : undefined,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blog, related] = await Promise.all([
    getBlogBySlug(slug),
    getBlogBySlug(slug).then((b) =>
      b ? getRelatedBlogs(b.category, slug) : []
    ),
  ]);

  if (!blog) notFound();

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PageTransition>
      {/* Cover image hero */}
      {blog.coverImage && (
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-secondary">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={88}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl pb-20">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="secondary">{blog.category}</Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Excerpt */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 border-l-2 border-border pl-4">
          {blog.excerpt}
        </p>

        {/* Divider */}
        <div className="h-px bg-border mb-10" />

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="border-t border-border bg-secondary/20 py-14">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-2">
              Continue Reading
            </p>
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border bg-background overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.coverImage && (
                    <div className="relative h-40 bg-secondary">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      {post.category}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-foreground/70 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
