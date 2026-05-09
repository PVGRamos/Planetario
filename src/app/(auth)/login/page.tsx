"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071728] p-4 relative overflow-hidden">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#071728]/70" />
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-white text-2xl font-semibold tracking-wide">Planetário</span>
          <p className="text-sm text-white/40 tracking-wide">Sistema Financeiro</p>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-black/40">
          <CardHeader className="space-y-1 pb-5">
            <CardTitle className="text-white text-lg">Entrar na conta</CardTitle>
            <CardDescription className="text-white/40">
              Use suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/70 text-xs font-medium">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="bg-white/8 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[#2574D4] focus-visible:border-[#2574D4] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-white/70 text-xs font-medium">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-white/8 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[#2574D4] focus-visible:border-[#2574D4] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1A5FB4] hover:bg-[#2574D4] text-white font-medium mt-2 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-5 p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1.5">Acesso de teste</p>
              <p className="text-xs text-white/50 font-mono">admin@planetacargas.com.br</p>
              <p className="text-xs text-white/50 font-mono">admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
