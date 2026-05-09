"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Meta = {
  companies: { id: string; name: string }[];
  categories: { id: string; name: string; type: string }[];
  costCenters: { id: string; name: string }[];
};

const PRESETS = [
  { value: "this_month", label: "Este mês" },
  { value: "last_month", label: "Mês passado" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "12m", label: "12 meses" },
  { value: "this_year", label: "Este ano" },
] as const;

export function DashboardFilters({ meta }: { meta: Meta }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? "";

  const update = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    startTransition(() => router.push(pathname));
  }, [router, pathname]);

  const preset = get("preset") || "this_month";
  const dateMode = get("dateMode") || "competency";
  const companyId = get("companyId");
  const categoryId = get("categoryId");
  const costCenterId = get("costCenterId");

  const hasActiveFilters = !!(companyId || categoryId || costCenterId || get("status") ||
    get("preset") || get("dateMode"));

  return (
    <div className="bg-background border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2">
      {/* Period presets */}
      <div className="flex items-center rounded-lg border border-border overflow-hidden shrink-0">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => update({ preset: p.value === "this_month" ? null : p.value })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              preset === p.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-border shrink-0 hidden sm:block" />

      {/* Company */}
      {meta.companies.length > 1 && (
        <Select
          value={companyId || "all"}
          onValueChange={(v) => update({ companyId: v === "all" ? null : v })}
        >
          <SelectTrigger className="h-8 text-xs w-[130px]">
            <SelectValue placeholder="Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as empresas</SelectItem>
            {meta.companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Category */}
      <Select
        value={categoryId || "all"}
        onValueChange={(v) => update({ categoryId: v === "all" ? null : v })}
      >
        <SelectTrigger className="h-8 text-xs w-[140px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas categorias</SelectItem>
          {meta.categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Cost center */}
      {meta.costCenters.length > 0 && (
        <Select
          value={costCenterId || "all"}
          onValueChange={(v) => update({ costCenterId: v === "all" ? null : v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue placeholder="Centro de custo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos centros</SelectItem>
            {meta.costCenters.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Divider */}
      <div className="h-6 w-px bg-border shrink-0 hidden sm:block" />

      {/* Date mode toggle */}
      <div className="flex items-center rounded-lg border border-border overflow-hidden shrink-0">
        {[
          { value: "competency", label: "Competência" },
          { value: "cash", label: "Caixa" },
        ].map((m) => (
          <button
            key={m.value}
            onClick={() => update({ dateMode: m.value === "competency" ? null : m.value })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              dateMode === m.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Loading indicator */}
      {isPending && (
        <RefreshCw className="h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" />
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
        >
          <X className="h-3 w-3" />
          Limpar
        </Button>
      )}
    </div>
  );
}
