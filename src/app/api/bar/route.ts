import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bars = await db.bar.findMany({
      where: {
        OR: [{ creatorId: userId }, { sharedWith: { some: { id: userId } } }],
      },
      include: {
        inventory: {
          include: {
            ingredient: true,
          },
        },
        sharedWith: true,
      },
    });

    return NextResponse.json(bars);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, creatorId } = await req.json();

    if (!creatorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bar = await db.bar.create({
      data: {
        name,
        creatorId,
      },
    });

    return NextResponse.json(bar);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
