import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export const getDb = () => {
  if (prisma) return prisma;

  const databaseUrl = process.env.DATABASE_URL;
  console.log(`[Prisma] Initializing Client with URL: ${databaseUrl}`);

  try {
    prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
    return prisma;
  } catch (error) {
    console.error("[Prisma] Failed to initialize client:", error);
    throw error;
  }
};

// For compatibility with existing imports
export const db = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getDb() as any)[prop];
  },
});

if (process.env.NODE_ENV !== "production") (global as any).prisma = db;
