"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransactionsTable } from "@/components/financeiro/TransactionsTable";
import { TransactionModal } from "@/components/financeiro/TransactionModal";
import type { SerializedTransaction } from "@/types";
import type { Company, Category, Subcategory, CostCenter, Supplier, Customer } from "@prisma/client";

type CategoryWithSubs = Category & { subcategories: Subcategory[] };

interface FinanceiroClientProps {
  transactions: SerializedTransaction[];
  total: number;
  page: number;
  totalPages: number;
  meta: {
    companies: Company[];
    categories: CategoryWithSubs[];
    costCenters: CostCenter[];
    suppliers: Supplier[];
    customers: Customer[];
  };
}

export function FinanceiroClient({ transactions, total, page, totalPages, meta }: FinanceiroClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<SerializedTransaction | null>(null);

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleNew() {
    setEditingTx(null);
    setModalOpen(true);
  }

  function handleEdit(tx: SerializedTransaction) {
    setEditingTx(tx);
    setModalOpen(true);
  }

  return (
    <>
      {/* Page action header — botão topo direito */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {total} lançamento{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>
        <Button onClick={handleNew} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Novo Lançamento
        </Button>
      </div>

      <TransactionsTable
        transactions={transactions}
        total={total}
        page={page}
        totalPages={totalPages}
        meta={meta}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
      />

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={editingTx}
        meta={meta}
      />
    </>
  );
}
