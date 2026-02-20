
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load env
dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

const COCKTAILS_PATH = path.join(process.cwd(), "src", "data", "cocktails.json");

async function enrichBatch(batch, language) {
  // Construct a prompt for the batch
  const cocktailList = batch.map(c => `- ${c.name} (Ingredients: ${c.ingredients.join(", ")})`).join("\n");
  
  const prompt = `
    You are an expert mixologist. Analyze the following cocktails and provide cultural and serving details for each.
    
    Cocktails:
    ${cocktailList}
    
    Return a JSON ARRAY where each object corresponds to the cocktails in the same order.
    Each object must strictly follow this schema:
    {
      "cocktailName": "Name of the cocktail",
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
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error enriching batch (${language}):`, error.message);
    return null;
  }
}

async function main() {
  console.log("Starting optimizations BATCH enrichment process...");
  
  const rawData = fs.readFileSync(COCKTAILS_PATH, "utf-8");
  const cocktails = JSON.parse(rawData);
  
  const BATCH_SIZE = 15; // Increased batch size
  let modifiedCount = 0;

  // Process languages sequentially to check progress easily
  const languages = ["en", "pt", "es"];
  const fieldMap = { "en": "moreInfoEN", "pt": "moreInfoPT", "es": "moreInfoES" };

  for (const lang of languages) {
    console.log(`\n=== Processing Language: ${lang.toUpperCase()} ===`);
    
    // Group cocktails that need enrichment for this language
    const missing = [];
    const missingIndices = [];

    for (let i = 0; i < cocktails.length; i++) {
        if (!cocktails[i][fieldMap[lang]]) {
            const ingredients = [];
            for (let j = 1; j <= 15; j++) {
                const ing = cocktails[i][`strIngredient${j}`];
                if (ing) ingredients.push(ing);
            }
            missing.push({ name: cocktails[i].strDrink, ingredients });
            missingIndices.push(i);
        }
    }

    console.log(`Found ${missing.length} cocktails missing ${lang.toUpperCase()} info.`);

    // Process batches
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
        const batch = missing.slice(i, i + BATCH_SIZE);
        const indices = missingIndices.slice(i, i + BATCH_SIZE);
        
        console.log(`Enriching batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(missing.length/BATCH_SIZE)} (${lang})...`);
        
        const results = await enrichBatch(batch, lang);
        
        if (results && Array.isArray(results)) {
            results.forEach((res, idx) => {
                if (indices[idx] !== undefined && cocktails[indices[idx]]) {
                     // Safety check: ensure name matches roughly to avoid alignment issues
                     // but trusting order for now as prompt requests it
                     delete res.cocktailName; // clean up
                     cocktails[indices[idx]][fieldMap[lang]] = res;
                     modifiedCount++;
                }
            });
        }
        
        // Save intermediate
        fs.writeFileSync(COCKTAILS_PATH, JSON.stringify(cocktails, null, 2));
        await new Promise(r => setTimeout(r, 10000)); // Rate limit buffer
    }
  }

  console.log("\nEnrichment complete. Total modifications:", modifiedCount);
}

main();
