"use client";
import { useTranslations } from "next-intl";
import { HeroCocktailCarousel } from "./HeroCocktailCarousel";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center py-12 md:py-20">
      {/* Overlay to ensure readability and match other sections */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Content Container */}
      <div className="relative z-30 container px-4">
        <div className="flex flex-col items-center max-w-5xl mx-auto gap-12">
          {/* Central Logo */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 overflow-hidden">
            <Image
              src="/drinkingman-nobg2.png"
              alt="The Drinking Man"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Horizontal Carousel */}
          <div className="w-full">
            <HeroCocktailCarousel />
          </div>

          {/* Description Text - No Box/Border */}
          <div className="w-full max-w-3xl text-center flex flex-col gap-6">
            <p className="text-white text-base md:text-xl leading-relaxed whitespace-pre-line font-bold drop-shadow-lg">
              {t("drinkingManDescription1")}
            </p>
            {t("drinkingManDescription2") && (
              <p className="text-white/70 text-sm md:text-lg leading-relaxed whitespace-pre-line font-medium drop-shadow-md">
                {t("drinkingManDescription2")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
