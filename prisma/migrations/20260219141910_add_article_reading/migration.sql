-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cocktail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumb" TEXT,
    "imageSource" TEXT,
    "imageAttribution" TEXT,
    "creativeCommonsConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "alcoholic" TEXT NOT NULL,
    "glass" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "instructionsES" TEXT,
    "instructionsDE" TEXT,
    "instructionsFR" TEXT,
    "instructionsIT" TEXT,
    "instructionsPT" TEXT,
    "descriptionEN" TEXT,
    "descriptionPT" TEXT,
    "descriptionES" TEXT,
    "historyEN" TEXT,
    "historyPT" TEXT,
    "historyES" TEXT,
    "funFactEN" TEXT,
    "funFactPT" TEXT,
    "funFactES" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "CocktailIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cocktailId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "measure" TEXT NOT NULL,
    "measurePT" TEXT,
    "measureML" REAL,
    CONSTRAINT "CocktailIngredient_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CocktailIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "ingredientId" TEXT,
    "customName" TEXT,
    "quantity" REAL,
    "unit" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "author" TEXT NOT NULL DEFAULT 'The Drinking Man',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "link" TEXT,
    "image" TEXT,
    "review" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cocktail_externalId_key" ON "Cocktail"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Cocktail_slug_key" ON "Cocktail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CocktailIngredient_cocktailId_ingredientId_key" ON "CocktailIngredient"("cocktailId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
