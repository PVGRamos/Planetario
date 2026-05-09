import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type OverdueItem = {
  id: string;
  description: string;
  amount: number;
  dueDate: string | null;
  company: string;
  type: string;
  daysOverdue: number;
};

function agingLabel(days: number): string {
  if (days <= 7) return `${days}d`;
  if (days <= 30) return `${Math.round(days / 7)}sem`;
  return `${Math.round(days / 30)}m`;
}

function agingClass(days: number): string {
  if (days <= 7) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
  if (days <= 30) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
}

export function OverdueBills({ data }: { data: OverdueItem[] }) {
  const total = data.reduce((s, t) => s + t.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Contas Vencidas
        </CardTitle>
        <Link href="/financeiro?status=OVERDUE" className="text-xs text-primary flex items-center gap-1 hover:underline font-medium">
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 px-6">
            Nenhuma conta vencida
          </p>
        ) : (
          <>
            <div className="divide-y">
              {data.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-muted/40 transition-colors">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold w-12 justify-center shrink-0 ${agingClass(item.daysOverdue)}`}
                  >
                    +{agingLabel(item.daysOverdue)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.company} · {item.dueDate ? formatDate(item.dueDate) : "—"}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono tabular-nums shrink-0 text-red-600 dark:text-red-400">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            {data.length > 0 && (
              <div className="px-6 py-2.5 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{data.length} conta{data.length !== 1 ? "s" : ""} vencida{data.length !== 1 ? "s" : ""}</span>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 tabular-nums">
                  {formatCurrency(total)}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
