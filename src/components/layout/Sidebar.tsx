"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Receipt,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/financeiro", label: "Financeiro", icon: Receipt },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ onNavigate, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "U";

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[#071728] text-white overflow-hidden transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo + toggle */}
      <div className={cn(
        "flex items-center border-b border-white/8 shrink-0 px-3 py-5",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {collapsed ? (
          <button onClick={onToggle} title="Expandir" className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt="Planetário"
              className="h-7 w-auto object-contain"
            />
          </button>
        ) : (
          <>
            <span className="text-white text-base font-semibold tracking-wide">Planetário</span>
            {onToggle && (
              <button
                onClick={onToggle}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                title="Recolher"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav section label */}
      {!collapsed && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Menu
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className={cn("flex-1 px-2 space-y-0.5", collapsed ? "pt-4" : "pt-1")}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-0",
                active
                  ? "bg-[#1A5FB4] text-white shadow-sm shadow-blue-900/40"
                  : "text-white/55 hover:bg-white/8 hover:text-white/90"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-white/50")} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-2 border-t border-white/8 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <Avatar className="h-7 w-7 ring-1 ring-white/20">
              <AvatarFallback className="bg-[#1A5FB4] text-white text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              className="h-7 w-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
            <Avatar className="h-8 w-8 shrink-0 ring-1 ring-white/20">
              <AvatarFallback className="bg-[#1A5FB4] text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-white/90">{session?.user?.name ?? "Usuário"}</p>
              <p className="text-[10px] text-white/40 truncate">{session?.user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-white/40 hover:text-white hover:bg-white/10"
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
