"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const SubcategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
});

export async function getSubcategoriesByCategory(categoryId: string) {
  return prisma.subcategory.findMany({
    where: { categoryId },
    orderBy: { name: "asc" },
  });
}

export async function createSubcategory(data: { name: string; categoryId: string }) {
  const parsed = SubcategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  await prisma.subcategory.create({ data: parsed.data });
  revalidatePath("/configuracoes");
  revalidateTag("meta");
  return { success: true };
}

export async function updateSubcategory(id: string, data: { name: string; categoryId: string }) {
  const parsed = SubcategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  await prisma.subcategory.update({ where: { id }, data: parsed.data });
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
