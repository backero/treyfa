"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, DashboardStats, PaginatedResult, OrderWithDetails } from "@/types";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const [totalRevenue, totalOrders, totalProducts, totalUsers, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    }),
  ]);

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const ordersByMonth = await prisma.order.findMany({
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: sixMonthsAgo },
    },
    select: { total: true, createdAt: true },
  });

  const revenueByMonth: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });
    const revenue = ordersByMonth
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      })
      .reduce((sum, o) => sum + o.total, 0);
    revenueByMonth.push({ month, revenue });
  }

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    revenueByMonth,
  };
}

// Product Management
export async function createProduct(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const data = {
    name,
    slug: slugify(name),
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    comparePrice: formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : undefined,
    stock: parseInt(formData.get("stock") as string),
    sku: (formData.get("sku") as string) || undefined,
    categoryId: formData.get("categoryId") as string,
    images: JSON.parse((formData.get("images") as string) || "[]"),
    tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
    isFeatured: formData.get("isFeatured") === "true",
  };

  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const data: any = {
    name,
    slug: slugify(name),
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string),
    categoryId: formData.get("categoryId") as string,
    images: JSON.parse((formData.get("images") as string) || "[]"),
    tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
    isFeatured: formData.get("isFeatured") === "true",
    isActive: formData.get("isActive") === "true",
  };

  const comparePrice = formData.get("comparePrice");
  if (comparePrice) data.comparePrice = parseFloat(comparePrice as string);

  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/products");
  return { success: true };
}

// Category Management
export async function createCategory(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name") as string;
  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description: (formData.get("description") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
    },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = formData.get("name") as string;
  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description: (formData.get("description") as string) || undefined,
      image: (formData.get("image") as string) || undefined,
      isActive: formData.get("isActive") === "true",
    },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/categories");
  return { success: true };
}

// Order Management
export async function getAllOrders(page = 1, pageSize = 20): Promise<PaginatedResult<OrderWithDetails>> {
  await requireAdmin();

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    }),
    prisma.order.count(),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult> {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

// Customer Management
export async function getAllCustomers(page = 1, pageSize = 20) {
  await requireAdmin();

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true } },
        orders: {
          where: { paymentStatus: "PAID" },
          select: { total: true },
        },
      },
    }),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
