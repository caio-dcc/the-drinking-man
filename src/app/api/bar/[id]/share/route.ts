import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { username } = await req.json();

    const userToShare = await db.user.findUnique({
      where: { username },
    });

    if (!userToShare) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bar = await db.bar.update({
      where: { id },
      data: {
        sharedWith: {
          connect: { id: userToShare.id },
        },
      },
    });

    return NextResponse.json(bar);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const bar = await db.bar.update({
      where: { id },
      data: {
        sharedWith: {
          disconnect: { id: userId },
        },
      },
    });

    return NextResponse.json(bar);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
