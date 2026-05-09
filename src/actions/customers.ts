"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export async function getCustomers() {
  return prisma.customer.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

export async function createCustomer(data: { name: string; email?: string; phone?: string }) {
  const parsed = CustomerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const customer = await prisma.customer.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/configuracoes");
  revalidatePath("/financeiro");
  return { success: true, data: customer };
}

export async function updateCustomer(
  id: string,
  data: { name: string; email?: string; phone?: string }
) {
  const parsed = CustomerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/configuracoes");
  return { success: true, data: customer };
}

export async function deleteCustomer(id: string) {
  await prisma.customer.update({
    where: { id },
    data: { active: false },
  });
  revalidatePath("/configuracoes");
  return { success: true };
}
