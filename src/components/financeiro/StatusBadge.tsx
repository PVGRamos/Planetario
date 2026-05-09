import { Badge } from "@/components/ui/badge";
import type { TransactionStatus, TransactionType } from "@prisma/client";
import { getStatusLabels } from "@/types";

const statusColors: Record<TransactionStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  CANCELED: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
};

const typeConfig: Record<TransactionType, { label: string; className: string }> = {
  INCOME: { label: "Receita", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" },
  EXPENSE: { label: "Despesa", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
};

interface StatusBadgeProps {
  status: TransactionStatus;
  transactionType?: TransactionType;
}

export function StatusBadge({ status, transactionType = "EXPENSE" }: StatusBadgeProps) {
  const labels = getStatusLabels(transactionType);
  return (
    <Badge variant="outline" className={`${statusColors[status]} whitespace-nowrap`}>
      {labels[status]}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: TransactionType }) {
  const { label, className } = typeConfig[type];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
