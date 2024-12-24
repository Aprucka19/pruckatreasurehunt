import { NextResponse } from "next/server";
import { getHangmanConfig } from "~/server/queries";

export async function GET() {
  try {
    const config = await getHangmanConfig();
    return NextResponse.json({
      words: config.words,
      maxWrongGuesses: config.maxWrongGuesses,
      requiredWins: config.requiredWins,
      clue: config.clue
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 }
    );
  }
} 