"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { useToast } from "@/hooks/use-toast";
import { getStatusLabels } from "@/types";
import type { SerializedTransaction } from "@/types";
import type { Company, Category, Subcategory, CostCenter, Supplier, Customer } from "@prisma/client";
import { TransactionType, PaymentMethod, TransactionStatus } from "@prisma/client";

const schema = z.object({
  companyId: z.string().min(1, "Empresa é obrigatória"),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  subcategoryId: z.string().optional().nullable(),
  costCenterId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  description: z.string().min(1, "Descrição é obrigatória"),
  documentRef: z.string().optional().nullable(),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(TransactionStatus),
  competencyDate: z.string().min(1, "Data de competência é obrigatória"),
  dueDate: z.string().optional().nullable(),
  paymentDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

type CategoryWithSubs = Category & { subcategories: Subcategory[]; type: TransactionType };

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: SerializedTransaction | null;
  meta: {
    companies: Company[];
    categories: CategoryWithSubs[];
    costCenters: CostCenter[];
    suppliers: Supplier[];
    customers: Customer[];
  };
}

function toDateInput(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function TransactionModal({ open, onClose, transaction, meta }: TransactionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyId: "",
      type: TransactionType.EXPENSE,
      categoryId: "",
      subcategoryId: null,
      costCenterId: "",
      supplierId: null,
      customerId: null,
      description: "",
      documentRef: null,
      amount: 0,
      paymentMethod: PaymentMethod.PIX,
      status: TransactionStatus.PENDING,
      competencyDate: "",
      dueDate: null,
      paymentDate: null,
      notes: null,
    },
  });

  const watchedType = form.watch("type");
  const watchedCategoryId = form.watch("categoryId");

  // Categorias filtradas pelo tipo selecionado
  const filteredCategories = meta.categories.filter((c) => c.type === watchedType);

  // Subcategorias da categoria selecionada
  const subcategories = filteredCategories.find((c) => c.id === watchedCategoryId)?.subcategories ?? [];

  // Status labels dinâmicos por tipo
  const statusLabels = getStatusLabels(watchedType);

  // Limpar campos dependentes ao trocar tipo
  useEffect(() => {
    form.setValue("categoryId", "");
    form.setValue("subcategoryId", null);
    form.setValue("supplierId", null);
    form.setValue("customerId", null);
    if (watchedType === TransactionType.INCOME) {
      form.setValue("costCenterId", null);
    }
  }, [watchedType, form]);

  // Limpar subcategoria ao trocar categoria
  useEffect(() => {
    if (!transaction || transaction.categoryId !== watchedCategoryId) {
      form.setValue("subcategoryId", null);
    }
  }, [watchedCategoryId, transaction, form]);

  useEffect(() => {
    if (transaction) {
      form.reset({
        companyId: transaction.companyId,
        type: transaction.type,
        categoryId: transaction.categoryId,
        subcategoryId: transaction.subcategoryId ?? null,
        costCenterId: transaction.costCenterId,
        supplierId: transaction.supplierId ?? null,
        customerId: transaction.customerId ?? null,
        description: transaction.description,
        documentRef: transaction.documentRef ?? null,
        amount: Number(transaction.amount),
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        competencyDate: toDateInput(transaction.competencyDate),
        dueDate: toDateInput(transaction.dueDate),
        paymentDate: toDateInput(transaction.paymentDate),
        notes: transaction.notes ?? null,
      });
    } else {
      form.reset({
        companyId: "",
        type: TransactionType.EXPENSE,
        categoryId: "",
        subcategoryId: null,
        costCenterId: "",
        supplierId: null,
        customerId: null,
        description: "",
        documentRef: null,
        amount: 0,
        paymentMethod: PaymentMethod.PIX,
        status: TransactionStatus.PENDING,
        competencyDate: new Date().toISOString().split("T")[0],
        dueDate: null,
        paymentDate: null,
        notes: null,
      });
    }
  }, [transaction, open, form]);

  async function onSubmit(data: FormData) {
    setLoading(true);
    const result = transaction
      ? await updateTransaction(transaction.id, data)
      : await createTransaction(data);

    if (result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else {
      toast({ title: transaction ? "Lançamento atualizado" : "Lançamento criado com sucesso" });
      onClose();
    }
    setLoading(false);
  }

  const isIncome = watchedType === TransactionType.INCOME;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1: Empresa + Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {meta.companies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TransactionType.EXPENSE}>Despesa</SelectItem>
                        <SelectItem value={TransactionType.INCOME}>Receita</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Categoria + Subcategoria (filtradas por tipo) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isIncome ? "Categoria de Receita" : "Categoria de Despesa"}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategoria</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                      value={field.value ?? "none"}
                      disabled={subcategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria primeiro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {subcategories.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Centro de Custo (EXPENSE only) + Fornecedor/Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Centro de Custo — apenas EXPENSE */}
              {!isIncome && (
                <FormField
                  control={form.control}
                  name="costCenterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Centro de Custo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {meta.costCenters.map((cc) => (
                            <SelectItem key={cc.id} value={cc.id}>{cc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Fornecedor — apenas EXPENSE */}
              {!isIncome && (
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                        value={field.value ?? "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Opcional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {meta.suppliers.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Cliente — apenas INCOME (full width) */}
              {isIncome && (
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                        value={field.value ?? "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Opcional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {meta.customers.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva o lançamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Documento / Referência — apenas INCOME */}
            {isIncome && (
              <FormField
                control={form.control}
                name="documentRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento / Referência</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="NF, Contrato, Fatura, CT-e..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Row 4: Valor + Forma de Pagamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
                        <SelectItem value={PaymentMethod.DINHEIRO}>Dinheiro</SelectItem>
                        <SelectItem value={PaymentMethod.BOLETO}>Boleto</SelectItem>
                        <SelectItem value={PaymentMethod.TRANSFERENCIA}>Transferência</SelectItem>
                        <SelectItem value={PaymentMethod.CARTAO_CREDITO}>Cartão de Crédito</SelectItem>
                        <SelectItem value={PaymentMethod.CARTAO_DEBITO}>Cartão de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status com labels dinâmicos por tipo */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.entries(statusLabels) as [TransactionStatus, string][]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="competencyDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Competência</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isIncome ? "Data de Vencimento" : "Data de Vencimento"}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isIncome ? "Data de Recebimento" : "Data de Pagamento"}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Observações opcionais"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {transaction ? "Salvar alterações" : "Criar lançamento"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
