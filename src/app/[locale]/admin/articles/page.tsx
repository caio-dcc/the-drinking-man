"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ArrowLeft,
  FileText,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getArticles, deleteArticle } from "@/lib/actions/adminActions";

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") router.push("/admin");

    fetchArticles();
  }, [router]);

  async function fetchArticles() {
    const data = await getArticles();
    setArticles(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      const result = await deleteArticle(id);
      if (result.success) {
        fetchArticles();
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1310] text-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center text-white/60 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Painel
            </Link>
            <h1 className="text-3xl font-bold font-secondary text-primary">
              Gerenciar Artigos
            </h1>
          </div>
          <Link href="/admin/articles/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <PlusCircle className="h-5 w-5 mr-2" />
              Novo Artigo
            </Button>
          </Link>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {loading ? (
            <div className="p-12 text-center text-white/40">
              Carregando artigos...
            </div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center text-white/40">
              Nenhum artigo encontrado.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{article.title}</h3>
                      <p className="text-sm text-white/40">
                        {new Date(article.createdAt).toLocaleDateString()} • por{" "}
                        {article.author}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/articles/${article.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/40 hover:text-white hover:bg-white/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(article.id)}
                      className="text-white/40 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
