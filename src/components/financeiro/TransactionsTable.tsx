"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import { deleteTransaction } from "@/actions/transactions";
import { useToast } from "@/hooks/use-toast";
import type { SerializedTransaction } from "@/types";
import type {
  Company,
  Category,
  Subcategory,
  CostCenter,
  Supplier,
  Customer,
} from "@prisma/client";

type CategoryWithSubs = Category & { subcategories: Subcategory[] };

interface TransactionsTableProps {
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
  onPageChange: (page: number) => void;
  onEdit: (tx: SerializedTransaction) => void;
}

const ALL = "_all_";

interface FilterOption {
  value: string;
  label: string;
}

function ColumnFilterDropdown({
  label,
  paramKey,
  options,
  value,
  onSelect,
}: {
  label: string;
  paramKey: string;
  options: FilterOption[];
  value: string;
  onSelect: (key: string, value: string) => void;
}) {
  const isActive = !!value;
  const activeLabel = options.find((o) => o.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 text-xs font-semibold transition-colors hover:text-foreground focus:outline-none",
            isActive ? "text-primary" : "text-muted-foreground/80"
          )}
        >
          {isActive ? activeLabel : label}
          <ChevronDown className="h-3 w-3 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        <DropdownMenuItem
          onClick={() => onSelect(paramKey, ALL)}
          className="flex items-center justify-between text-sm"
        >
          Todos
          {!value && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onSelect(paramKey, opt.value)}
            className="flex items-center justify-between text-sm"
          >
            {opt.label}
            {value === opt.value && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AmountSortButton({
  value,
  onSort,
}: {
  value: string;
  onSort: (key: string, value: string) => void;
}) {
  function handleClick() {
    if (!value) onSort("sortAmount", "desc");
    else if (value === "desc") onSort("sortAmount", "asc");
    else onSort("sortAmount", ALL);
  }

  const Icon = !value ? ArrowUpDown : value === "desc" ? ArrowDown : ArrowUp;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1 text-xs font-semibold ml-auto transition-colors hover:text-foreground focus:outline-none",
        value ? "text-primary" : "text-muted-foreground/80"
      )}
    >
      Valor
      <Icon className="h-3 w-3 shrink-0" />
    </button>
  );
}

function DateCell({ tx }: { tx: SerializedTransaction }) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm whitespace-nowrap text-muted-foreground">
        {formatDate(tx.competencyDate)}
      </p>
      {tx.dueDate && (
        <p
          className={cn(
            "text-[10px] whitespace-nowrap",
            tx.status === "OVERDUE"
              ? "text-red-500 dark:text-red-400 font-medium"
              : "text-muted-foreground/60"
          )}
        >
          Venc. {formatDate(tx.dueDate)}
        </p>
      )}
      {tx.paymentDate && (
        <p className="text-[10px] whitespace-nowrap text-green-600/70 dark:text-green-400/70">
          Pago {formatDate(tx.paymentDate)}
        </p>
      )}
    </div>
  );
}

export function TransactionsTable({
  transactions,
  total,
  page,
  totalPages,
  meta,
  onPageChange,
  onEdit,
}: TransactionsTableProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getFilter = (key: string) => searchParams.get(key) ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== ALL) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  async function handleDelete(id: string) {
    if (!confirm("Excluir este lançamento?")) return;
    setDeletingId(id);
    await deleteTransaction(id);
    toast({ title: "Lançamento excluído" });
    setDeletingId(null);
  }

  const typeOptions: FilterOption[] = [
    { value: "INCOME", label: "Receita" },
    { value: "EXPENSE", label: "Despesa" },
  ];

  const statusOptions: FilterOption[] = [
    { value: "PENDING", label: "Pendente / A Receber" },
    { value: "PAID", label: "Pago / Recebido" },
    { value: "OVERDUE", label: "Vencido / Atrasado" },
    { value: "CANCELED", label: "Cancelado" },
  ];

  const companyOptions: FilterOption[] = meta.companies.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const activeType = getFilter("type");
  const categoryOptions: FilterOption[] = meta.categories
    .filter((c) => !activeType || c.type === activeType)
    .map((c) => ({ value: c.id, label: c.name }));

  const activeCategoryId = getFilter("categoryId");
  const subcategoryOptions: FilterOption[] = meta.categories
    .filter((c) => !activeType || c.type === activeType)
    .filter((c) => !activeCategoryId || c.id === activeCategoryId)
    .flatMap((c) => c.subcategories)
    .map((s) => ({ value: s.id, label: s.name }));

  const costCenterOptions: FilterOption[] = meta.costCenters.map((cc) => ({
    value: cc.id,
    label: cc.name,
  }));

  return (
    <>
      {/* Desktop Table */}
      <div className="rounded-xl border bg-card hidden sm:block overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="text-xs font-semibold text-muted-foreground/80">
                Data
              </TableHead>
              <TableHead>
                <ColumnFilterDropdown
                  label="Empresa"
                  paramKey="companyId"
                  options={companyOptions}
                  value={getFilter("companyId")}
                  onSelect={updateFilter}
                />
              </TableHead>
              <TableHead>
                <ColumnFilterDropdown
                  label="Tipo"
                  paramKey="type"
                  options={typeOptions}
                  value={getFilter("type")}
                  onSelect={updateFilter}
                />
              </TableHead>
              <TableHead>
                <ColumnFilterDropdown
                  label="Categoria"
                  paramKey="categoryId"
                  options={categoryOptions}
                  value={getFilter("categoryId")}
                  onSelect={updateFilter}
                />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <ColumnFilterDropdown
                  label="Subcategoria"
                  paramKey="subcategoryId"
                  options={subcategoryOptions}
                  value={getFilter("subcategoryId")}
                  onSelect={updateFilter}
                />
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                <ColumnFilterDropdown
                  label="Centro de Custo"
                  paramKey="costCenterId"
                  options={costCenterOptions}
                  value={getFilter("costCenterId")}
                  onSelect={updateFilter}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground/80 hidden lg:table-cell">
                Fornecedor/Cliente
              </TableHead>
              <TableHead className="text-right">
                <AmountSortButton
                  value={getFilter("sortAmount")}
                  onSort={updateFilter}
                />
              </TableHead>
              <TableHead>
                <ColumnFilterDropdown
                  label="Status"
                  paramKey="status"
                  options={statusOptions}
                  value={getFilter("status")}
                  onSelect={updateFilter}
                />
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-16 text-muted-foreground"
                >
                  Nenhum lançamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="group hover:bg-muted/30">
                  <TableCell>
                    <DateCell tx={tx} />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {tx.company.name}
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={tx.type} />
                  </TableCell>
                  <TableCell className="text-sm">{tx.category.name}</TableCell>
                  <TableCell className="text-sm hidden lg:table-cell text-muted-foreground">
                    {tx.subcategory?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm hidden xl:table-cell text-muted-foreground">
                    {tx.costCenter?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm hidden lg:table-cell text-muted-foreground">
                    {tx.type === "INCOME"
                      ? (tx.customer?.name ?? "—")
                      : (tx.supplier?.name ?? "—")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">
                    <span
                      className={
                        tx.type === "INCOME"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }
                    >
                      {tx.type === "EXPENSE" ? "−" : "+"}
                      {formatCurrency(Number(tx.amount))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} transactionType={tx.type} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(tx)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 sm:hidden">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
            Nenhum lançamento encontrado
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="bg-card rounded-xl border p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tx.company.name} · {formatDate(tx.competencyDate)}
                  </p>
                  {tx.dueDate && (
                    <p
                      className={cn(
                        "text-[10px] mt-0.5",
                        tx.status === "OVERDUE"
                          ? "text-red-500 dark:text-red-400"
                          : "text-muted-foreground/60"
                      )}
                    >
                      Venc. {formatDate(tx.dueDate)}
                    </p>
                  )}
                  {tx.paymentDate && (
                    <p className="text-[10px] text-green-600/70 dark:text-green-400/70 mt-0.5">
                      Pago {formatDate(tx.paymentDate)}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(tx)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(tx.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <TypeBadge type={tx.type} />
                  <StatusBadge status={tx.status} transactionType={tx.type} />
                </div>
                <span
                  className={cn(
                    "font-mono text-sm font-bold",
                    tx.type === "INCOME"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  )}
                >
                  {tx.type === "EXPENSE" ? "−" : "+"}
                  {formatCurrency(Number(tx.amount))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {tx.category.name}
                {tx.subcategory ? ` › ${tx.subcategory.name}` : ""}
                {tx.costCenter ? ` · ${tx.costCenter.name}` : ""}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
