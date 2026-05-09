import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, TrendingDown, Scale, Clock,
  AlertCircle, Wallet, BarChart2, Percent,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardKPIs } from "@/actions/dashboard";

function DeltaBadge({ delta, inverse = false }: { delta: number | null; inverse?: boolean }) {
  if (delta === null) return <span className="text-xs text-muted-foreground">—</span>;

  const isPositive = inverse ? delta < 0 : delta > 0;
  const Icon = delta > 0 ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      }`}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(delta).toFixed(1)}% vs anterior
    </span>
  );
}

type Accent = "green" | "red" | "yellow" | "blue" | "neutral";

const accentStyles: Record<Accent, { border: string; iconBg: string; iconColor: string; valueColor: string }> = {
  green: {
    border: "border-l-[3px] border-l-green-500",
    iconBg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-green-700 dark:text-green-400",
  },
  red: {
    border: "border-l-[3px] border-l-red-500",
    iconBg: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-600 dark:text-red-400",
    valueColor: "text-red-700 dark:text-red-400",
  },
  yellow: {
    border: "border-l-[3px] border-l-yellow-500",
    iconBg: "bg-yellow-50 dark:bg-yellow-950/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    valueColor: "text-foreground",
  },
  blue: {
    border: "border-l-[3px] border-l-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-700 dark:text-blue-400",
  },
  neutral: {
    border: "border-l-[3px] border-l-muted-foreground/40",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    valueColor: "text-foreground",
  },
};

export function KPICards({ kpis }: { kpis: DashboardKPIs }) {
  const {
    receitas, despesas, saldo, aReceber,
    pendentes, vencidos, vencidosTotal, ticketMedio,
    receitasDelta, despesasDelta, saldoDelta,
  } = kpis;

  const saldoAccent: Accent = saldo >= 0 ? "green" : "red";

  const cards = [
    {
      title: "Receitas do Mês",
      value: formatCurrency(receitas),
      icon: TrendingUp,
      accent: "green" as Accent,
      sublabel: receitas > 0 && despesas > 0
        ? `Margem: ${(((receitas - despesas) / receitas) * 100).toFixed(1)}%`
        : "Sem receitas no período",
      delta: <DeltaBadge delta={receitasDelta} />,
    },
    {
      title: "Despesas do Mês",
      value: formatCurrency(despesas),
      icon: TrendingDown,
      accent: "red" as Accent,
      sublabel: receitas > 0 ? `${((despesas / receitas) * 100).toFixed(1)}% das receitas` : "—",
      delta: <DeltaBadge delta={despesasDelta} inverse />,
    },
    {
      title: "Saldo do Mês",
      value: formatCurrency(saldo),
      icon: Scale,
      accent: saldoAccent,
      sublabel: saldo >= 0 ? "Resultado positivo" : "Resultado negativo",
      delta: <DeltaBadge delta={saldoDelta} />,
    },
    {
      title: "A Receber",
      value: formatCurrency(aReceber),
      icon: Wallet,
      accent: "blue" as Accent,
      sublabel: "Receitas pendentes de recebimento",
      delta: null,
    },
    {
      title: "Lançamentos Pendentes",
      value: String(pendentes),
      icon: Clock,
      accent: "yellow" as Accent,
      sublabel: `lançamento${pendentes !== 1 ? "s" : ""} aguardando`,
      delta: null,
    },
    {
      title: "Contas Vencidas",
      value: vencidos > 0 ? formatCurrency(vencidosTotal) : "Nenhuma",
      icon: AlertCircle,
      accent: (vencidos > 0 ? "red" : "neutral") as Accent,
      sublabel: vencidos > 0 ? `${vencidos} lançamento${vencidos !== 1 ? "s" : ""} em atraso` : "Tudo em dia",
      delta: null,
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(ticketMedio),
      icon: BarChart2,
      accent: "neutral" as Accent,
      sublabel: "Valor médio por lançamento",
      delta: null,
    },
    {
      title: "Crescimento Receitas",
      value: receitasDelta !== null ? `${receitasDelta >= 0 ? "+" : ""}${receitasDelta.toFixed(1)}%` : "—",
      icon: Percent,
      accent: (receitasDelta === null ? "neutral" : receitasDelta >= 0 ? "green" : "red") as Accent,
      sublabel: "Comparado ao período anterior",
      delta: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ title, value, icon: Icon, accent, sublabel, delta }) => {
        const s = accentStyles[accent];
        return (
          <Card key={title} className={`overflow-hidden ${s.border}`}>
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-start justify-between mb-2.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-snug pr-2">
                  {title}
                </p>
                <div className={`p-1.5 rounded-md ${s.iconBg} shrink-0`}>
                  <Icon className={`h-3.5 w-3.5 ${s.iconColor}`} />
                </div>
              </div>
              <div className={`text-xl font-bold tracking-tight ${s.valueColor} leading-none mb-1.5`}>
                {value}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">{sublabel}</p>
              {delta && <div className="mt-1.5">{delta}</div>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
