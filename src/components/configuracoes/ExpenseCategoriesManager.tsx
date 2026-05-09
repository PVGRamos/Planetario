import { CategoryManagerBase } from "./CategoryManagerBase";
import type { Category, Subcategory } from "@prisma/client";

type CategoryWithSubs = Category & { subcategories: Subcategory[] };

export function ExpenseCategoriesManager({ categories }: { categories: CategoryWithSubs[] }) {
  return <CategoryManagerBase categories={categories} type="EXPENSE" typeLabel="Despesa" />;
}
