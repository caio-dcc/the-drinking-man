import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const ingredients = await db.ingredient.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    return NextResponse.json(ingredients);
  } catch (error: any) {
    const errorInfo = {
      message: error.message || "Unknown error",
      stack: error.stack,
      code: error.code
    };
    console.error("[Ingredients API] UNCAUGHT ERROR:", errorInfo);
    
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: errorInfo.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
