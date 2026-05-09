"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight, Tag, Check, X } from "lucide-react";
import {
  createCategory, updateCategory, deleteCategory,
  createSubcategory, updateSubcategory, deleteSubcategory,
} from "@/actions/categories";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Category, Subcategory, TransactionType } from "@prisma/client";

type CategoryWithSubs = Category & { subcategories: Subcategory[] };

interface CategoryManagerBaseProps {
  categories: CategoryWithSubs[];
  type: TransactionType;
  typeLabel: string;
}

export function CategoryManagerBase({ categories: initial, type, typeLabel }: CategoryManagerBaseProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState(initial);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Inline add category state
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatLoading, setNewCatLoading] = useState(false);

  // Edit category dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  // Subcategory inline state
  const [addingSubCatId, setAddingSubCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingSubName, setEditingSubName] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // --- Category actions ---

  function startAddingCat() {
    setIsAddingCat(true);
    setNewCatName("");
  }

  function cancelAddingCat() {
    setIsAddingCat(false);
    setNewCatName("");
  }

  async function handleSaveNewCat() {
    if (!newCatName.trim()) return;
    setNewCatLoading(true);
    const result = await createCategory({ name: newCatName.trim(), type });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else if ("data" in result && result.data) {
      setCategories((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)));
      cancelAddingCat();
      toast({ title: "Categoria criada" });
    }
    setNewCatLoading(false);
  }

  function openEdit(cat: Category) {
    setEditingCat(cat);
    setCatName(cat.name);
    setModalOpen(true);
  }

  async function handleSaveEditCat() {
    if (!editingCat || !catName.trim()) return;
    setCatLoading(true);
    const result = await updateCategory(editingCat.id, { name: catName });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else {
      setCategories((prev) =>
        prev.map((c) => c.id === editingCat.id ? { ...c, name: catName.trim() } : c)
      );
      setModalOpen(false);
      toast({ title: "Categoria atualizada" });
    }
    setCatLoading(false);
  }

  async function handleDeleteCat(id: string) {
    if (!confirm("Excluir categoria e todas as suas subcategorias?")) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Categoria excluída" });
  }

  // --- Subcategory actions ---

  function startAddSub(catId: string) {
    setAddingSubCatId(catId);
    setNewSubName("");
    setEditingSubId(null);
    if (!expanded.has(catId)) {
      setExpanded((prev) => new Set(prev).add(catId));
    }
  }

  function cancelAddSub() {
    setAddingSubCatId(null);
    setNewSubName("");
  }

  async function handleSaveNewSub(catId: string) {
    if (!newSubName.trim()) return;
    setSubLoading(true);
    const result = await createSubcategory({ name: newSubName.trim(), categoryId: catId });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else if ("data" in result && result.data) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? { ...c, subcategories: [...c.subcategories, result.data!].sort((a, b) => a.name.localeCompare(b.name)) }
            : c
        )
      );
      setNewSubName("");
      setAddingSubCatId(null);
      toast({ title: "Subcategoria criada" });
    }
    setSubLoading(false);
  }

  function startEditSub(sub: Subcategory) {
    setEditingSubId(sub.id);
    setEditingSubName(sub.name);
    setAddingSubCatId(null);
  }

  function cancelEditSub() {
    setEditingSubId(null);
    setEditingSubName("");
  }

  async function handleSaveEditSub(catId: string) {
    if (!editingSubId || !editingSubName.trim()) return;
    setSubLoading(true);
    const result = await updateSubcategory(editingSubId, { name: editingSubName.trim() });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? { ...c, subcategories: c.subcategories.map((s) => s.id === editingSubId ? { ...s, name: editingSubName.trim() } : s) }
            : c
        )
      );
      setEditingSubId(null);
      toast({ title: "Subcategoria atualizada" });
    }
    setSubLoading(false);
  }

  async function handleDeleteSub(catId: string, subId: string) {
    if (!confirm("Excluir esta subcategoria?")) return;
    await deleteSubcategory(subId);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) } : c
      )
    );
    toast({ title: "Subcategoria excluída" });
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {categories.length} categoria{categories.length !== 1 ? "s" : ""} de {typeLabel.toLowerCase()}
        </p>
      </div>

      <div className="rounded-xl border bg-card divide-y">
        {categories.length === 0 && !isAddingCat && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            Nenhuma categoria cadastrada
          </div>
        )}

        {categories.map((cat) => {
          const isOpen = expanded.has(cat.id);
          const isAddingHere = addingSubCatId === cat.id;

          return (
            <div key={cat.id}>
              {/* Category row */}
              <div
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group cursor-pointer"
                onClick={() => toggleExpand(cat.id)}
              >
                <button
                  className="h-4 w-4 text-muted-foreground shrink-0"
                  onClick={(e) => { e.stopPropagation(); toggleExpand(cat.id); }}
                >
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm flex-1">{cat.name}</span>
                <Badge variant="outline" className="text-xs shrink-0">
                  {cat.subcategories.length} subcategoria{cat.subcategories.length !== 1 ? "s" : ""}
                </Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); openEdit(cat); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCat(cat.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Subcategory rows */}
              {isOpen && (
                <>
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 px-4 py-2.5 pl-12 bg-muted/20 border-t group/sub">
                      {editingSubId === sub.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            className="h-7 text-sm"
                            value={editingSubName}
                            onChange={(e) => setEditingSubName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEditSub(cat.id);
                              if (e.key === "Escape") cancelEditSub();
                            }}
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={() => handleSaveEditSub(cat.id)} disabled={subLoading}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEditSub}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-muted-foreground flex-1">{sub.name}</span>
                          <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditSub(sub)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteSub(cat.id, sub.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Add subcategory row */}
                  {isAddingHere ? (
                    <div className="flex items-center gap-3 px-4 py-2.5 pl-12 bg-muted/10 border-t">
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          className="h-7 text-sm"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder="Nome da subcategoria"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveNewSub(cat.id);
                            if (e.key === "Escape") cancelAddSub();
                          }}
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={() => handleSaveNewSub(cat.id)} disabled={subLoading || !newSubName.trim()}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelAddSub}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2 pl-12 border-t",
                        "text-sm text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/20 transition-colors text-left"
                      )}
                      onClick={() => startAddSub(cat.id)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adicionar subcategoria
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Inline add category row */}
        {isAddingCat ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/10">
            <div className="h-4 w-4 shrink-0" />
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <Input
                className="h-7 text-sm"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={`Nome da categoria de ${typeLabel.toLowerCase()}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveNewCat();
                  if (e.key === "Escape") cancelAddingCat();
                }}
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={handleSaveNewCat} disabled={newCatLoading || !newCatName.trim()}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelAddingCat}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/20 transition-colors text-left"
            onClick={startAddingCat}
          >
            <div className="h-4 w-4 shrink-0" />
            <Plus className="h-3.5 w-3.5" />
            Adicionar categoria
          </button>
        )}
      </div>

      {/* Edit category dialog */}
      <Dialog open={modalOpen} onOpenChange={(o) => !o && setModalOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar Categoria de {typeLabel}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-1.5 block">Nome *</Label>
            <Input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder={`Nome da categoria de ${typeLabel.toLowerCase()}`}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEditCat()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEditCat} disabled={catLoading || !catName.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
