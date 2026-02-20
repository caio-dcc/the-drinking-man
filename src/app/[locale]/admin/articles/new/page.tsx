"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createArticle } from "@/lib/actions/adminActions";

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    image: "",
    author: "The Drinking Man",
    published: true,
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") router.push("/admin");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createArticle(formData);

    setIsSubmitting(false);

    if (result.success) {
      alert("Artigo salvo com sucesso!");
      router.push("/admin/dashboard");
    } else {
      alert("Erro ao salvar artigo: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1310] text-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Dashboard
        </Link>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h1 className="text-3xl font-bold font-secondary mb-8 text-primary">
            Novo Artigo
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Título
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]/g, "");
                  setFormData({ ...formData, title, slug });
                }}
                className="bg-white/5 border-white/10 h-12 focus:border-primary/50 transition-colors"
                placeholder="Ex: A Arte do Gelo Transparente"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Slug (URL)
                </label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-10 text-white/60 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Autor
                </label>
                <Input
                  required
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-10 focus:border-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                URL da Imagem
              </label>
              <div className="relative">
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-10 pl-10 focus:border-primary/50"
                  placeholder="https://images.unsplash.com/..."
                />
                <ImageIcon className="absolute left-3 top-2.5 h-5 w-5 text-white/30" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Conteúdo (Markdown/HTML)
              </label>
              <Textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[300px] resize-y font-mono text-sm"
                placeholder="Escreva seu artigo aqui..."
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-all"
              >
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Salvar Artigo
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
