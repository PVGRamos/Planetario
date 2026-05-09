"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus, type Prisma } from "@prisma/client";
import { serializeTransaction } from "@/lib/utils";
import {
  startOfMonth, endOfMonth, subMonths, format,
  differenceInDays, startOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { SerializedTransaction } from "@/types";

export type DashboardFilterParams = {
  preset?: string;
  dateFrom?: string;
  dateTo?: string;
  companyId?: string;
  categoryId?: string;
  costCenterId?: string;
  status?: string;
  supplierId?: string;
  customerId?: string;
  dateMode?: string;
};

export type DashboardKPIs = {
  receitas: number;
  despesas: number;
  saldo: number;
  aReceber: number;
  pendentes: number;
  vencidos: number;
  vencidosTotal: number;
  ticketMedio: number;
  receitasDelta: number | null;
  despesasDelta: number | null;
  saldoDelta: number | null;
};

export type DashboardData = {
  kpis: DashboardKPIs;
  cashFlowData: { month: string; receitas: number; despesas: number }[];
  expensesByCategory: { category: string; total: number }[];
  incomeByCategory: { category: string; total: number }[];
  companyData: { company: string; receitas: number; despesas: number; saldo: number }[];
  costCenterData: { name: string; total: number }[];
  topSuppliers: { name: string; total: number; count: number }[];
  topCustomers: { name: string; total: number; count: number }[];
  upcomingDues: {
    id: string; description: string; amount: number;
    dueDate: string | null; company: string; type: string; daysUntilDue: number;
  }[];
  overdue: {
    id: string; description: string; amount: number;
    dueDate: string | null; company: string; type: string; daysOverdue: number;
  }[];
  recentTransactions: SerializedTransaction[];
  insights: {
    highestExpenseCategory: string | null;
    highestExpenseAmount: number;
    dominantSupplier: string | null;
    dominantSupplierAmount: number;
    dominantCustomer: string | null;
    dominantCustomerAmount: number;
    receitasDelta: number | null;
    despesasDelta: number | null;
  };
  meta: {
    companies: { id: string; name: string }[];
    categories: { id: string; name: string; type: string }[];
    costCenters: { id: string; name: string }[];
    suppliers: { id: string; name: string }[];
    customers: { id: string; name: string }[];
  };
};

const getCachedMeta = unstable_cache(
  async () => {
    const [categories, companies, costCenters, suppliers, customers] = await Promise.all([
      prisma.category.findMany({ select: { id: true, name: true, type: true } }),
      prisma.company.findMany({ select: { id: true, name: true } }),
      prisma.costCenter.findMany({ select: { id: true, name: true } }),
      prisma.supplier.findMany({ where: { active: true }, select: { id: true, name: true } }),
      prisma.customer.findMany({ where: { active: true }, select: { id: true, name: true } }),
    ]);
    return { categories, companies, costCenters, suppliers, customers };
  },
  ["dashboard-meta"],
  { revalidate: 300, tags: ["meta"] }
);

function resolvePeriod(params: DashboardFilterParams): { dateFrom: Date; dateTo: Date } {
  const now = new Date();

  if (params.preset === "custom" && params.dateFrom && params.dateTo) {
    return { dateFrom: new Date(params.dateFrom), dateTo: new Date(params.dateTo) };
  }

  switch (params.preset) {
    case "last_month": {
      const d = subMonths(now, 1);
      return { dateFrom: startOfMonth(d), dateTo: endOfMonth(d) };
    }
    case "3m":
      return { dateFrom: startOfMonth(subMonths(now, 2)), dateTo: endOfMonth(now) };
    case "6m":
      return { dateFrom: startOfMonth(subMonths(now, 5)), dateTo: endOfMonth(now) };
    case "12m":
      return { dateFrom: startOfMonth(subMonths(now, 11)), dateTo: endOfMonth(now) };
    case "this_year":
      return { dateFrom: startOfYear(now), dateTo: endOfMonth(now) };
    default:
      return { dateFrom: startOfMonth(now), dateTo: endOfMonth(now) };
  }
}

export async function getDashboardData(params: DashboardFilterParams = {}): Promise<DashboardData> {
  const now = new Date();
  const { dateFrom, dateTo } = resolvePeriod(params);

  // Previous period (same span length)
  const spanMs = dateTo.getTime() - dateFrom.getTime();
  const prevDateTo = new Date(dateFrom.getTime() - 1);
  const prevDateFrom = new Date(prevDateTo.getTime() - spanMs);

  const useCash = params.dateMode === "cash";
  const dateField = useCash ? "paymentDate" : "competencyDate";

  const periodWhere: Prisma.TransactionWhereInput = {
    [dateField]: { gte: dateFrom, lte: dateTo },
    ...(useCash
      ? { status: TransactionStatus.PAID }
      : { status: { notIn: [TransactionStatus.CANCELED] } }),
  };

  const prevPeriodWhere: Prisma.TransactionWhereInput = {
    [dateField]: { gte: prevDateFrom, lte: prevDateTo },
    ...(useCash
      ? { status: TransactionStatus.PAID }
      : { status: { notIn: [TransactionStatus.CANCELED] } }),
  };

  const contextWhere: Prisma.TransactionWhereInput = {
    ...(params.companyId ? { companyId: params.companyId } : {}),
    ...(params.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params.costCenterId ? { costCenterId: params.costCenterId } : {}),
    ...(params.supplierId ? { supplierId: params.supplierId } : {}),
    ...(params.customerId ? { customerId: params.customerId } : {}),
    ...(!useCash && params.status ? { status: params.status as TransactionStatus } : {}),
  };

  const currentWhere: Prisma.TransactionWhereInput = { ...periodWhere, ...contextWhere };
  const prevWhere: Prisma.TransactionWhereInput = { ...prevPeriodWhere, ...contextWhere };
  const companyOnly: Prisma.TransactionWhereInput = params.companyId
    ? { companyId: params.companyId }
    : {};

  const months6 = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i);
    return { start: startOfMonth(d), end: endOfMonth(d), label: format(d, "MMM", { locale: ptBR }) };
  });

  const upcoming30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [[
    currentTxs, prevTxs, expCatGroup, incCatGroup,
    companyGroup, ccGroup, suppGroup, cusGroup,
    upcomingList, overdueList, recentTxs,
  ], allMonthly6, { categories, companies, costCenters, suppliers, customers }] = await Promise.all([
    Promise.all([
      prisma.transaction.findMany({
        where: currentWhere,
        select: { type: true, amount: true, status: true },
      }),
      prisma.transaction.findMany({
        where: prevWhere,
        select: { type: true, amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { ...currentWhere, type: TransactionType.EXPENSE },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 7,
      }),
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { ...currentWhere, type: TransactionType.INCOME },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 7,
      }),
      prisma.transaction.groupBy({
        by: ["companyId", "type"],
        where: currentWhere,
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["costCenterId"],
        where: {
          ...currentWhere,
          type: TransactionType.EXPENSE,
          costCenterId: { not: null },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 8,
      }),
      prisma.transaction.groupBy({
        by: ["supplierId"],
        where: {
          ...currentWhere,
          type: TransactionType.EXPENSE,
          supplierId: { not: null },
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 8,
      }),
      prisma.transaction.groupBy({
        by: ["customerId"],
        where: {
          ...currentWhere,
          type: TransactionType.INCOME,
          customerId: { not: null },
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 8,
      }),
      prisma.transaction.findMany({
        where: {
          ...companyOnly,
          status: { in: [TransactionStatus.PENDING, TransactionStatus.OVERDUE] },
          dueDate: { gte: now, lte: upcoming30 },
        },
        select: {
          id: true, description: true, amount: true, dueDate: true, type: true,
          company: { select: { name: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: { ...companyOnly, status: TransactionStatus.OVERDUE },
        select: {
          id: true, description: true, amount: true, dueDate: true, type: true,
          company: { select: { name: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: companyOnly,
        include: {
          company: true, category: true, subcategory: true,
          costCenter: true, supplier: true, customer: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]),
    prisma.transaction.findMany({
      where: {
        competencyDate: { gte: months6[0].start, lte: months6[months6.length - 1].end },
        status: { notIn: [TransactionStatus.CANCELED] },
        ...companyOnly,
      },
      select: { type: true, amount: true, competencyDate: true },
    }),
    getCachedMeta(),
  ]);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const coMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));
  const ccMap = Object.fromEntries(costCenters.map((c) => [c.id, c.name]));
  const supMap = Object.fromEntries(suppliers.map((c) => [c.id, c.name]));
  const cusMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));

  // KPI calculations
  const receitas = currentTxs.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const despesas = currentTxs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
  const pendentes = currentTxs.filter((t) => t.status === "PENDING").length;
  const aReceber = currentTxs.filter((t) => t.type === "INCOME" && t.status === "PENDING").reduce((s, t) => s + Number(t.amount), 0);
  const vencidosTotal = overdueList.reduce((s, t) => s + Number(t.amount), 0);
  const totalCount = currentTxs.length;
  const ticketMedio = totalCount > 0 ? (receitas + despesas) / totalCount : 0;

  const prevReceitas = prevTxs.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const prevDespesas = prevTxs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  const receitasDelta = prevReceitas > 0 ? ((receitas - prevReceitas) / prevReceitas) * 100 : null;
  const despesasDelta = prevDespesas > 0 ? ((despesas - prevDespesas) / prevDespesas) * 100 : null;
  const saldoDelta = (() => {
    const prev = prevReceitas - prevDespesas;
    const cur = receitas - despesas;
    return prev !== 0 ? ((cur - prev) / Math.abs(prev)) * 100 : null;
  })();

  // Category data
  const expensesByCategory = expCatGroup.map((e) => ({
    category: catMap[e.categoryId] ?? "Outros",
    total: Number(e._sum.amount ?? 0),
  }));

  const incomeByCategory = incCatGroup.map((e) => ({
    category: catMap[e.categoryId] ?? "Outros",
    total: Number(e._sum.amount ?? 0),
  }));

  // Company comparison
  const coAccum: Record<string, { receitas: number; despesas: number }> = {};
  for (const row of companyGroup) {
    const name = coMap[row.companyId] ?? row.companyId;
    if (!coAccum[name]) coAccum[name] = { receitas: 0, despesas: 0 };
    const amt = Number(row._sum.amount ?? 0);
    if (row.type === "INCOME") coAccum[name].receitas += amt;
    else coAccum[name].despesas += amt;
  }
  const companyData = Object.entries(coAccum).map(([company, v]) => ({
    company,
    receitas: v.receitas,
    despesas: v.despesas,
    saldo: v.receitas - v.despesas,
  }));

  // Cost centers
  const costCenterData = ccGroup
    .filter((e): e is typeof e & { costCenterId: string } => e.costCenterId !== null)
    .map((e) => ({
      name: ccMap[e.costCenterId] ?? "Sem Centro",
      total: Number(e._sum.amount ?? 0),
    }));

  // Top suppliers / customers
  const topSuppliers = suppGroup
    .filter((s): s is typeof s & { supplierId: string } => s.supplierId !== null)
    .map((s) => ({
      name: supMap[s.supplierId] ?? "Desconhecido",
      total: Number(s._sum.amount ?? 0),
      count: s._count.id,
    }));

  const topCustomers = cusGroup
    .filter((c): c is typeof c & { customerId: string } => c.customerId !== null)
    .map((c) => ({
      name: cusMap[c.customerId] ?? "Desconhecido",
      total: Number(c._sum.amount ?? 0),
      count: c._count.id,
    }));

  // Upcoming dues / overdue
  const upcomingDues = upcomingList.map((t) => ({
    id: t.id,
    description: t.description,
    amount: Number(t.amount),
    dueDate: t.dueDate?.toISOString() ?? null,
    company: t.company.name,
    type: t.type as string,
    daysUntilDue: t.dueDate ? differenceInDays(t.dueDate, now) : 0,
  }));

  const overdue = overdueList.map((t) => ({
    id: t.id,
    description: t.description,
    amount: Number(t.amount),
    dueDate: t.dueDate?.toISOString() ?? null,
    company: t.company.name,
    type: t.type as string,
    daysOverdue: t.dueDate ? Math.abs(differenceInDays(t.dueDate, now)) : 0,
  }));

  // 6-month cash flow
  const cashFlowData = months6.map((m) => {
    const txs = allMonthly6.filter(
      (t) => t.competencyDate >= m.start && t.competencyDate <= m.end
    );
    const label = m.label.charAt(0).toUpperCase() + m.label.slice(1);
    return {
      month: label,
      receitas: txs.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0),
      despesas: txs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0),
    };
  });

  // Auto-insights
  const topExpCat = expensesByCategory[0];
  const topSup = topSuppliers[0];
  const topCus = topCustomers[0];

  return {
    kpis: {
      receitas, despesas, saldo: receitas - despesas,
      aReceber, pendentes, vencidos: overdueList.length,
      vencidosTotal, ticketMedio,
      receitasDelta, despesasDelta, saldoDelta,
    },
    cashFlowData,
    expensesByCategory,
    incomeByCategory,
    companyData,
    costCenterData,
    topSuppliers,
    topCustomers,
    upcomingDues,
    overdue,
    recentTransactions: recentTxs.map(serializeTransaction),
    insights: {
      highestExpenseCategory: topExpCat?.category ?? null,
      highestExpenseAmount: topExpCat?.total ?? 0,
      dominantSupplier: topSup?.name ?? null,
      dominantSupplierAmount: topSup?.total ?? 0,
      dominantCustomer: topCus?.name ?? null,
      dominantCustomerAmount: topCus?.total ?? 0,
      receitasDelta,
      despesasDelta,
    },
    meta: {
      companies,
      categories: categories.map((c) => ({ ...c, type: c.type as string })),
      costCenters,
      suppliers,
      customers,
    },
  };
}
