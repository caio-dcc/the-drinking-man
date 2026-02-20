import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";

export default async function ArticlesPage() {
  const t = await getTranslations("Articles");

  const articles = await db.article.findMany({
    where: { published: true },
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

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-white/50 text-xl">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:border-primary/30 transition-all group overflow-hidden h-full">
                  {article.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 px-2 bg-primary/20 rounded text-[10px] text-primary font-bold uppercase tracking-wider">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                      <span className="text-white/40 text-xs">
                        por {article.author}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4">
                      {article.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center text-primary text-sm font-bold">
                      Ler mais{" "}
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
