import { NextResponse } from "next/server";
import { getParagonConfig } from "~/server/queries";

export async function POST(request: Request) {
  try {
    const { gameWon } = await request.json();
    if (gameWon) {
      const config = await getParagonConfig();
      return NextResponse.json({ clue: config.clue });
    }
    return NextResponse.json({ error: "Game not won" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
} 