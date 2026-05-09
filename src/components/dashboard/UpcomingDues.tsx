import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type DueItem = {
  id: string;
  description: string;
  amount: number;
  dueDate: string | null;
  company: string;
  type: string;
  daysUntilDue: number;
};

function urgencyClass(days: number): string {
  if (days <= 3) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
  if (days <= 7) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
}

function urgencyLabel(days: number): string {
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `${days}d`;
}

export function UpcomingDues({ data }: { data: DueItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          Próximos Vencimentos
        </CardTitle>
        <Link href="/financeiro?status=PENDING" className="text-xs text-primary flex items-center gap-1 hover:underline font-medium">
          Ver todos <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 px-6">
            Nenhum vencimento nos próximos 30 dias
          </p>
        ) : (
          <div className="divide-y">
            {data.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-muted/40 transition-colors">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold w-12 justify-center shrink-0 ${urgencyClass(item.daysUntilDue)}`}
                >
                  {urgencyLabel(item.daysUntilDue)}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.company} · {item.dueDate ? formatDate(item.dueDate) : "—"}
                  </p>
                </div>
                <span className={`text-xs font-bold font-mono tabular-nums shrink-0 ${item.type === "INCOME" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {item.type === "EXPENSE" ? "−" : "+"}
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
