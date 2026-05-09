import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, TrendingDown, Package, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardData } from "@/actions/dashboard";

type Insight = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  body: string;
};

function buildInsights(data: DashboardData["insights"]): Insight[] {
  const items: Insight[] = [];

  if (data.receitasDelta !== null) {
    const isUp = data.receitasDelta >= 0;
    items.push({
      icon: isUp ? TrendingUp : TrendingDown,
      color: isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      title: isUp ? "Receitas crescendo" : "Receitas em queda",
      body: `${isUp ? "+" : ""}${data.receitasDelta.toFixed(1)}% em relação ao período anterior.`,
    });
  }

  if (data.despesasDelta !== null) {
    const isUp = data.despesasDelta > 0;
    items.push({
      icon: isUp ? TrendingUp : TrendingDown,
      color: isUp ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
      title: isUp ? "Despesas aumentaram" : "Despesas reduziram",
      body: `${isUp ? "+" : ""}${data.despesasDelta.toFixed(1)}% vs período anterior.`,
    });
  }

  if (data.highestExpenseCategory) {
    items.push({
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
      title: "Maior gasto do período",
      body: `${data.highestExpenseCategory} com ${formatCurrency(data.highestExpenseAmount)} em despesas.`,
    });
  }

  if (data.dominantSupplier) {
    items.push({
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      title: "Fornecedor principal",
      body: `${data.dominantSupplier} recebeu ${formatCurrency(data.dominantSupplierAmount)} no período.`,
    });
  }

  if (data.dominantCustomer) {
    items.push({
      icon: Users,
      color: "text-primary",
      title: "Cliente destaque",
      body: `${data.dominantCustomer} gerou ${formatCurrency(data.dominantCustomerAmount)} em receitas.`,
    });
  }

  return items.slice(0, 4);
}

export function AutoInsights({ insights }: { insights: DashboardData["insights"] }) {
  const items = buildInsights(insights);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Insights do Período
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground flex-1 flex items-center justify-center text-center py-8">
            Sem dados suficientes para gerar insights.
          </p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-snug">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.body}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
