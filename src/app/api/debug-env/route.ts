import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    GEMINI_API_KEY_PRESENT: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CWD: process.cwd(),
  });
}
