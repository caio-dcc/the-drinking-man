'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { DrinkingManPreferences, DrinkingManResponse } from '@/types';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'debug_gemini.log');

function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

// Initialize Gemini API
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

const GENERATION_CONFIG = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

export async function askDrinkingMan(
  preferences: DrinkingManPreferences,
  locale: string = 'en',
  unavailableIngredients: string[] = [],
  desiredIngredients: string[] = []
): Promise<DrinkingManResponse | null> {
  const logMsg = `[askDrinkingMan] Invoked. locale: ${locale}, blacklist: ${unavailableIngredients.length}, desired: ${desiredIngredients.length}`;
  console.log(logMsg);
  logToFile(logMsg);
  
  if (!apiKey) {
    const err = '[askDrinkingMan] Gemini API Key is missing';
    console.error(err);
    logToFile(err);
    return { error: err } as any;
  }

  const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Brazil)',
    'es': 'Spanish',
    'en': 'English'
  };

  const targetLanguage = languageMap[locale] || 'English'; 
  logToFile(`[askDrinkingMan] Target Language: ${targetLanguage}`);

  // Construct the inventory constraint string if applicable
  const inventoryConstraint = unavailableIngredients.length > 0
    ? `IMPORTANT: You represent a specific BAR. The following ingredients are OUT OF STOCK: ${unavailableIngredients.join(", ")}. Do NOT suggest a drink that requires these ingredients. If a requested drink typically needs them, suggest a creative substitution or a different drink entirely.`
    : "";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Act as "DrinkingMan", a sophisticated, witty, and knowledgeable cocktail expert.
    User preferences:
    - Base Spirit: ${preferences.baseSpirit}
    - Flavors: ${preferences.flavorProfile.join(", ")}
    - Occasion: ${preferences.occasion}
    - Mood: ${preferences.mood}
    - Language: ${targetLanguage}

    ${inventoryConstraint}
    ${desiredIngredients.length > 0 ? `The user SPECIFICALLY wants these ingredients to be included in the cocktail: ${desiredIngredients.join(", ")}. Try to incorporate them.` : ""}

    Create a unique cocktail recipe based on these preferences.
    Return ONLY a JSON object with this structure:
    {
      "name": "Cocktail Name (Do NOT use markdown, just the name string)",
      "description": "A sophisticated description of the drink, using the persona of DrinkingMan.",
      "ingredients": ["2 oz Spirit", "1 oz Mixer"],
      "instructions": "Step-by-step mixing instructions.",
      "whyItFits": "Why this drink matches the user's mood and occasion.",
      "history": "A fictional or real historical anecdote about the drink or its ingredients.",
      "funFact": "An interesting fact related to the drink.",
      "visualMatch": "A short search term to find a visual match for this drink (e.g. 'Blue Lagoon cocktail')"
    }
    
    IMPORTANT:
    - Write the "description", "whyItFits", "history", "funFact", and "instructions" content strictly in ${targetLanguage}.
    - If the language is Portuguese or Spanish, ALL measurements in "ingredients" MUST be in MILLILITERS (ml). Do not use oz.
    - If the language is Portuguese or Spanish, the "name" of the drink can be translated if appropriate, but do NOT add markdown like *bold*.
    - The "ingredients" list must be in ${targetLanguage}.
    - The "instructions" must be in ${targetLanguage}.
    
    Do not include markdown formatting code blocks. Just raw JSON.
  `;

    logToFile('[askDrinkingMan] Sending prompt to Gemini');
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });
    
    const text = result.response.text();
    logToFile(`[askDrinkingMan] Raw response received: ${text}`);

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      const err = '[askDrinkingMan] No JSON found in response';
      logToFile(err);
      return { error: err } as any;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      logToFile(`[askDrinkingMan] Success parsing JSON: ${parsed.name}`);
      return parsed as DrinkingManResponse;
    } catch (parseError: any) {
      const err = `[askDrinkingMan] JSON Parse Error: ${parseError.message}`;
      logToFile(err);
      // Fallback for common issues like trailing commas or weird characters
      const cleaned = jsonMatch[0]
        .replace(/,\s*\}/g, '}')
        .replace(/,\s*\]/g, ']');
      try {
        return JSON.parse(cleaned) as DrinkingManResponse;
      } catch (e: any) {
        const finalErr = `[askDrinkingMan] Final Cleanup Parse Error: ${e.message}`;
        logToFile(finalErr);
        return { error: finalErr } as any;
      }
    }
  } catch (error: any) {
    const err = `[askDrinkingMan] Gemini API Error: ${error.message}`;
    console.error(err);
    logToFile(err);
    return { error: err } as any;
  }
}

export async function getCocktailDescription(name: string, ingredients: string[]): Promise<string | null> {
  if (!apiKey) {
    console.error('Gemini API Key is missing');
    return null;
  }

  const prompt = `
    Describe the cocktail "${name}" (Ingredients: ${ingredients.join(', ')}) as if you were Stephen King writing a mysterious, atmospheric, and poetic passage. 
    Focus on the sensory experience—the color, the chill, the bite of the alcohol. 
    Make it captivating and slightly eerie, like a secret whispering in a dimly lit bar.
    Keep it strictly under 100 words. 
    Do not mention Stephen King or say "Here is a description". Just write the text.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        ...GENERATION_CONFIG,
        temperature: 1.0, // High creativity
      },
    });

    return result.response.text();
  } catch (error) {
    console.error('Error getting cocktail description:', error);
    return null;
  }
}

export async function enrichCocktailDetails(name: string, ingredients: string[], locale: string = 'en'): Promise<DrinkingManResponse | null> {
  if (!apiKey) {
    console.error('Gemini API Key is missing');
    return null;
  }
  
  // Use consistent model
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Brazil)',
    'es': 'Spanish',
    'en': 'English'
  };

  const targetLanguage = languageMap[locale] || 'English';

  const prompt = `
    You are DrinkingMan, the sophisticated robot butler mixologist.
    
    I need you to provide your signature entertaining details for the cocktail: "${name}" (Ingredients: ${ingredients.join(', ')}).
    
    Respond strictly in ${targetLanguage}.
    
    Respond in JSON format with the following structure (keys must stay in English, values in ${targetLanguage}):
    {
      "name": "${name}",
      "description": "A sensory, inviting description of the taste and experience.",
      "ingredients": [], 
      "instructions": "",
      "whyItFits": "Explain why this drink is a classic or a great choice in general.",
      "joke": "A dad joke about this drink. - DrinkingMan",
      "funFact": "An interesting historical fact or trivia about this specific cocktail.",
      "history": "The origin story of this cocktail.",
      "visualMatch": "" 
    }
    
    Note: Leave ingredients, instructions, and visualMatch as empty/default strings since we already have them. Focus on the creative fields: description, whyItFits, joke, funFact, history.
    
    Do not include markdown formatting. Just raw JSON.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const response = result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText) as DrinkingManResponse;
  } catch (error) {
    console.error('Error enriching cocktail details:', error);
    return null;
  }
}

export async function getMoreCocktailInfo(
  name: string,
  ingredients: string[],
  locale: string = 'en'
): Promise<import('@/types').MoreCocktailInfo | null> {
  if (!apiKey) {
    console.error('Gemini API Key is missing');
    return null;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Brazil)',
    'es': 'Spanish',
    'en': 'English'
  };

  const targetLanguage = languageMap[locale] || 'English';

  const prompt = `
    You are DrinkingMan, a sophisticated cocktail expert.
    
    I need detailed, extra information for the cocktail "${name}" (Ingredients: ${ingredients.join(', ')}).
    
    Respond strictly in ${targetLanguage}.
    
    Return ONLY a JSON object with this structure:
    {
      "history": "A detailed and engaging history of the drink (approx 3-4 sentences).",
      "funFact": "A surprising trivia fact different from the usual ones.",
      "foodPairings": ["Dish 1", "Dish 2", "Dish 3"],
      "servingTips": "Expert advice on how to serve or garnish it perfectly.",
      "similarDrinks": ["Drink 1", "Drink 2", "Drink 3"]
    }
    
    Do NOT use markdown. Just raw JSON.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error getting more cocktail info:', error);
    return null;
  }
}
