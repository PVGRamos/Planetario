"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { createSubcategory, updateSubcategory, deleteSubcategory } from "@/actions/categories";
import { useToast } from "@/hooks/use-toast";
import type { Category, Subcategory, TransactionType } from "@prisma/client";

type CategoryWithSubs = Category & { subcategories: Subcategory[]; type: TransactionType };

interface SubcategoriesManagerProps {
  categories: CategoryWithSubs[];
}

const TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
};

export function SubcategoriesManager({ categories }: SubcategoriesManagerProps) {
  const { toast } = useToast();
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [subName, setSubName] = useState("");
  const [modalCatId, setModalCatId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCatId);
  const subcategories = selectedCategory?.subcategories ?? [];

  function openNew() {
    setEditing(null);
    setSubName("");
    setModalCatId(selectedCatId);
    setModalOpen(true);
  }

  function openEdit(sub: Subcategory) {
    setEditing(sub);
    setSubName(sub.name);
    setModalCatId(sub.categoryId);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!subName.trim() || !modalCatId) return;
    setLoading(true);
    const result = editing
      ? await updateSubcategory(editing.id, { name: subName })
      : await createSubcategory({ name: subName, categoryId: modalCatId });

    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else {
      toast({ title: editing ? "Subcategoria atualizada" : "Subcategoria criada" });
      setModalOpen(false);
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir subcategoria?")) return;
    await deleteSubcategory(id);
    toast({ title: "Subcategoria excluída" });
    window.location.reload();
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Select value={selectedCatId} onValueChange={setSelectedCatId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span>{cat.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{TYPE_LABELS[cat.type]}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory && (
            <span className="text-sm text-muted-foreground">
              {subcategories.length} subcategoria{subcategories.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Button size="sm" onClick={openNew} disabled={!selectedCatId}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Subcategoria
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium text-sm">{sub.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                  {selectedCategory?.name}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(sub)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(sub.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {subcategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  {selectedCatId ? "Nenhuma subcategoria nesta categoria" : "Selecione uma categoria"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={(o) => !o && setModalOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Subcategoria" : "Nova Subcategoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {!editing && (
              <div className="space-y-1.5">
                <Label>Categoria *</Label>
                <Select value={modalCatId} onValueChange={setModalCatId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} ({TYPE_LABELS[cat.type]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Nome da subcategoria"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading || !subName.trim() || !modalCatId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
