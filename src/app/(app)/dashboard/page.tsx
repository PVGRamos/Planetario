import { getDashboardData } from "@/actions/dashboard";
import { KPICards } from "@/components/dashboard/KPICards";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { AutoInsights } from "@/components/dashboard/AutoInsights";
import { ExpensesByCategory } from "@/components/dashboard/ExpensesByCategory";
import { IncomeByCategory } from "@/components/dashboard/IncomeByCategory";
import { CostCenterChart } from "@/components/dashboard/CostCenterChart";
import { CompanyComparison } from "@/components/dashboard/CompanyComparison";
import { TopSuppliers } from "@/components/dashboard/TopSuppliers";
import { TopCustomers } from "@/components/dashboard/TopCustomers";
import { UpcomingDues } from "@/components/dashboard/UpcomingDues";
import { OverdueBills } from "@/components/dashboard/OverdueBills";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

type SearchParams = Record<string, string | string[] | undefined>;

function param(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const data = await getDashboardData({
    preset: param(sp, "preset"),
    dateFrom: param(sp, "dateFrom"),
    dateTo: param(sp, "dateTo"),
    companyId: param(sp, "companyId"),
    categoryId: param(sp, "categoryId"),
    costCenterId: param(sp, "costCenterId"),
    status: param(sp, "status"),
    supplierId: param(sp, "supplierId"),
    customerId: param(sp, "customerId"),
    dateMode: param(sp, "dateMode"),
  });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <DashboardFilters meta={data.meta} />

      {/* 8 KPIs */}
      <KPICards kpis={data.kpis} />

      {/* Cash flow + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <CashFlowChart data={data.cashFlowData} />
        </div>
        <AutoInsights insights={data.insights} />
      </div>

      {/* Expense + Income by category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ExpensesByCategory data={data.expensesByCategory} />
        <IncomeByCategory data={data.incomeByCategory} />
      </div>

      {/* Top Suppliers + Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TopSuppliers data={data.topSuppliers} />
        <TopCustomers data={data.topCustomers} />
      </div>

      {/* Cost Center + Company Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CostCenterChart data={data.costCenterData} />
        <CompanyComparison data={data.companyData} />
      </div>

      {/* Upcoming + Overdue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <UpcomingDues data={data.upcomingDues} />
        <OverdueBills data={data.overdue} />
      </div>

      {/* Recent transactions */}
      <RecentTransactions transactions={data.recentTransactions} />
    </div>
  );
}
