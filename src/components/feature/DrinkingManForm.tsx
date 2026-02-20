"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { askDrinkingMan } from "@/services/geminiApi";
import { DrinkingManPreferences, DrinkingManResponse } from "@/types";
import { Loader2, Sparkles, Wine, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { cocktailApi } from "@/services/cocktailApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

import { FlavorSlider } from "@/components/feature/FlavorSlider";
import { VisualMoodSelector } from "@/components/feature/VisualMoodSelector";

import { useSearchParams } from "next/navigation";
import localCocktailsData from "@/data/cocktails.json";
import { Cocktail } from "@/types";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function DrinkingManForm() {
  const t = useTranslations("DrinkingMan");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DrinkingManResponse | null>(null);

  // Bar Context from URL
  const barName = searchParams.get("barName");
  const unavailableIngredients =
    searchParams.get("unavailable")?.split(",") || [];

  // Calculate available ingredients for the prompt (Inverted logic: Prompt needs VALID ingredients, or we pass the blacklist?)
  // Actually, my geminiApi logic accepts "availableIngredients".
  // If I pass a blacklist, I need to handle it.
  // But wait, the `geminiApi` update I made expects "availableIngredients".
  // The Bar Registration page generates "unavailable" list (what is OFF).
  // The logic in `askDrinkingMan` says: "You can ONLY use the following ingredients: ${availableIngredients}".
  // So I need to pass the ALLOWED list.
  // Converting "unavailable" blacklist to "available" whitelist is hard without a full database of ALL ingredients.
  // BETTER APPROACH: Update `askDrinkingMan` to accept `unavailableIngredients` (Blacklist) instead of Whitelist.
  // It's safer to say "DO NOT USE: Mint, Lime" than "ONLY USE: Vodka, Gin...".

  // Let's stick to the current plan but I need to modify `geminiApi.ts` again to support BLACKLISTING,
  // because Whitelisting requires sending the ENTIRE universe of ingredients every time.
  // Or I can just pass the "Common Ingredients" MINUS "Unavailable".

  // Refined Logic:
  // 1. Get `unavailable` from URL.
  // 2. We don't have the full list of ingredients on the client side `DrinkingManForm`, only in `useBarStore` (which is for the Bar Admin).
  // 3. User doesn't have `useBarStore` populated.

  // Decision: I will modify `askDrinkingMan` to accept `unavailableIngredients` instead of `available`.
  // This is much more robust for an "Open World" cocktail AI.

  const [sliderValues, setSliderValues] = useState({
    sweetBitter: 50,
    smoothStrong: 50,
    refreshingHeavy: 50,
  });

  const [formData, setFormData] = useState<DrinkingManPreferences>({
    baseSpirit: "",
    flavorProfile: [],
    occasion: "",
    mood: "",
  });

  const [visualImages, setVisualImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientDropdownOpen, setIngredientDropdownOpen] = useState(false);

  const [dbIngredients, setDbIngredients] = useState<
    { id: string; name: string }[]
  >([]);

  // Fetch ingredients from DB on mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch("/api/ingredients");
        const data = await res.json();
        if (!data.error) {
          setDbIngredients(data);
        }
      } catch (e) {
        console.error("Error fetching ingredients:", e);
      }
    };
    fetchIngredients();
  }, []);

  // Use DB ingredients if available, else fallback to local derive
  const allIngredients = useMemo(() => {
    if (dbIngredients.length > 0) {
      return dbIngredients.map((i) => i.name).sort();
    }
    const localCocktails = localCocktailsData as unknown as Cocktail[];
    const set = new Set<string>();
    localCocktails.forEach((c) => {
      for (let i = 1; i <= 15; i++) {
        const ing = c[`strIngredient${i}` as keyof Cocktail] as string;
        if (ing && ing.trim()) set.add(ing.trim());
      }
    });
    return [...set].sort();
  }, [dbIngredients]);

  const filteredIngredients = allIngredients.filter(
    (ing: string) =>
      ing.toLowerCase().includes(ingredientSearch.toLowerCase()) &&
      !selectedIngredients.includes(ing),
  );

  useEffect(() => {
    if (response) {
      const fetchImages = async () => {
        setIsLoadingImages(true);
        try {
          const searchTerm = response.visualMatch || response.name;
          let drinks = await cocktailApi.searchByName(searchTerm);
          if (!drinks || drinks.length === 0) {
            // Fallback to searching by name if visualMatch returns nothing
            drinks = await cocktailApi.searchByName(response.name);
          }
          if (!drinks || drinks.length === 0) {
            // Second fallback: Search by Base Spirit (guaranteed results usually)
            // We use filterByIngredient which is slightly different but robust
            const spirit =
              formData.baseSpirit !== "None" ? formData.baseSpirit : "Vodka";
            // Note: cocktailApi doesn't have filterByIngredient exposed directly in the interface I saw?
            // Let's check cocktailApi.ts. It has filterByCategory, filterByAlcoholic.
            // I will use searchByName with the spirit as a fallback, which acts like a search.
            drinks = await cocktailApi.searchByName(spirit);
          }
          if (drinks && drinks.length > 0) {
            setVisualImages(drinks.slice(0, 4).map((d) => d.strDrinkThumb));
          } else {
            setVisualImages([]);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
          setVisualImages([]);
        } finally {
          setIsLoadingImages(false);
        }
      };
      fetchImages();
    }
  }, [response]);

  /*
   * Convert slider values (0-100) to meaningful descriptive strings for the AI.
   * This logic maps the user's analog input to the digital prompt.
   */
  const getMappedFlavors = () => {
    const flavors = [];

    // Sweet <-> Bitter
    if (sliderValues.sweetBitter < 30) flavors.push("Very Sweet");
    else if (sliderValues.sweetBitter < 45) flavors.push("Sweet");
    else if (sliderValues.sweetBitter > 70) flavors.push("Very Bitter");
    else if (sliderValues.sweetBitter > 55) flavors.push("Bitter");
    else flavors.push("Balanced Sweet/Bitter");

    // Smooth <-> Strong
    if (sliderValues.smoothStrong < 30)
      flavors.push("Very Smooth", "Easy to Drink");
    else if (sliderValues.smoothStrong < 45) flavors.push("Smooth");
    else if (sliderValues.smoothStrong > 70)
      flavors.push("Very Strong", "High Alcohol");
    else if (sliderValues.smoothStrong > 55) flavors.push("Strong");
    else flavors.push("Standard Strength");

    // Refreshing <-> Heavy
    if (sliderValues.refreshingHeavy < 30)
      flavors.push("Very Refreshing", "Light Body");
    else if (sliderValues.refreshingHeavy < 45) flavors.push("Refreshing");
    else if (sliderValues.refreshingHeavy > 70)
      flavors.push("Heavy Body", "Complex", "Creamy/Thick");
    else if (sliderValues.refreshingHeavy > 55) flavors.push("Full Body");
    else flavors.push("Medium Body");

    return flavors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked");

    // Validation
    if (!formData.baseSpirit) {
      alert(t("errors.missingSpirit") || "Please select a base spirit.");
      return;
    }
    if (!formData.occasion) {
      alert(t("errors.missingOccasion") || "Please select an occasion.");
      return;
    }
    if (!formData.mood) {
      alert(t("errors.missingMood") || "Please select a mood.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const submissionData = {
        ...formData,
        flavorProfile: getMappedFlavors(),
      };

      console.log(
        "Submitting to Drinking Man:",
        JSON.stringify(submissionData, null, 2),
      );
      console.log("Selected Ingredients:", selectedIngredients);
      console.log("Unavailable Ingredients:", unavailableIngredients);

      const result = await askDrinkingMan(
        submissionData,
        locale,
        unavailableIngredients,
        selectedIngredients,
      );

      if (!result) {
        alert(
          "Sorry, The Drinking Man is taking a nap (API Error). Please try again.",
        );
        console.error("API returned null");
      } else if (result.error) {
        alert(`Drinking Man Error: ${result.error}`);
        console.error("API returned error:", result.error);
      } else {
        setResponse(result);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-20 bg-transparent relative overflow-hidden"
      id="drinkingman"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Badge removed as per user request */}
          <h2 className="text-3xl md:text-5xl font-bold font-secondary text-white mb-4 drop-shadow-lg">
            {t("title")}
          </h2>
          <p className="text-white/60 max-w-2xl drop-shadow-md">
            {t("subtitle")}
          </p>

          {barName && (
            <div className="mt-4 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center animate-in fade-in slide-in-from-top-4">
              <Wine className="w-4 h-4 mr-2" />
              Connected to {barName}
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          {!response ? (
            <Card className="bg-transparent shadow-none border-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-3xl font-secondary text-white">
                  <Bot className="mr-3 h-8 w-8 text-primary" />
                  {t("preferences")}
                </CardTitle>
                <p className="text-center text-white/80">
                  {t("preferencesDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          {t("baseSpirit")}
                        </label>
                        <Select
                          onValueChange={(val) =>
                            setFormData({ ...formData, baseSpirit: val })
                          }
                          required
                          value={formData.baseSpirit}
                        >
                          <SelectTrigger className="w-full bg-white text-[#5C3A2E] border-[#5C3A2E]/30 shadow-sm font-medium h-12">
                            <SelectValue placeholder={t("placeholderSpirit")} />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-[#5C3A2E]">
                            {[
                              "Vodka",
                              "Gin",
                              "Rum",
                              "Tequila",
                              "Whiskey",
                              "Mezcal",
                              "Brandy",
                              "None",
                            ].map((spirit) => (
                              <SelectItem
                                key={spirit}
                                value={spirit}
                                className="text-[#5C3A2E] focus:bg-[#5C3A2E]/10 cursor-pointer"
                              >
                                {spirit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          {t("occasion")}
                        </label>
                        <Select
                          onValueChange={(val) =>
                            setFormData({ ...formData, occasion: val })
                          }
                          required
                          value={formData.occasion}
                        >
                          <SelectTrigger className="w-full bg-white text-[#5C3A2E] border-[#5C3A2E]/30 shadow-sm font-medium h-12">
                            <SelectValue
                              placeholder={t("placeholderOccasion")}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-[#5C3A2E]">
                            {[
                              "Date Night",
                              "Party",
                              "Relaxing",
                              "Business",
                              "Celebration",
                              "Casual",
                            ].map((o) => (
                              <SelectItem
                                key={o}
                                value={o}
                                className="text-[#5C3A2E] focus:bg-[#5C3A2E]/10 cursor-pointer"
                              >
                                {t(`occasions.${o}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-4">
                        {t("flavorProfile")}
                      </label>
                      <div className="space-y-6 bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                        <FlavorSlider
                          labelLeft={t("sliders.sweet")}
                          labelRight={t("sliders.bitter")}
                          value={sliderValues.sweetBitter}
                          onChange={(val) =>
                            setSliderValues({
                              ...sliderValues,
                              sweetBitter: val,
                            })
                          }
                        />
                        <FlavorSlider
                          labelLeft={t("sliders.smooth")}
                          labelRight={t("sliders.strong")}
                          value={sliderValues.smoothStrong}
                          onChange={(val) =>
                            setSliderValues({
                              ...sliderValues,
                              smoothStrong: val,
                            })
                          }
                        />
                        <FlavorSlider
                          labelLeft={t("sliders.refreshing")}
                          labelRight={t("sliders.heavy")}
                          value={sliderValues.refreshingHeavy}
                          onChange={(val) =>
                            setSliderValues({
                              ...sliderValues,
                              refreshingHeavy: val,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-4 text-center">
                      {t("mood")}
                    </label>
                    <VisualMoodSelector
                      options={[
                        {
                          id: "Happy",
                          label: t("moods.Happy"),
                          emoji: "😊",
                          color: "bg-yellow-100",
                        },
                        {
                          id: "Melancholic",
                          label: t("moods.Melancholic"),
                          emoji: "🌧️",
                          color: "bg-blue-100",
                        },
                        {
                          id: "Adventurous",
                          label: t("moods.Adventurous"),
                          emoji: "🚀",
                          color: "bg-red-100",
                        },
                        {
                          id: "Tired",
                          label: t("moods.Tired"),
                          emoji: "😴",
                          color: "bg-gray-100",
                        },
                        {
                          id: "Energetic",
                          label: t("moods.Energetic"),
                          emoji: "⚡",
                          color: "bg-orange-100",
                        },
                        {
                          id: "Romantic",
                          label: t("moods.Romantic"),
                          emoji: "🌹",
                          color: "bg-pink-100",
                        },
                      ]}
                      selectedMood={formData.mood}
                      onSelect={(moodId) =>
                        setFormData({ ...formData, mood: moodId })
                      }
                    />
                  </div>

                  {/* Ingredient Multi-Select */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-4 text-center">
                      {t("ingredientsLabel")}
                    </label>
                    <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                      {selectedIngredients.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedIngredients.map((ing) => (
                            <Badge
                              key={ing}
                              variant="outline"
                              className="text-white border-white/40 bg-white/10 cursor-pointer hover:bg-red-500/30 transition-colors"
                              onClick={() =>
                                setSelectedIngredients((prev) =>
                                  prev.filter((i) => i !== ing),
                                )
                              }
                            >
                              {ing}
                              <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <Input
                          placeholder={t("ingredientSearchPlaceholder")}
                          value={ingredientSearch}
                          onChange={(e) => setIngredientSearch(e.target.value)}
                          onFocus={() => setIngredientDropdownOpen(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setIngredientDropdownOpen(false),
                              200,
                            )
                          }
                          className="!bg-white/10 !border-white/20 !text-white placeholder:!text-white/40 h-10"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "white",
                          }}
                        />
                        {ingredientDropdownOpen &&
                          filteredIngredients.length > 0 && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#2a1f1a] border border-white/20 rounded-lg max-h-48 overflow-y-auto shadow-xl">
                              {filteredIngredients.slice(0, 30).map((ing) => (
                                <button
                                  key={ing}
                                  type="button"
                                  className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setSelectedIngredients((prev: string[]) => [
                                      ...prev,
                                      ing,
                                    ]);
                                    setIngredientSearch("");
                                  }}
                                >
                                  {ing}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xl py-8 rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        {t("mixing")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-6 w-6" />
                        {t("submit")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <Card className="border-none bg-transparent shadow-none overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader className="text-center pb-2 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setResponse(null)}
                  >
                    ← {t("back")}
                  </Button>
                  <div className="mx-auto bg-white/10 p-3 rounded-full w-fit mb-4 mt-8 backdrop-blur-md">
                    <Wine className="w-8 h-8 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="mx-auto mb-2 border-white/30 text-white/80"
                  >
                    {t("suggests")}
                  </Badge>
                  <CardTitle className="text-4xl font-secondary text-white drop-shadow-md">
                    {response.name}
                  </CardTitle>
                </CardHeader>

                {/* Dynamic Images Section */}
                {visualImages.length > 0 && (
                  <div className="px-6 pb-2">
                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-4 gap-4 mt-4">
                      {visualImages.map((img, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-xl aspect-square relative shadow-lg border border-white/10 hover:scale-105 transition-transform duration-300"
                        >
                          <Image
                            src={img}
                            alt={`Cocktail visual ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    {/* Mobile Carousel */}
                    <div className="md:hidden">
                      <Carousel className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                          {visualImages.map((img, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <div className="overflow-hidden rounded-xl aspect-square relative shadow-lg border border-white/10">
                                  <Image
                                    src={img}
                                    alt={`Cocktail visual ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-black/20 text-white border-none" />
                        <CarouselNext className="right-2 bg-black/20 text-white border-none" />
                      </Carousel>
                    </div>
                  </div>
                )}

                <CardContent className="space-y-6 pt-4">
                  <div className="bg-white/5 p-6 rounded-2xl italic text-center text-white/90 border border-white/10 backdrop-blur-sm shadow-sm">
                    "{response.description}"
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                      <h4 className="font-bold text-white mb-3 text-lg flex items-center justify-center md:justify-start border-b border-white/10 pb-2">
                        {t("ingredients")}
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-white/80">
                        {response.ingredients.map((ing, i) => (
                          <li key={i} className="leading-relaxed">
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                      <h4 className="font-bold text-white mb-3 text-lg text-center md:text-left border-b border-white/10 pb-2">
                        {t("instructions")}
                      </h4>
                      <div className="text-sm text-white/80 leading-relaxed text-center md:text-left space-y-2">
                        {response.instructions
                          ?.split(".")
                          .filter((step) => step.trim().length > 0)
                          .map((step, idx) => (
                            <p key={idx}>- {step.trim()}.</p>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/10">
                    <div>
                      <h4 className="font-semibold text-white mb-2 text-base text-center uppercase tracking-wider opacity-80">
                        {t("whyItFits")}
                      </h4>
                      <p className="text-base text-white/70 italic text-center max-w-2xl mx-auto">
                        {response.whyItFits}
                      </p>
                    </div>

                    {response.history && (
                      <div className="text-center">
                        <h4 className="font-semibold text-white mb-2 text-base uppercase tracking-wider opacity-80">
                          {t("history")}
                        </h4>
                        <p className="text-base text-white/70 max-w-2xl mx-auto">
                          {response.history}
                        </p>
                      </div>
                    )}

                    {response.funFact && (
                      <div className="text-center">
                        <h4 className="font-semibold text-white mb-2 text-base uppercase tracking-wider opacity-80">
                          {t("funFact")}
                        </h4>
                        <p className="text-base text-white/70 max-w-2xl mx-auto">
                          {response.funFact}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => setResponse(null)}
                    className="w-full mt-8 bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md py-6 text-lg rounded-xl transition-all hover:scale-[1.01]"
                  >
                    {t("tryNew")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
