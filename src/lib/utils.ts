import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TransactionWithRelations, SerializedTransaction } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

export function serializeTransaction(tx: TransactionWithRelations): SerializedTransaction {
  return {
    ...tx,
    amount: typeof tx.amount === "number" ? tx.amount : tx.amount.toNumber(),
    competencyDate: tx.competencyDate instanceof Date ? tx.competencyDate.toISOString() : tx.competencyDate,
    dueDate: tx.dueDate instanceof Date ? tx.dueDate.toISOString() : tx.dueDate,
    paymentDate: tx.paymentDate instanceof Date ? tx.paymentDate.toISOString() : tx.paymentDate,
    createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : (tx as unknown as { createdAt: string }).createdAt,
    updatedAt: tx.updatedAt instanceof Date ? tx.updatedAt.toISOString() : (tx as unknown as { updatedAt: string }).updatedAt,
    customerId: tx.customerId ?? null,
    customer: tx.customer ?? null,
    documentRef: tx.documentRef ?? null,
  };
}
