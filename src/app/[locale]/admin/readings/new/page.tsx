"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, BookOpen, Link as LinkIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createReading } from "@/lib/actions/adminActions";

export default function NewReadingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    link: "",
    image: "",
    review: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") router.push("/admin");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createReading(formData);

    setIsSubmitting(false);

    if (result.success) {
      alert("Recomendação de leitura salva!");
      router.push("/admin/dashboard");
    } else {
      alert("Erro ao salvar: " + result.error);
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
            Nova Leitura
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Título do Livro/Artigo
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-white/5 border-white/10 h-12 focus:border-primary/50"
                placeholder="Ex: Liquid Intelligence"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Autor</label>
              <Input
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="bg-white/5 border-white/10 h-10 focus:border-primary/50"
                placeholder="Ex: Dave Arnold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Link de Compra/Acesso
                </label>
                <div className="relative">
                  <Input
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="bg-white/5 border-white/10 h-10 pl-10 focus:border-primary/50"
                    placeholder="https://amazon.com/..."
                  />
                  <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-white/30" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  URL da Capa
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-10 focus:border-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Sua Resenha/Comentário
              </label>
              <Textarea
                value={formData.review}
                onChange={(e) =>
                  setFormData({ ...formData, review: e.target.value })
                }
                className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[150px] resize-y"
                placeholder="O que você achou dessa leitura?"
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
                    Salvar Recomendação
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
