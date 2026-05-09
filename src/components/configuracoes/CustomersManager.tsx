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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Loader2, Check, X } from "lucide-react";
import { createCustomer, updateCustomer, deleteCustomer } from "@/actions/customers";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@prisma/client";

interface CustomersManagerProps {
  customers: Customer[];
}

export function CustomersManager({ customers: initial }: CustomersManagerProps) {
  const { toast } = useToast();
  const [customers, setCustomers] = useState(initial);

  // Edit dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Inline add state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  function openEdit(cust: Customer) {
    setEditing(cust);
    setEditName(cust.name);
    setEditEmail(cust.email ?? "");
    setEditPhone(cust.phone ?? "");
    setModalOpen(true);
  }

  async function handleSaveEdit() {
    if (!editing || !editName.trim()) return;
    setEditLoading(true);
    const result = await updateCustomer(editing.id, { name: editName, email: editEmail, phone: editPhone });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else if ("data" in result && result.data) {
      setCustomers((prev) => prev.map((c) => c.id === editing.id ? result.data! : c));
      setModalOpen(false);
      toast({ title: "Cliente atualizado" });
    }
    setEditLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Desativar cliente?")) return;
    await deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Cliente desativado" });
  }

  function startAdding() {
    setIsAdding(true);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  }

  function cancelAdding() {
    setIsAdding(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  }

  async function handleSaveNew() {
    if (!newName.trim()) return;
    setAddLoading(true);
    const result = await createCustomer({ name: newName, email: newEmail, phone: newPhone });
    if ("error" in result && result.error) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    } else if ("data" in result && result.data) {
      setCustomers((prev) => [...prev, result.data!].sort((a, b) => a.name.localeCompare(b.name)));
      cancelAdding();
      toast({ title: "Cliente criado" });
    }
    setAddLoading(false);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{customers.length} cliente{customers.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">E-mail</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((cust) => (
              <TableRow key={cust.id}>
                <TableCell className="font-medium">{cust.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                  {cust.email ?? "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {cust.phone ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={cust.active ? "default" : "secondary"} className="text-xs">
                    {cust.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cust)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {cust.active && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cust.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Inline add row */}
            {isAdding ? (
              <TableRow>
                <TableCell className="py-2">
                  <Input
                    className="h-7 text-sm"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome *"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveNew();
                      if (e.key === "Escape") cancelAdding();
                    }}
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2">
                  <Input
                    className="h-7 text-sm"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="E-mail"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveNew();
                      if (e.key === "Escape") cancelAdding();
                    }}
                  />
                </TableCell>
                <TableCell className="hidden md:table-cell py-2">
                  <Input
                    className="h-7 text-sm"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Telefone"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveNew();
                      if (e.key === "Escape") cancelAdding();
                    }}
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={handleSaveNew} disabled={addLoading || !newName.trim()}>
                      {addLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelAdding}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={startAdding}
              >
                <TableCell colSpan={5} className="py-2.5 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <span className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar cliente
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={(o) => !o && setModalOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail</Label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="(61) 99999-9999" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={editLoading || !editName.trim()}>
              {editLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
