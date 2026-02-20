import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
    });
  } catch (error: any) {
    console.error("[Login API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
