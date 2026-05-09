import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/financeiro/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SerializedTransaction } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentTransactionsProps {
  transactions: SerializedTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Últimos Lançamentos</CardTitle>
        <Link
          href="/financeiro"
          className="text-xs text-primary flex items-center gap-1 font-medium hover:underline"
        >
          Ver todos <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 px-6">
            Nenhum lançamento cadastrado
          </p>
        ) : (
          <div className="divide-y">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-6 py-3 hover:bg-muted/40 transition-colors"
              >
                <div
                  className={`w-[3px] h-9 rounded-full shrink-0 ${
                    tx.type === "INCOME" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate leading-snug">{tx.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tx.category.name}
                    {tx.company ? ` · ${tx.company.name}` : ""}
                    {` · ${formatDate(tx.competencyDate)}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`font-mono text-sm font-bold tabular-nums ${
                      tx.type === "INCOME"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tx.type === "EXPENSE" ? "−" : "+"}
                    {formatCurrency(Number(tx.amount))}
                  </span>
                  <StatusBadge status={tx.status} transactionType={tx.type} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
