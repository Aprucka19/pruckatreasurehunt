import { getHangmanConfig } from "~/server/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await getHangmanConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching hangman config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
} 