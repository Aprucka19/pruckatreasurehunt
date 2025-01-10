import { getCrosswordConfig } from "~/server/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await getCrosswordConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching crossword config:", error);
    return NextResponse.json(
      { error: "Failed to fetch crossword configuration" },
      { status: 500 }
    );
  }
} 