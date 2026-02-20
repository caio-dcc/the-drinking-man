import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function ArticleDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article) notFound();

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
      <article className="container mx-auto max-w-3xl">
        <Link
          href="/articles"
          className="inline-flex items-center text-white/60 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Artigos
        </Link>

        {article.image && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          <div className="flex flex-wrap items-center gap-6 mb-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {article.author}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-secondary text-white mb-10 leading-tight">
            {article.title}
          </h1>

          <div className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed prose-headings:font-secondary max-w-none whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </article>
    </div>
  );
}
