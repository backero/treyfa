"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBlog, updateBlog } from "@/actions/blog";
import { toast } from "sonner";
import Image from "next/image";
import type { Blog } from "@prisma/client";

const CATEGORIES = ["Hair Care", "Skin Care", "Ingredients", "Tips & Guides", "Blog"];

type Props = {
  blog?: Blog;
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function BlogForm({ blog }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!blog);
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? true);
  const [category, setCategory] = useState(blog?.category ?? "Blog");
  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? "");

  useEffect(() => {
    if (!slugManual) setSlug(toSlug(title));
  }, [title, slugManual]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    formData.set("slug", slug);
    formData.set("isPublished", String(isPublished));
    formData.set("category", category);

    const result = blog
      ? await updateBlog(blog.id, formData)
      : await createBlog(formData);

    if (result.success) {
      toast.success(blog ? "Blog post updated" : "Blog post created");
      router.push("/admin/blogs");
    } else {
      toast.error(result.error ?? "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title"
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug *</Label>
        <div className="flex gap-2">
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
            placeholder="url-friendly-slug"
            className="font-mono text-sm"
          />
          {slugManual && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => { setSlug(toSlug(title)); setSlugManual(false); }}
            >
              Auto
            </Button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          /blog/<span className="font-mono">{slug || "…"}</span>
        </p>
      </div>

      {/* Category + Published row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="publishedAt">Publish Date</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={
              blog?.publishedAt
                ? new Date(blog.publishedAt).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10)
            }
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          required
          defaultValue={blog?.excerpt}
          rows={2}
          placeholder="Short description shown on blog listing cards…"
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-1.5">
        <Label htmlFor="coverImage">Cover Image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://…"
        />
        {coverImage && (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border mt-2">
            <Image src={coverImage} alt="Cover preview" fill className="object-cover" sizes="600px" />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={blog?.tags?.join(", ")}
          placeholder="neem, hair care, dandruff"
        />
        <p className="text-[11px] text-muted-foreground">Comma-separated</p>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <Label htmlFor="content">Content (HTML) *</Label>
        <Textarea
          id="content"
          name="content"
          required
          defaultValue={blog?.content}
          rows={20}
          placeholder="<h2>Introduction</h2><p>Your content here…</p>"
          className="font-mono text-sm"
        />
        <p className="text-[11px] text-muted-foreground">
          HTML format — use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;
        </p>
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3 pt-2">
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          {isPublished ? "Published" : "Draft"}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : blog ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
