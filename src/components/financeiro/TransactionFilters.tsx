"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, CalendarDays } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Company, Category } from "@prisma/client";

/* ────────────────────────────────────────────────────────────
   Constants
─────────────────────────────────────────────────────────── */
const DATE_PARAM_PAIRS = [
  { label: "Competência", from: "dateFrom",         to: "dateTo"          },
  { label: "Vencimento",  from: "dueDateFrom",      to: "dueDateTo"       },
  { label: "Pagamento",   from: "paymentDateFrom",  to: "paymentDateTo"   },
] as const;

type DateKey = "dateFrom" | "dateTo" | "dueDateFrom" | "dueDateTo" | "paymentDateFrom" | "paymentDateTo";

const ALL_DATE_KEYS: DateKey[] = [
  "dateFrom", "dateTo", "dueDateFrom", "dueDateTo", "paymentDateFrom", "paymentDateTo",
];

const ALL_FILTER_KEYS = ["search", ...ALL_DATE_KEYS];

/* ────────────────────────────────────────────────────────────
   DateRangeGroup — two date inputs within the popover
─────────────────────────────────────────────────────────── */
function DateRangeGroup({
  label, from, to, onChange,
}: {
  label: string;
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          value={from}
          onChange={(e) => onChange(e.target.value, to)}
          className="h-7 text-xs"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => onChange(from, e.target.value)}
          className="h-7 text-xs"
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   DatePopover — batches all date changes into one navigation
─────────────────────────────────────────────────────────── */
type LocalDates = Record<DateKey, string>;

function DatePopover({
  searchParams,
  onApply,
  onClear,
}: {
  searchParams: ReturnType<typeof useSearchParams>;
  onApply: (dates: LocalDates) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<LocalDates>(() =>
    Object.fromEntries(ALL_DATE_KEYS.map((k) => [k, searchParams.get(k) ?? ""])) as LocalDates
  );

  // Sync local state to URL when popover opens
  useEffect(() => {
    if (open) {
      setLocal(
        Object.fromEntries(ALL_DATE_KEYS.map((k) => [k, searchParams.get(k) ?? ""])) as LocalDates
      );
    }
  }, [open, searchParams]);

  const activePairs = DATE_PARAM_PAIRS.filter(
    (p) => searchParams.get(p.from) || searchParams.get(p.to)
  ).length;

  function handleApply() {
    onApply(local);
    setOpen(false);
  }

  function handleClear() {
    const reset = Object.fromEntries(ALL_DATE_KEYS.map((k) => [k, ""])) as LocalDates;
    setLocal(reset);
    onClear();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 text-xs font-medium",
            activePairs > 0 && "border-primary/60 text-primary"
          )}
        >
          <CalendarDays className="h-3.5 w-3.5" />
          Datas
          {activePairs > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
              {activePairs}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-4 space-y-4">
        <p className="text-xs font-semibold text-foreground">Filtrar por data</p>

        {DATE_PARAM_PAIRS.map((pair) => (
          <DateRangeGroup
            key={pair.label}
            label={pair.label}
            from={local[pair.from]}
            to={local[pair.to]}
            onChange={(f, t) =>
              setLocal((prev) => ({ ...prev, [pair.from]: f, [pair.to]: t }))
            }
          />
        ))}

        <div className="flex gap-2 pt-1 border-t border-border">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={handleApply}>
            Aplicar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            Limpar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ────────────────────────────────────────────────────────────
   ActiveDateChips — shows which date ranges are currently active
─────────────────────────────────────────────────────────── */
function ActiveDateChips({
  searchParams,
  onRemovePair,
}: {
  searchParams: ReturnType<typeof useSearchParams>;
  onRemovePair: (fromKey: DateKey, toKey: DateKey) => void;
}) {
  const active = DATE_PARAM_PAIRS.filter(
    (p) => searchParams.get(p.from) || searchParams.get(p.to)
  );
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {active.map((p) => {
        const from = searchParams.get(p.from);
        const to = searchParams.get(p.to);
        const label = [
          from ? formatDate(from) : "…",
          to ? formatDate(to) : "…",
        ].join(" – ");

        return (
          <span
            key={p.label}
            className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-0.5"
          >
            <span className="font-medium">{p.label}:</span> {label}
            <button
              onClick={() => onRemovePair(p.from, p.to)}
              className="ml-0.5 hover:text-primary/60 transition-colors"
              aria-label={`Remover filtro ${p.label}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   TransactionFilters — main export
─────────────────────────────────────────────────────────── */
// Companies and categories kept in props signature to avoid breaking the page import
export function TransactionFilters({
  companies: _companies,
  categories: _categories,
}: {
  companies: Company[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? "";

  const pushParams = useCallback(
    (updates: Partial<Record<string, string | null>>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const applyDates = useCallback(
    (dates: LocalDates) => {
      const updates: Partial<Record<string, string | null>> = {};
      for (const k of ALL_DATE_KEYS) updates[k] = dates[k] || null;
      pushParams(updates);
    },
    [pushParams]
  );

  const clearDates = useCallback(() => {
    const updates = Object.fromEntries(ALL_DATE_KEYS.map((k) => [k, null]));
    pushParams(updates);
  }, [pushParams]);

  const removeDatePair = useCallback(
    (fromKey: DateKey, toKey: DateKey) => {
      pushParams({ [fromKey]: null, [toKey]: null });
    },
    [pushParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasFilters = ALL_FILTER_KEYS.some((k) => searchParams.has(k));

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Buscar descrição, fornecedor..."
          value={get("search")}
          onChange={(e) => pushParams({ search: e.target.value || null })}
          className="h-8 text-sm w-64 shrink-0"
        />

        <DatePopover
          searchParams={searchParams}
          onApply={applyDates}
          onClear={clearDates}
        />

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="h-3 w-3" />
            Limpar tudo
          </Button>
        )}
      </div>

      <ActiveDateChips searchParams={searchParams} onRemovePair={removeDatePair} />
    </div>
  );
}
