"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#16A34A", "#22C55E", "#4ADE80", "#1A5FB4", "#2574D4", "#D97706", "#7C3AED"];
const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { category: string } }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{payload[0].payload.category}</p>
      <p className="text-muted-foreground mt-0.5">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function IncomeByCategory({ data }: { data: { category: string; total: number }[] }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  const chartData = data.map((d) => ({ ...d, name: d.category }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Receitas por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Sem dados para exibir
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={64}
                  outerRadius={100}
                  paddingAngle={2}
                  labelLine={false}
                  label={CustomLabel as never}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(value: string) => (
                    <span className="text-[11px] text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-xs text-muted-foreground -mt-1">
              Total:{" "}
              <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
