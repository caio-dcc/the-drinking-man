"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  LogOut,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#1a1310] text-white">
      {/* Sidebar-like header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="font-bold font-secondary text-xl tracking-wide">
              ADMIN DASHBOARD
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Articles Management Card */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
              <Link href="/admin/articles/new">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Novo Artigo
                </Button>
              </Link>
            </div>
            <h2 className="text-2xl font-bold mb-2">Artigos</h2>
            <p className="text-white/60 mb-8">
              Gerencie os posts do blog, notícias e guias de mixologia.
            </p>
            <Link
              href="/admin/articles"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Ver todos os artigos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Readings Management Card */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <BookOpen className="h-8 w-8 text-green-400" />
              </div>
              <Link href="/admin/readings/new">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-500 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Nova Leitura
                </Button>
              </Link>
            </div>
            <h2 className="text-2xl font-bold mb-2">Leituras</h2>
            <p className="text-white/60 mb-8">
              Recomendações de livros, sites e revistas sobre coquetelaria.
            </p>
            <Link
              href="/admin/readings"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Gerenciar recomendações
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
