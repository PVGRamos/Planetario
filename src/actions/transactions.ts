"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { TransactionType, PaymentMethod, TransactionStatus, type Prisma } from "@prisma/client";
import { z } from "zod";

const TransactionSchema = z.object({
  companyId: z.string().min(1, "Empresa é obrigatória"),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  subcategoryId: z.string().optional().nullable(),
  costCenterId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  description: z.string().min(1, "Descrição é obrigatória"),
  documentRef: z.string().optional().nullable(),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(TransactionStatus),
  competencyDate: z.string().min(1, "Data de competência é obrigatória"),
  dueDate: z.string().optional().nullable(),
  paymentDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type TransactionFormData = z.infer<typeof TransactionSchema>;

export async function getTransactions(filters: {
  search?: string;
  companyId?: string;
  type?: string;
  status?: string;
  categoryId?: string;
  subcategoryId?: string;
  costCenterId?: string;
  dateFrom?: string;
  dateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  paymentDateFrom?: string;
  paymentDateTo?: string;
  sortAmount?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: Prisma.TransactionWhereInput = {};

  if (filters.search) {
    where.OR = [
      { description: { contains: filters.search, mode: "insensitive" } },
      { supplier: { name: { contains: filters.search, mode: "insensitive" } } },
      { customer: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }
  if (filters.companyId) where.companyId = filters.companyId;
  if (filters.type) where.type = filters.type as TransactionType;
  if (filters.status) where.status = filters.status as TransactionStatus;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.subcategoryId) where.subcategoryId = filters.subcategoryId;
  if (filters.costCenterId) where.costCenterId = filters.costCenterId;
  if (filters.dateFrom || filters.dateTo) {
    where.competencyDate = {};
    if (filters.dateFrom) where.competencyDate.gte = new Date(filters.dateFrom);
    if (filters.dateTo) {
      const end = new Date(filters.dateTo);
      end.setUTCDate(end.getUTCDate() + 1);
      where.competencyDate.lt = end;
    }
  }
  if (filters.dueDateFrom || filters.dueDateTo) {
    where.dueDate = {};
    if (filters.dueDateFrom) where.dueDate.gte = new Date(filters.dueDateFrom);
    if (filters.dueDateTo) {
      const end = new Date(filters.dueDateTo);
      end.setUTCDate(end.getUTCDate() + 1);
      where.dueDate.lt = end;
    }
  }
  if (filters.paymentDateFrom || filters.paymentDateTo) {
    where.paymentDate = {};
    if (filters.paymentDateFrom) where.paymentDate.gte = new Date(filters.paymentDateFrom);
    if (filters.paymentDateTo) {
      const end = new Date(filters.paymentDateTo);
      end.setUTCDate(end.getUTCDate() + 1);
      where.paymentDate.lt = end;
    }
  }

  const orderBy: Prisma.TransactionOrderByWithRelationInput = filters.sortAmount === "asc" || filters.sortAmount === "desc"
    ? { amount: filters.sortAmount }
    : { competencyDate: "desc" };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        company: true,
        category: true,
        subcategory: true,
        costCenter: true,
        supplier: true,
        customer: true,
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createTransaction(data: TransactionFormData) {
  const parsed = TransactionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const {
    amount, competencyDate, dueDate, paymentDate,
    subcategoryId, costCenterId, supplierId, customerId, documentRef, notes, ...rest
  } = parsed.data;

  await prisma.transaction.create({
    data: {
      ...rest,
      amount,
      competencyDate: new Date(competencyDate),
      dueDate: dueDate ? new Date(dueDate) : null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      subcategoryId: subcategoryId || null,
      costCenterId: costCenterId || null,
      supplierId: supplierId || null,
      customerId: customerId || null,
      documentRef: documentRef || null,
      notes: notes || null,
    },
  });

  revalidatePath("/financeiro");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTransaction(id: string, data: TransactionFormData) {
  const parsed = TransactionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const {
    amount, competencyDate, dueDate, paymentDate,
    subcategoryId, costCenterId, supplierId, customerId, documentRef, notes, ...rest
  } = parsed.data;

  await prisma.transaction.update({
    where: { id },
    data: {
      ...rest,
      amount,
      competencyDate: new Date(competencyDate),
      dueDate: dueDate ? new Date(dueDate) : null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      subcategoryId: subcategoryId || null,
      costCenterId: costCenterId || null,
      supplierId: supplierId || null,
      customerId: customerId || null,
      documentRef: documentRef || null,
      notes: notes || null,
    },
  });

  revalidatePath("/financeiro");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/financeiro");
  revalidatePath("/dashboard");
  return { success: true };
}

const getCachedTransactionMeta = unstable_cache(
  async () => {
    const [companies, categories, costCenters, suppliers, customers] = await Promise.all([
      prisma.company.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({
        include: { subcategories: { orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
      }),
      prisma.costCenter.findMany({ orderBy: { name: "asc" } }),
      prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
      prisma.customer.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    ]);
    return { companies, categories, costCenters, suppliers, customers };
  },
  ["transaction-meta"],
  { revalidate: 300, tags: ["meta"] }
);

export async function getTransactionMeta() {
  return getCachedTransactionMeta();
}
