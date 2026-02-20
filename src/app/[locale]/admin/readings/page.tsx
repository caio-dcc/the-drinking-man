"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ArrowLeft,
  BookOpen,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getReadings } from "@/lib/actions/adminActions";

export default function AdminReadingsPage() {
  const router = useRouter();
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") router.push("/admin");

    fetchReadings();
  }, [router]);

  async function fetchReadings() {
    const data = await getReadings();
    setReadings(data);
    setLoading(false);
  }

  // Add delete functionality for readings later if needed,
  // following the same pattern as articles.

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
              Gerenciar Leituras
            </h1>
          </div>
          <Link href="/admin/readings/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <PlusCircle className="h-5 w-5 mr-2" />
              Nova Leitura
            </Button>
          </Link>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {loading ? (
            <div className="p-12 text-center text-white/40">
              Carregando leituras...
            </div>
          ) : readings.length === 0 ? (
            <div className="p-12 text-center text-white/40">
              Nenhuma recomendação encontrada.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{reading.title}</h3>
                      <p className="text-sm text-white/40">
                        {reading.author}{" "}
                        {reading.link && `• ${new URL(reading.link).hostname}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {reading.link && (
                      <Link href={reading.link} target="_blank">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/40 hover:text-white hover:bg-white/10"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
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
