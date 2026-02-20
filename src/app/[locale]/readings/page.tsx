import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";

export default async function ReadingsPage() {
  const t = await getTranslations("Readings");

  const readings = await db.reading.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{
        backgroundImage: "url('/background-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-secondary text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
        </div>

        {readings.length === 0 ? (
          <div className="text-center py-20 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-white/50 text-xl">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readings.map((reading) => (
              <Card
                key={reading.id}
                className="bg-black/40 backdrop-blur-md border-white/10 hover:border-primary/20 transition-all flex flex-col h-full"
              >
                {reading.image && (
                  <div className="h-64 overflow-hidden relative border-b border-white/5">
                    <img
                      src={reading.image}
                      alt={reading.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                      Recomendação
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {reading.title}
                  </h2>
                  {reading.author && (
                    <p className="text-sm text-white/50 mb-4">
                      de {reading.author}
                    </p>
                  )}
                  {reading.review && (
                    <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
                      "{reading.review}"
                    </p>
                  )}
                  {reading.link && (
                    <a
                      href={reading.link}
                      target="_blank"
                      className="inline-flex items-center justify-center w-full py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded transition-colors border border-white/10"
                    >
                      Ver na Loja <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
