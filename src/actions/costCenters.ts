"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getCostCenters() {
  return prisma.costCenter.findMany({ orderBy: { name: "asc" } });
}

export async function createCostCenter(data: { name: string }) {
  const parsed = z.object({ name: z.string().min(1, "Nome é obrigatório") }).safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };
  const costCenter = await prisma.costCenter.create({ data: { name: parsed.data.name } });
  revalidatePath("/configuracoes");
  return { success: true, data: costCenter };
}

export async function updateCostCenter(id: string, data: { name: string }) {
  const parsed = z.object({ name: z.string().min(1, "Nome é obrigatório") }).safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };
  await prisma.costCenter.update({ where: { id }, data: { name: parsed.data.name } });
  revalidatePath("/configuracoes");
  return { success: true };
}

export async function deleteCostCenter(id: string) {
  await prisma.costCenter.delete({ where: { id } });
  revalidatePath("/configuracoes");
  return { success: true };
}
