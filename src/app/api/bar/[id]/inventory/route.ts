import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { name, category } = await req.json();

    // Check if it matches a global ingredient name
    const globalIngredient = await db.ingredient.findUnique({
      where: { name },
    });

    const item = await db.inventoryItem.create({
      data: {
        barId: id,
        customName: name,
        category,
        ingredientId: globalIngredient?.id || null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await db.inventoryItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
