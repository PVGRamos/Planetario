"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SupplierSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export async function getSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createSupplier(data: { name: string; email?: string; phone?: string }) {
  const parsed = SupplierSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supplier = await prisma.supplier.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/configuracoes");
  revalidatePath("/financeiro");
  return { success: true, data: supplier };
}

export async function updateSupplier(
  id: string,
  data: { name: string; email?: string; phone?: string; active?: boolean }
) {
  const parsed = SupplierSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      active: data.active ?? true,
    },
  });
  revalidatePath("/configuracoes");
  return { success: true, data: supplier };
}

export async function deleteSupplier(id: string) {
  await prisma.supplier.update({
    where: { id },
    data: { active: false },
  });
  revalidatePath("/configuracoes");
  return { success: true };
}
