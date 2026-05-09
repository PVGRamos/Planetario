import type {
  Company,
  Category,
  Subcategory,
  CostCenter,
  Supplier,
  Customer,
  TransactionType,
  PaymentMethod,
  TransactionStatus,
} from "@prisma/client";

export type { TransactionType, PaymentMethod, TransactionStatus };

// Serialized version — safe to pass from Server → Client Components
// amount: number (was Decimal), dates: string ISO (were Date)
export type SerializedTransaction = {
  id: string;
  companyId: string;
  type: TransactionType;
  categoryId: string;
  subcategoryId: string | null;
  costCenterId: string | null;
  supplierId: string | null;
  customerId: string | null;
  description: string;
  documentRef: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  competencyDate: string;
  dueDate: string | null;
  paymentDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  company: Company;
  category: Category;
  subcategory: Subcategory | null;
  costCenter: CostCenter | null;
  supplier: Supplier | null;
  customer: Customer | null;
};

// Raw Prisma type — only used server-side
export type TransactionWithRelations = {
  id: string;
  companyId: string;
  type: TransactionType;
  categoryId: string;
  subcategoryId: string | null;
  costCenterId: string | null;
  supplierId: string | null;
  customerId: string | null;
  description: string;
  documentRef: string | null;
  amount: { toNumber: () => number } | number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  competencyDate: Date;
  dueDate: Date | null;
  paymentDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
  category: Category;
  subcategory: Subcategory | null;
  costCenter: CostCenter | null;
  supplier: Supplier | null;
  customer: Customer | null;
};

export type TransactionFilters = {
  search?: string;
  companyId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: "PIX",
  DINHEIRO: "Dinheiro",
  BOLETO: "Boleto",
  TRANSFERENCIA: "Transferência",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
};

// Status labels vary by transaction type
export function getStatusLabels(type: TransactionType): Record<TransactionStatus, string> {
  if (type === "INCOME") {
    return {
      PENDING: "A Receber",
      PAID: "Recebido",
      OVERDUE: "Atrasado",
      CANCELED: "Cancelado",
    };
  }
  return {
    PENDING: "Pendente",
    PAID: "Pago",
    OVERDUE: "Vencido",
    CANCELED: "Cancelado",
  };
}

// Generic labels for tables/filters where transaction type isn't per-row
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pendente / A Receber",
  PAID: "Pago / Recebido",
  OVERDUE: "Vencido / Atrasado",
  CANCELED: "Cancelado",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
};

export const COST_CENTER_LABELS = [
  "Financeiro",
  "Diretoria",
  "Comercial",
  "Operacional",
  "Administrativo",
  "RH",
  "MKT",
] as const;
