"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Building2, Check, X } from "lucide-react";
import { createCostCenter, updateCostCenter, deleteCostCenter } from "@/actions/costCenters";
import { useToast } from "@/hooks/use-toast";
import type { CostCenter } from "@prisma/client";

interface CostCentersManagerProps {
  costCenters: CostCenter[];
}

export function CostCentersManager({ costCenters: initial }: CostCentersManagerProps) {
  const { toast } = useToast();
  const [costCenters, setCostCenters] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSaveNew() {
    if (!newName.trim()) return;
    setLoading(true);
    const result = await createCostCenter({ name: newName.trim() });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else if ("data" in result && result.data) {
      setCostCenters((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      setIsAdding(false);
      toast({ title: "Centro de custo criado" });
    }
    setLoading(false);
  }

  async function handleSaveEdit() {
    if (!editingId || !editingName.trim()) return;
    setLoading(true);
    const result = await updateCostCenter(editingId, { name: editingName.trim() });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else {
      setCostCenters((prev) =>
        prev.map((c) => c.id === editingId ? { ...c, name: editingName.trim() } : c)
      );
      setEditingId(null);
      toast({ title: "Centro de custo atualizado" });
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este centro de custo?")) return;
    await deleteCostCenter(id);
    setCostCenters((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Centro de custo excluído" });
  }

  function startEdit(cc: CostCenter) {
    setEditingId(cc.id);
    setEditingName(cc.name);
    setIsAdding(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {costCenters.length} centro{costCenters.length !== 1 ? "s" : ""} de custo
        </p>
      </div>

      <div className="rounded-xl border bg-card divide-y">
        {costCenters.length === 0 && !isAdding && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            Nenhum centro de custo cadastrado
          </div>
        )}

        {costCenters.map((cc) => (
          <div key={cc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />

            {editingId === cc.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  className="h-7 text-sm"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={handleSaveEdit} disabled={loading}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEdit}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <span className="text-sm flex-1">{cc.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(cc)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cc.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/20">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <Input
                className="h-7 text-sm"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do centro de custo"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveNew();
                  if (e.key === "Escape") { setIsAdding(false); setNewName(""); }
                }}
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-green-600 hover:text-green-700"
                onClick={handleSaveNew}
                disabled={loading || !newName.trim()}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setIsAdding(false); setNewName(""); }}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {!isAdding && (
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/20 transition-colors text-left"
            onClick={() => { setIsAdding(true); setEditingId(null); }}
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar centro de custo
          </button>
        )}
      </div>
    </div>
  );
}
