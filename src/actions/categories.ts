"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { TransactionType } from "@prisma/client";

const CategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export async function getCategories() {
  return prisma.category.findMany({
    include: { subcategories: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoriesByType(type: TransactionType) {
  return prisma.category.findMany({
    where: { type },
    include: { subcategories: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: { name: string; type: "INCOME" | "EXPENSE" }) {
  const parsed = CategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const category = await prisma.category.create({ data: { name: parsed.data.name, type: parsed.data.type } });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true, data: { ...category, subcategories: [] } };
}

export async function updateCategory(id: string, data: { name: string }) {
  const parsed = z.object({ name: z.string().min(1) }).safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const category = await prisma.category.update({ where: { id }, data: { name: parsed.data.name } });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true, data: category };
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true };
}

export async function createSubcategory(data: { name: string; categoryId: string }) {
  const parsed = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    categoryId: z.string().min(1),
  }).safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const subcategory = await prisma.subcategory.create({ data: { name: parsed.data.name, categoryId: parsed.data.categoryId } });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true, data: subcategory };
}

export async function updateSubcategory(id: string, data: { name: string }) {
  const parsed = z.object({ name: z.string().min(1) }).safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  await prisma.subcategory.update({ where: { id }, data: { name: parsed.data.name } });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true };
}

export async function deleteSubcategory(id: string) {
  await prisma.subcategory.delete({ where: { id } });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true };
}
