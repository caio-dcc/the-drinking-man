"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified secret access for demonstration
    // In a real app, this should be a proper auth check
    if (password === "drinkingman2024") {
      // In a real app we would set a session cookie here
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/background-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-primary/20 rounded-full mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white font-secondary">
              Acesso Restrito
            </h1>
            <p className="text-white/60 text-sm mt-2">
              Digite a chave de acesso administrativa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Chave de Acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center text-lg tracking-widest ${
                  error ? "border-red-500 animate-shake" : ""
                }`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs text-center mt-2 animate-in fade-in slide-in-from-top-1">
                  Chave incorreta. Tente novamente.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-all"
            >
              Entrar no Painel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
