
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const cocktailCount = await prisma.cocktail.count();
    const ingredientCount = await prisma.ingredient.count();
    console.log(`Cocktails: ${cocktailCount}`);
    console.log(`Ingredients: ${ingredientCount}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
