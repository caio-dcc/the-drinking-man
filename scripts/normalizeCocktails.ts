
import fs from "fs";
import path from "path";

const COCKTAILS_PATH = path.join(process.cwd(), "src", "data", "cocktails.json");

interface OldCocktail {
  [key: string]: any;
}

interface NewIngredient {
  name: string;
  measure: string;
  measurePT?: string | null;
  measureML?: number | null;
}

interface NewCocktail extends OldCocktail {
  ingredients: NewIngredient[];
}

function normalize() {
  console.log("Starting normalization...");
  
  const rawData = fs.readFileSync(COCKTAILS_PATH, "utf-8");
  const cocktails: OldCocktail[] = JSON.parse(rawData);
  
  const optimizedCocktails: NewCocktail[] = cocktails.map(c => {
    const ingredients: NewIngredient[] = [];
    
    for (let i = 1; i <= 15; i++) {
        const ingName = c[`strIngredient${i}`];
        const measure = c[`strMeasure${i}`];
        const measurePT = c[`strMeasurePT${i}`]; // Assuming we might have this from previous manual work
        const measureML = c[`strMeasureML${i}`]; // Normalized ML
        
        if (ingName) {
            ingredients.push({
                name: ingName.trim(),
                measure: measure ? measure.trim() : "",
                measurePT: measurePT || null,
                measureML: measureML ? Number(measureML) : null
            });
        }
        
        // Remove old flat keys to clean up
        delete c[`strIngredient${i}`];
        delete c[`strMeasure${i}`];
        delete c[`strMeasurePT${i}`];
    }
    
    return {
        ...c,
        ingredients
    } as NewCocktail;
  });

  fs.writeFileSync(COCKTAILS_PATH, JSON.stringify(optimizedCocktails, null, 2));
  console.log(`Normalized ${optimizedCocktails.length} cocktails.`);
}

normalize();
