import { Badge } from "@/components/ui/badge";
import ReflectiveCard from "@/components/ui/ReflectiveCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Languages, ScrollText } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AboutSection() {
  const t = await getTranslations("About");

  return (
    <section
      id="about"
      className="py-24 bg-transparent relative overflow-hidden"
    >
      {/* Overlay to match HeroSection darkness */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-secondary text-white mb-4">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Reflective Card - Profile */}
          <div className="flex justify-center md:col-span-2 lg:col-span-1 lg:row-span-2">
            <ReflectiveCard />
          </div>

          {/* Certifications */}
          <Card className="bg-card border-primary/10 hover:border-primary/30 transition-colors shadow-lg">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Award className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-secondary text-card-foreground">
                {t("certifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium leading-none">
                    {t("webDevDegree")}
                  </p>
                  <p className="text-sm text-secondary/80 mt-1">
                    {t("anhanguera")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium leading-none">
                    {t("frontendSpecialist")}
                  </p>
                  <p className="text-sm text-secondary/80 mt-1">
                    {t("frontendDescription")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium leading-none">{t("aluraCert")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium leading-none">
                    Diageo Bar Academy{" "}
                    <span className="text-secondary/80 font-normal">
                      — Mixologia e Bartender
                    </span>
                  </p>
                  <ul className="text-sm text-secondary/80 mt-1 space-y-1 list-none">
                    <li>• Bar Essentials</li>
                    <li>• {t("diageoSimpleCocktails")}</li>
                    <li>• {t("diageoFoodDrinks")}</li>
                    <li>• {t("diageoServingRecommending")}</li>
                    <li>• {t("diageoLeadershipNegotiation")}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-card border-primary/10 hover:border-primary/30 transition-colors shadow-lg">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Languages className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-secondary text-card-foreground">
                {t("languages")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-card-foreground">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("english")}</span>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {t("advanced")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("portuguese")}</span>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {t("native")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Philosophy */}
          <Card className="relative overflow-hidden border-none hover:border-none transition-colors shadow-lg md:col-span-2 lg:col-span-1 group">
            <div
              className="absolute inset-0 z-0 opacity-60 group-hover:opacity-80 transition-opacity duration-700"
              style={{
                backgroundImage: "url('/bukowski.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

            <CardHeader className="relative z-10 flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-white/10 rounded-full text-white backdrop-blur-sm">
                <ScrollText className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-secondary text-white">
                {t("philosophy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-white/90 italic font-medium leading-relaxed">
                "{t("quote")}"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
