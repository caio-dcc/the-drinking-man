
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Cocktail, MoreCocktailInfo } from "../src/types/index.ts";

// Load env
dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const COCKTAILS_PATH = path.join(process.cwd(), "src", "data", "cocktails.json");

// Define extended interface ensuring we have the new fields
interface EnrichedCocktail extends Cocktail {
  moreInfoEN?: MoreCocktailInfo;
  moreInfoPT?: MoreCocktailInfo;
  moreInfoES?: MoreCocktailInfo;
}

async function getMoreInfo(cocktailName: string, ingredients: string[], language: string): Promise<MoreCocktailInfo | null> {
  const prompt = `
    Analyze the cocktail "${cocktailName}" with ingredients: ${ingredients.join(", ")}.
    Provide the following details in JSON format (do not use markdown code blocks):
    {
      "history": "Brief history of the drink (max 50 words).",
      "funFact": "An interesting fact about the drink (max 30 words).",
      "foodPairings": ["Dish 1", "Dish 2", "Dish 3"],
      "servingTips": "Best way to serve it (glass, temperature, garnish).",
      "similarDrinks": ["Drink 1", "Drink 2", "Drink 3"]
    }
    Language: ${language === "pt" ? "Portuguese" : language === "es" ? "Spanish" : "English"}.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean potential markdown
    if (text.startsWith("```json")) {
      text = text.replace(/```json/g, "").replace(/```/g, "");
    }

    return JSON.parse(text) as MoreCocktailInfo;
  } catch (error) {
    console.error(`Error enriching ${cocktailName} (${language}):`, error);
    return null;
  }
}

async function main() {
  console.log("Starting enrichment process...");
  
  const rawData = fs.readFileSync(COCKTAILS_PATH, "utf-8");
  const cocktails: EnrichedCocktail[] = JSON.parse(rawData);
  
  let modifiedCount = 0;

  for (let i = 0; i < cocktails.length; i++) {
    const cocktail = cocktails[i];
    const ingredients: string[] = [];
    
    for (let j = 1; j <= 15; j++) {
      const ing = cocktail[`strIngredient${j}` as keyof Cocktail];
      if (ing) ingredients.push(ing as string);
    }

    // Enrich EN
    if (!cocktail.moreInfoEN) {
      console.log(`[${i + 1}/${cocktails.length}] Enriching EN: ${cocktail.strDrink}`);
      const info = await getMoreInfo(cocktail.strDrink, ingredients, "en");
      if (info) {
        cocktail.moreInfoEN = info;
        modifiedCount++;
      }
      await new Promise(r => setTimeout(r, 2000)); // Rate limit buffer
    }

    // Enrich PT
    if (!cocktail.moreInfoPT) {
      console.log(`[${i + 1}/${cocktails.length}] Enriching PT: ${cocktail.strDrink}`);
      const info = await getMoreInfo(cocktail.strDrink, ingredients, "pt");
      if (info) {
        cocktail.moreInfoPT = info;
        modifiedCount++;
      }
      await new Promise(r => setTimeout(r, 2000));
    }

      // Enrich ES
    if (!cocktail.moreInfoES) {
      console.log(`[${i + 1}/${cocktails.length}] Enriching ES: ${cocktail.strDrink}`);
      const info = await getMoreInfo(cocktail.strDrink, ingredients, "es");
      if (info) {
        cocktail.moreInfoES = info;
        modifiedCount++;
      }
      await new Promise(r => setTimeout(r, 2000));
    }

    // Save every 5 cocktails to verify progress/safety
    if (i % 5 === 0 && modifiedCount > 0) {
      fs.writeFileSync(COCKTAILS_PATH, JSON.stringify(cocktails, null, 2));
      console.log("Progress saved.");
    }
  }

  // Final save
  fs.writeFileSync(COCKTAILS_PATH, JSON.stringify(cocktails, null, 2));
  console.log("Enrichment complete. Total modifications:", modifiedCount);
}

main();
