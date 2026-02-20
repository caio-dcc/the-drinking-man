"use client";

import { useState, useEffect, useMemo } from "react";
import { Cocktail } from "@/types";
import { DrinkCard } from "@/components/feature/DrinkCard";
import { CocktailSearch } from "@/components/feature/CocktailSearch";
import { Loader2, ChevronRight, ChevronLeft, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import GooeyNav from "@/components/ui/GooeyNav";
import Image from "next/image";

const ITEMS_PER_PAGE = 12;
const MAIN_DISTILLATES = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Whiskey",
  "Brandy",
];

import localCocktailsData from "@/data/cocktails.json";

export default function CocktailsPage() {
  const t = useTranslations("Gallery");
  const localCocktails = localCocktailsData as unknown as Cocktail[];

  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [displayedCocktails, setDisplayedCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Multi-filter state
  const [activeFilters, setActiveFilters] = useState<
    { type: string; value: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Extract unique ingredients for the dropdown
  const availableIngredients = useMemo(() => {
    if (dbIngredients.length > 0) {
      return dbIngredients.map((i) => i.name).sort();
    }
    const ingredientSet = new Set<string>();
    localCocktails.forEach((c) => {
      for (let i = 1; i <= 15; i++) {
        const ing = c[`strIngredient${i}` as keyof Cocktail] as string;
        if (ing && ing.trim()) {
          ingredientSet.add(ing.trim());
        }
      }
    });
    return [...ingredientSet].sort();
  }, [localCocktails, dbIngredients]);

  // Apply all active filters to get filtered results
  const applyFilters = (
    filters: { type: string; value: string }[],
    query: string,
  ) => {
    let results = [...localCocktails];

    // Apply search query
    if (query.trim()) {
      const lowerQ = query.toLowerCase();
      results = results.filter((c) =>
        c.strDrink.toLowerCase().includes(lowerQ),
      );
    }

    // Apply each filter
    filters.forEach((filter) => {
      if (filter.type === "category") {
        results = results.filter((c) => c.strCategory === filter.value);
      } else if (filter.type === "alcoholic") {
        results = results.filter((c) => c.strAlcoholic === filter.value);
      } else if (filter.type === "ingredient") {
        results = results.filter((c) => {
          if (
            c.ingredientsList &&
            c.ingredientsList.toLowerCase().includes(filter.value.toLowerCase())
          )
            return true;
          for (let i = 1; i <= 15; i++) {
            const ing = c[`strIngredient${i}` as keyof Cocktail] as string;
            if (ing && ing.toLowerCase() === filter.value.toLowerCase())
              return true;
          }
          return false;
        });
      }
    });

    return results;
  };

  // Update displayed page
  const updateDisplayedPage = (
    page: number,
    sourceList: Cocktail[] = filteredCocktails,
  ) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedCocktails(sourceList.slice(start, end));
  };

  // When filters or search change, recompute
  useEffect(() => {
    setLoading(true);
    const results = applyFilters(activeFilters, searchQuery);
    setFilteredCocktails(results);
    setCurrentPage(1);
    setLoading(false);
  }, [activeFilters, searchQuery]);

  // When page or filtered list changes, update displayed
  useEffect(() => {
    if (filteredCocktails.length > 0) {
      updateDisplayedPage(currentPage, filteredCocktails);
    } else {
      setDisplayedCocktails([]);
    }
  }, [currentPage, filteredCocktails]);

  // Initialize with all cocktails
  useEffect(() => {
    setFilteredCocktails(localCocktails);
    setLoading(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchQuery("");
    }
  };

  const handleFilter = (
    type: "category" | "alcoholic" | "ingredient",
    value: string,
  ) => {
    setActiveFilters((prev) => {
      // For category and alcoholic, we replace (only one at a time)
      // For ingredient, we allow multiple
      if (type === "category" || type === "alcoholic") {
        const filtered = prev.filter((f) => f.type !== type);
        return [...filtered, { type, value }];
      } else {
        // Ingredient: check if already exists
        if (prev.some((f) => f.type === type && f.value === value)) return prev;
        return [...prev, { type, value }];
      }
    });
  };

  const removeFilter = (type: string, value?: string) => {
    if (value) {
      setActiveFilters((prev) =>
        prev.filter((f) => !(f.type === type && f.value === value)),
      );
    } else {
      setActiveFilters((prev) => prev.filter((f) => f.type !== type));
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  const totalPages = Math.ceil(filteredCocktails.length / ITEMS_PER_PAGE);

  return (
    <div
      className="min-h-screen py-16 px-4 relative"
      style={{
        backgroundImage: "url('/background-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay to match the sections tone */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <div className="relative w-20 h-20 overflow-hidden">
            <Image
              src="/drinkingman-nobg2.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-7xl font-bold font-secondary text-white text-center drop-shadow-2xl">
            {t("title")}
          </h1>
        </div>

        {/* Distillates List */}
        <div className="flex justify-center flex-wrap gap-4 mb-20">
          <GooeyNav
            items={MAIN_DISTILLATES.map((spirit) => ({
              label: spirit,
              href: "#",
            }))}
            initialActiveIndex={-1}
            onItemClick={(item) => handleFilter("ingredient", item.label)}
            particleDistances={[50, 80]}
            particleCount={10}
            colors={[1, 2]}
          />
        </div>

        <CocktailSearch
          onSearch={handleSearch}
          onFilterChange={handleFilter}
          availableIngredients={availableIngredients}
        />

        {/* Active Filters Display */}
        {(activeFilters.length > 0 || searchQuery) && (
          <div className="flex justify-center flex-wrap gap-2 mt-6 mb-8">
            {searchQuery && (
              <div className="bg-white border border-[#5C3A2E]/30 rounded-full px-4 py-1.5 flex items-center gap-2 text-[#5C3A2E] shadow-md">
                <span className="text-sm font-medium">
                  {t("search")}:{" "}
                  <span className="font-bold">{searchQuery}</span>
                </span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:bg-[#5C3A2E]/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {activeFilters.map((filter, idx) => (
              <div
                key={`${filter.type}-${filter.value}-${idx}`}
                className="bg-white border border-[#5C3A2E]/30 rounded-full px-4 py-1.5 flex items-center gap-2 text-[#5C3A2E] shadow-md"
              >
                <span className="text-sm font-medium">
                  {t(filter.type === "ingredient" ? "ingredient" : "filter")}:{" "}
                  <span className="font-bold">{filter.value}</span>
                </span>
                <button
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="hover:bg-[#5C3A2E]/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {(activeFilters.length > 1 ||
              (activeFilters.length > 0 && searchQuery)) && (
              <button
                onClick={clearAllFilters}
                className="bg-red-500/80 text-white rounded-full px-4 py-1.5 text-sm font-medium hover:bg-red-600 transition-colors shadow-md"
              >
                {t("clearAll")}
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {displayedCocktails.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displayedCocktails.map((cocktail) => (
                    <DrinkCard key={cocktail.idDrink} cocktail={cocktail} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-4 mt-12 pb-12">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-white/40 bg-black/40 text-white hover:bg-white/20 hover:text-white h-12 w-12 backdrop-blur-md"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
                      <span className="text-white font-bold text-lg">
                        {currentPage} / {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-white/40 bg-black/40 text-white hover:bg-white/20 hover:text-white h-12 w-12 backdrop-blur-md"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-white/60">
                <p className="text-xl">{t("notFound")}</p>
                <p>{t("tryAgain")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
