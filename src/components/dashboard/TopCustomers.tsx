import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type CustomerRow = { name: string; total: number; count: number };

export function TopCustomers({ data }: { data: CustomerRow[] }) {
  const max = data[0]?.total ?? 1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sem clientes com receitas no período
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((row, i) => (
              <div key={row.name}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground w-4 shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium flex-1 truncate">{row.name}</span>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold tabular-nums text-green-600 dark:text-green-400">
                      {formatCurrency(row.total)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {row.count} lanç. · tm {formatCurrency(row.total / row.count)}
                    </p>
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden ml-6">
                  <div
                    className="h-full bg-green-500 dark:bg-green-600 rounded-full"
                    style={{ width: `${(row.total / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
