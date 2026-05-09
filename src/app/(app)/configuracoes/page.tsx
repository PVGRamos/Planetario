import { getCategoriesByType } from "@/actions/categories";
import { getSuppliers } from "@/actions/suppliers";
import { getCustomers } from "@/actions/customers";
import { getCostCenters } from "@/actions/costCenters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseCategoriesManager } from "@/components/configuracoes/ExpenseCategoriesManager";
import { IncomeCategoriesManager } from "@/components/configuracoes/IncomeCategoriesManager";
import { SuppliersManager } from "@/components/configuracoes/SuppliersManager";
import { CustomersManager } from "@/components/configuracoes/CustomersManager";
import { CostCentersManager } from "@/components/configuracoes/CostCentersManager";
import { AppearanceSettings } from "@/components/configuracoes/AppearanceSettings";

export default async function ConfiguracoesPage() {
  const [expenseCategories, incomeCategories, suppliers, customers, costCenters] = await Promise.all([
    getCategoriesByType("EXPENSE"),
    getCategoriesByType("INCOME"),
    getSuppliers(),
    getCustomers(),
    getCostCenters(),
  ]);

  return (
    <div className="max-w-4xl space-y-1">
      <Tabs defaultValue="despesas">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="despesas">Categorias de Despesa</TabsTrigger>
          <TabsTrigger value="receitas">Categorias de Receita</TabsTrigger>
          <TabsTrigger value="centros-custo">Centros de Custo</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="despesas">
          <ExpenseCategoriesManager categories={expenseCategories} />
        </TabsContent>

        <TabsContent value="receitas">
          <IncomeCategoriesManager categories={incomeCategories} />
        </TabsContent>

        <TabsContent value="centros-custo">
          <CostCentersManager costCenters={costCenters} />
        </TabsContent>

        <TabsContent value="fornecedores">
          <SuppliersManager suppliers={suppliers} />
        </TabsContent>

        <TabsContent value="clientes">
          <CustomersManager customers={customers} />
        </TabsContent>

        <TabsContent value="aparencia">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
