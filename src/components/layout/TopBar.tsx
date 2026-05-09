"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/financeiro": "Financeiro",
  "/dashboard": "Dashboard",
  "/configuracoes": "Configurações",
};

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const title = Object.entries(pageTitles).find(([key]) =>
    pathname.startsWith(key)
  )?.[1] ?? "Sistema";

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden -ml-1">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>
    </header>
  );
}
