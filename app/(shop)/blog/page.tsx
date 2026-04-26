import { getPublishedBlogs } from "@/actions/blog";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal — Treyfa",
  description: "Herbal beauty guides, ingredient deep-dives, and expert tips for your skin and hair.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground mb-4">
            Knowledge &amp; Tips
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Treyfa Journal</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Herbal beauty guides, ingredient deep-dives, and expert tips for your skin and hair.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-14 md:py-20">
        {/* Featured post */}
        {posts[0] && (
          <AnimatedSection className="mb-14">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group grid md:grid-cols-2 gap-0 rounded-2xl border border-border bg-background overflow-hidden hover:shadow-lg transition-shadow"
            >
              {posts[0].coverImage && (
                <div className="relative h-56 md:h-72 bg-secondary">
                  <Image
                    src={posts[0].coverImage}
                    alt={posts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-600"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
              )}
              <div className="p-7 md:p-8 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-medium px-2.5 py-0.5 rounded-full bg-foreground text-background">
                    {posts[0].category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(posts[0].publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-snug group-hover:text-foreground/70 transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {posts[0].excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium mt-1">
                  Read Article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </AnimatedSection>
        )}

        {/* Category pills — cosmetic only for now */}
        <AnimatedSection className="flex gap-2 flex-wrap mb-10">
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-default ${
                i === 0
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {cat}
            </span>
          ))}
        </AnimatedSection>

        {/* Grid — remaining posts */}
        {posts.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(1).map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.04}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full rounded-2xl border border-border bg-background overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.coverImage && (
                    <div className="relative h-44 bg-secondary overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {post.category}
                      </span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-foreground/70 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 mt-auto pt-1">
                      Read <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="py-24 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No articles yet</p>
              <p className="text-sm text-muted-foreground mt-1">Check back soon — new guides are on the way.</p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
