import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Building2 } from "lucide-react";

type CompanyRow = {
  company: string;
  receitas: number;
  despesas: number;
  saldo: number;
};

function CompanyRow({ row }: { row: CompanyRow }) {
  const margem = row.receitas > 0 ? ((row.saldo / row.receitas) * 100).toFixed(1) : "—";
  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <p className="text-sm font-semibold truncate">{row.company}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 text-center">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Receitas</p>
          <p className="text-xs font-bold text-green-600 dark:text-green-400 tabular-nums">
            {formatCurrency(row.receitas)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Despesas</p>
          <p className="text-xs font-bold text-red-600 dark:text-red-400 tabular-nums">
            {formatCurrency(row.despesas)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Margem</p>
          <p className={`text-xs font-bold tabular-nums ${row.saldo >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {margem !== "—" ? `${margem}%` : "—"}
          </p>
        </div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        {row.receitas > 0 && (
          <div
            className={`h-full rounded-full ${row.saldo >= 0 ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${Math.min(100, Math.max(0, (row.saldo / row.receitas) * 100 + 50))}%` }}
          />
        )}
      </div>
    </div>
  );
}

export function CompanyComparison({ data }: { data: CompanyRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparativo por Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sem dados para exibir
          </p>
        ) : (
          data.map((row) => <CompanyRow key={row.company} row={row} />)
        )}
      </CardContent>
    </Card>
  );
}
