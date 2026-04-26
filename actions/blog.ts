"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPublishedBlogs() {
  return prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      tags: true,
      publishedAt: true,
    },
  });
}

export async function getBlogBySlug(slug: string) {
  return prisma.blog.findUnique({
    where: { slug, isPublished: true },
  });
}

export async function getRelatedBlogs(category: string, excludeSlug: string) {
  return prisma.blog.findMany({
    where: { isPublished: true, category, slug: { not: excludeSlug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      publishedAt: true,
    },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAllBlogsAdmin() {
  return prisma.blog.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      isPublished: true,
      publishedAt: true,
      coverImage: true,
    },
  });
}

export async function getBlogByIdAdmin(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

export async function createBlog(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slugRaw = (formData.get("slug") as string) || toSlug(title);
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const coverImage = (formData.get("coverImage") as string) || null;
    const category = (formData.get("category") as string) || "Blog";
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const isPublished = formData.get("isPublished") === "true";
    const publishedAt = (formData.get("publishedAt") as string)
      ? new Date(formData.get("publishedAt") as string)
      : new Date();

    await prisma.blog.create({
      data: {
        title,
        slug: slugRaw,
        excerpt,
        content,
        coverImage,
        category,
        tags,
        isPublished,
        publishedAt,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "A blog with this slug already exists." };
    }
    return { success: false, error: "Failed to create blog post." };
  }
}

export async function updateBlog(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slugRaw = (formData.get("slug") as string) || toSlug(title);
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const coverImage = (formData.get("coverImage") as string) || null;
    const category = (formData.get("category") as string) || "Blog";
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const isPublished = formData.get("isPublished") === "true";
    const publishedAt = (formData.get("publishedAt") as string)
      ? new Date(formData.get("publishedAt") as string)
      : undefined;

    await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug: slugRaw,
        excerpt,
        content,
        coverImage,
        category,
        tags,
        isPublished,
        ...(publishedAt && { publishedAt }),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slugRaw}`);
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "A blog with this slug already exists." };
    }
    return { success: false, error: "Failed to update blog post." };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blog = await prisma.blog.findUnique({ where: { id }, select: { slug: true } });
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/blog");
    if (blog) revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete blog post." };
  }
}

export async function toggleBlogPublish(id: string, isPublished: boolean) {
  try {
    await prisma.blog.update({ where: { id }, data: { isPublished } });
    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update publish status." };
  }
}
