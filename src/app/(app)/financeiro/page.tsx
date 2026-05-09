import { Suspense } from "react";
import { getTransactions, getTransactionMeta } from "@/actions/transactions";
import { TransactionFilters } from "@/components/financeiro/TransactionFilters";
import { FinanceiroClient } from "./client";
import { serializeTransaction } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    companyId?: string;
    type?: string;
    status?: string;
    categoryId?: string;
    subcategoryId?: string;
    costCenterId?: string;
    dateFrom?: string;
    dateTo?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    paymentDateFrom?: string;
    paymentDateTo?: string;
    sortAmount?: string;
    page?: string;
  }>;
}

export default async function FinanceiroPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);

  const [data, meta] = await Promise.all([
    getTransactions({ ...params, page }),
    getTransactionMeta(),
  ]);

  const serializedTransactions = data.transactions.map(serializeTransaction);

  return (
    <div className="space-y-5">
      <Suspense>
        <TransactionFilters
          companies={meta.companies}
          categories={meta.categories}
        />
      </Suspense>

      <FinanceiroClient
        transactions={serializedTransactions}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        meta={meta}
      />
    </div>
  );
}
