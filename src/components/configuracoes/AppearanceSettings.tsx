"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Claro", icon: Sun, description: "Interface clara para ambientes iluminados" },
  { value: "dark", label: "Escuro", icon: Moon, description: "Interface escura para reduzir cansaço visual" },
  { value: "system", label: "Sistema", icon: Monitor, description: "Segue a preferência do seu sistema operacional" },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="text-sm font-semibold mb-1">Tema</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Escolha como a interface deve ser exibida.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon, description }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={cn("text-sm font-medium", active && "text-primary")}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
