"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import cocktailsData from "@/data/cocktails.json";
import { Cocktail } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

export function HeroCocktailCarousel() {
  const [randomCocktails, setRandomCocktails] = useState<Cocktail[]>([]);

  useEffect(() => {
    // Shuffle and pick 5
    const shuffled = [...cocktailsData].sort(() => 0.5 - Math.random());
    setRandomCocktails(shuffled.slice(0, 5) as unknown as Cocktail[]);
  }, []);

  if (randomCocktails.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {randomCocktails.map((cocktail) => (
            <CarouselItem key={cocktail.idDrink}>
              <div className="p-1">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden rounded-3xl">
                  <CardContent className="flex flex-col md:flex-row items-center p-6 gap-8">
                    <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                      <Image
                        src={cocktail.strDrinkThumb}
                        alt={cocktail.strDrink}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                      <span className="text-white font-bold text-3xl md:text-4xl mb-3 drop-shadow-md">
                        {cocktail.strDrink}
                      </span>
                      <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed max-w-lg">
                        {/* @ts-ignore -- properties exist in JSON but not in strict type yet */}
                        {cocktail.descriptionPT ||
                          cocktail.descriptionEN ||
                          "Uma deliciosa combinação de sabores."}
                      </p>
                      <Link
                        href={`/cocktails/${cocktail.idDrink}`}
                        className="text-sm bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-all backdrop-blur-md border border-white/10 w-fit"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-12 border-white/20 text-white hover:bg-white/20 hover:text-white h-12 w-12" />
          <CarouselNext className="-right-12 border-white/20 text-white hover:bg-white/20 hover:text-white h-12 w-12" />
        </div>
      </Carousel>
    </div>
  );
}
