"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#1A5FB4", "#2574D4", "#2D9CDB", "#7EC8F0", "#163D6E", "#0F2A4A", "#BAE0F8", "#7C3AED"];

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground mt-0.5">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function CostCenterChart({ data }: { data: { name: string; total: number }[] }) {
  const max = data[0]?.total ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por Centro de Custo</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Sem dados para exibir
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium truncate max-w-[60%]">{item.name}</span>
                  <span className="text-muted-foreground font-mono tabular-nums">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.total / max) * 100}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
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
